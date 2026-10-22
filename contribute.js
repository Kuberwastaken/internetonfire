// Submitting incidents and voting on submissions through GitHub.
// With an auth endpoint configured (<meta name="iof-auth">), visitors sign in once and vote / submit in place.
// Without it, or when signed out, everything still works by handing off to GitHub (prefilled form) or the gh CLI.
import { esc, icon } from './render.js';

export const REPO = 'Kuberwastaken/internetonfire';
const API = 'https://api.github.com';
const AUTH = document.querySelector('meta[name="iof-auth"]')?.content.trim().replace(/\/$/, '') || '';
const TOKEN_KEY = 'iof-gh-token', USER_KEY = 'iof-gh-user', INTENT_KEY = 'iof-intent', DRAFT_KEY = 'iof-draft';
const $ = (s, root = document) => root.querySelector(s);

const store = {
  get: (k, s = localStorage) => { try { return JSON.parse(s.getItem(k) || 'null'); } catch { return null; } },
  set: (k, v, s = localStorage) => { try { v == null ? s.removeItem(k) : s.setItem(k, JSON.stringify(v)); } catch {} },
};

export const auth = {
  enabled: Boolean(AUTH),
  get token() { return store.get(TOKEN_KEY); },
  get user() { return store.get(USER_KEY); },
  signIn(intent) {
    store.set(INTENT_KEY, intent, sessionStorage);
    location.href = `${AUTH}/login?return=${encodeURIComponent(location.origin + location.pathname)}`;
  },
  signOut() { store.set(TOKEN_KEY, null); store.set(USER_KEY, null); renderAccount(); onChange(); },
};

let onChange = () => {};

export async function gh(path, { method = 'GET', body, token = auth.token } = {}) {
  const r = await fetch(API + path, {
    method,
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401 && token) { auth.signOut(); throw Error('signed-out'); }
  if (!r.ok) throw Error(String(r.status));
  return r.status === 204 ? null : r.json();
}

// ---- sign-in return ----

async function finishSignIn() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (!params.has('iof_token') && !params.has('iof_error')) return null;
  history.replaceState(null, '', location.pathname + location.search);
  const intent = store.get(INTENT_KEY, sessionStorage);
  store.set(INTENT_KEY, null, sessionStorage);
  if (!params.get('iof_token')) return null;
  store.set(TOKEN_KEY, params.get('iof_token'));
  try { const u = await gh('/user'); store.set(USER_KEY, { login: u.login, avatar: u.avatar_url }); } catch { return null; }
  return intent;
}

function renderAccount() {
  const slot = $('#account');
  if (!slot) return;
  const u = auth.user;
  slot.hidden = !u;
  if (!u) return;
  $('img', slot).src = u.avatar + (u.avatar.includes('?') ? '&' : '?') + 's=48';
  $('[data-login]', slot).textContent = '@' + u.login;
}

// ---- voting ----

const VOTE = { '+1': '👍', '-1': '👎' };
const mine = new Map(); // issue number -> { '+1': reactionId, '-1': reactionId }

export function votesHTML(item) {
  const n = Number(item.number);
  return Object.entries(VOTE).map(([c, e]) =>
    `<button type="button" class="vote" data-n="${n}" data-content="${c}" aria-pressed="${Boolean(mine.get(n)?.[c])}" title="${c === '+1' ? 'Upvote' : 'Downvote'}${auth.user ? '' : ' (GitHub)'}">${e} <span class="n">${Number(item.reactions?.[c] || 0)}</span></button>`).join('');
}

export async function loadMyVotes(items) {
  if (!auth.user) return;
  await Promise.all(items.slice(0, 30).map(async (i) => {
    try {
      const reactions = await gh(`/repos/${REPO}/issues/${Number(i.number)}/reactions?per_page=100`);
      const own = {};
      for (const r of reactions) if (r.user?.login === auth.user.login && VOTE[r.content]) own[r.content] = r.id;
      mine.set(Number(i.number), own);
    } catch {}
  }));
}

async function vote(btn) {
  const n = Number(btn.dataset.n), content = btn.dataset.content;
  if (!auth.enabled) { window.open(`https://github.com/${REPO}/issues/${n}`, '_blank', 'noopener'); return; }
  if (!auth.user) { auth.signIn({ type: 'vote', n, content }); return; }
  const row = btn.closest('li'), own = mine.get(n) || {};
  const bump = (c, d) => { const el = row.querySelector(`.vote[data-content="${c}"]`); el.querySelector('.n').textContent = Math.max(0, Number(el.querySelector('.n').textContent) + d); el.setAttribute('aria-pressed', String(d > 0)); };
  const other = content === '+1' ? '-1' : '+1';
  row.querySelectorAll('.vote').forEach((b) => (b.disabled = true));
  try {
    if (own[content]) {
      await gh(`/repos/${REPO}/issues/${n}/reactions/${own[content]}`, { method: 'DELETE' });
      delete own[content]; bump(content, -1);
    } else {
      const r = await gh(`/repos/${REPO}/issues/${n}/reactions`, { method: 'POST', body: { content } });
      own[content] = r.id; bump(content, +1);
      // One vote per person: an upvote replaces a downvote and vice versa.
      if (own[other]) { await gh(`/repos/${REPO}/issues/${n}/reactions/${own[other]}`, { method: 'DELETE' }).catch(() => {}); delete own[other]; bump(other, -1); }
    }
    mine.set(n, own);
    try { sessionStorage.removeItem('iof-prs'); } catch {}
  } catch (e) {
    if (e.message !== 'signed-out') btn.title = 'GitHub said no. Try again in a bit.';
  } finally { row.querySelectorAll('.vote').forEach((b) => (b.disabled = false)); }
}

// ---- submitting ----

const shq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

function readForm(form) {
  const f = new FormData(form);
  return {
    name: String(f.get('name') || '').trim(),
    summary: String(f.get('summary') || '').trim(),
    sources: String(f.get('sources') || '').trim(),
    date: String(f.get('date') || '').trim(),
    tags: f.getAll('tags').map(String),
    ok: f.get('ok') === 'on',
  };
}

function problems(d) {
  if (!d.name) return 'Give it a name.';
  if (!d.summary) return 'Say what happened.';
  if (!/https:\/\/\S+/.test(d.sources)) return 'Add at least one https:// source link.';
  if (!d.tags.length) return 'Pick at least one tag.';
  if (!d.ok) return 'Tick the box at the bottom.';
  return '';
}

// Same shape GitHub's issue form produces, so the labelling workflow and maintainers read both the same way.
function issueBody(d) {
  return [
    ['Incident name', d.name],
    ['What happened, or what needs correcting?', d.summary],
    ['Sources and responses', d.sources],
    ['Tags', d.tags.join(', ')],
    ['Date and timezone', d.date || 'unknown'],
    ['Before submitting', '- [x] I have not included credentials, private messages, leaked records or exploit payloads.\n- [x] I checked the incident log and open PRs for duplicates.'],
  ].map(([h, v]) => `### ${h}\n\n${v}`).join('\n\n') + '\n\n<sub>Sent from kuber.studio/internetonfire</sub>';
}

const issueTitle = (d) => `[Incident] ${d.name}`;

function githubURL(d) {
  const u = new URL(`https://github.com/${REPO}/issues/new`);
  u.searchParams.set('template', 'incident.yml');
  u.searchParams.set('title', issueTitle(d));
  for (const k of ['name', 'summary', 'sources', 'date']) if (d[k]) u.searchParams.set(k, d[k]);
  if (d.tags.length) u.searchParams.set('tags', d.tags.join(','));
  return u.href;
}

const ghCommand = (d) => `gh issue create -R ${REPO} -t ${shq(issueTitle(d))} -F - <<'IOF'\n${issueBody(d)}\nIOF`;

function setupDialog(tags) {
  const dialog = $('#submit-dialog'), form = $('#submit-form'), msg = $('.form-msg', form);
  if (!dialog) return;
  $('#tag-pick').innerHTML = tags.map((t) => `<label class="tag-opt" title="${esc(t.description)}"><input type="checkbox" name="tags" value="${esc(t.id)}"><span class="tag">${esc(t.id)}</span></label>`).join('');

  const primary = $('[data-primary]', form);
  const syncPrimary = () => {
    // Without sign-in the primary button already goes to GitHub, so the secondary link would repeat it.
    $('[data-open-gh]', form).hidden = !auth.enabled;
    primary.innerHTML = auth.enabled
      ? `${icon.github()}${auth.user ? `Submit as @${esc(auth.user.login)}` : 'Sign in & submit'}`
      : `${icon.github()}Continue on GitHub`;
  };

  const restore = () => {
    const d = store.get(DRAFT_KEY, sessionStorage);
    if (!d) return;
    for (const k of ['name', 'summary', 'sources', 'date']) form.elements[k].value = d[k] || '';
    for (const box of form.querySelectorAll('[name="tags"]')) box.checked = (d.tags || []).includes(box.value);
    form.elements.ok.checked = Boolean(d.ok);
  };

  const open = (note = '') => { restore(); syncPrimary(); msg.textContent = note; msg.className = 'form-msg'; dialog.showModal(); };
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  form.addEventListener('input', () => {
    store.set(DRAFT_KEY, readForm(form), sessionStorage);
    if (msg.classList.contains('bad')) { msg.textContent = ''; msg.className = 'form-msg'; }
  });
  $('[data-close]', dialog).addEventListener('click', () => dialog.close());

  const fail = (text) => { msg.textContent = text; msg.className = 'form-msg bad'; };

  $('[data-copy-gh]', form).addEventListener('click', async (e) => {
    const d = readForm(form), p = problems(d);
    if (p) return fail(p);
    try { await navigator.clipboard.writeText(ghCommand(d)); msg.textContent = 'Copied. Paste it in a terminal with gh installed.'; msg.className = 'form-msg good'; }
    catch { fail('Couldn’t reach the clipboard.'); }
    e.currentTarget.blur();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = readForm(form), p = problems(d);
    if (p) return fail(p);
    if (!auth.enabled) { window.open(githubURL(d), '_blank', 'noopener'); return; }
    if (!auth.user) { store.set(DRAFT_KEY, d, sessionStorage); auth.signIn({ type: 'submit' }); return; }
    primary.disabled = true; msg.textContent = 'Sending…'; msg.className = 'form-msg';
    try {
      const issue = await gh(`/repos/${REPO}/issues`, { method: 'POST', body: { title: issueTitle(d), body: issueBody(d) } });
      store.set(DRAFT_KEY, null, sessionStorage); form.reset();
      msg.innerHTML = `Sent: <a href="${esc(issue.html_url)}" target="_blank" rel="noopener">#${Number(issue.number)}</a>. It’s in the review queue now.`;
      msg.className = 'form-msg good';
      try { sessionStorage.removeItem('iof-prs'); } catch {}
      onChange();
    } catch (err) {
      fail(err.message === 'signed-out' ? 'Your GitHub sign-in expired. Hit the button again.' : 'GitHub didn’t take it. Try “Open on GitHub” instead.');
      syncPrimary();
    } finally { primary.disabled = false; }
  });

  $('[data-open-gh]', form).addEventListener('click', (e) => {
    e.preventDefault();
    window.open(githubURL(readForm(form)), '_blank', 'noopener');
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-submit]')) { e.preventDefault(); open(); }
  });
  return open;
}

export async function setupContribute({ tags, refresh }) {
  onChange = refresh;
  const intent = await finishSignIn();
  renderAccount();
  $('#account [data-signout]')?.addEventListener('click', () => auth.signOut());
  $('#account > button')?.addEventListener('click', (e) => { const m = $('#account .menu'); m.hidden = !m.hidden; e.stopPropagation(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('#account')) { const m = $('#account .menu'); if (m) m.hidden = true; } });
  document.addEventListener('click', (e) => { const b = e.target.closest('.vote'); if (b) vote(b); });
  const open = setupDialog(tags);
  if (intent?.type === 'submit' && auth.user) open?.(`Signed in as @${auth.user.login}. Hit submit.`);
  return intent;
}

export async function applyVoteIntent(intent) {
  if (intent?.type !== 'vote' || !auth.user) return;
  const btn = document.querySelector(`.vote[data-n="${Number(intent.n)}"][data-content="${intent.content === '-1' ? '-1' : '+1'}"]`);
  if (btn && btn.getAttribute('aria-pressed') !== 'true') { btn.scrollIntoView({ block: 'center' }); await vote(btn); }
}
