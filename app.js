import { timeMatch } from './time.js';
import { SEVERITY, STATUS, barsHTML, dayKey, dayLabel, esc, headlineHTML, icon, listHTML, safeURL, sortIncidents } from './render.js';
import { REPO, applyVoteIntent, auth, loadMyVotes, setupContribute, votesHTML } from './contribute.js';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const DEFAULTS = { q: '', status: 'all', severity: 'all', window: 'week', day: null, tag: null };
const state = { ...DEFAULTS };
const openIds = new Set();
let incidents = [];

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Short-lived sessionStorage cache so reloads don't burn the unauthenticated GitHub API quota.
async function cachedJSON(key, url, ttl = 600000) {
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (hit && Date.now() - hit.t < ttl) return hit.v;
  } catch {}
  // Signed-in visitors use their own (much larger) API quota.
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json', ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}) } });
  if (!r.ok) throw Error(String(r.status));
  const v = await r.json();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
  return v;
}

// Each name in `skip` leaves that filter out, so a chip can count what you'd get by picking it.
function visible(...skip) {
  const q = state.q.toLowerCase().trim();
  return sortIncidents(incidents.filter((i) =>
    (skip.includes('status') || state.status === 'all' || i.status === state.status) &&
    (skip.includes('severity') || state.severity === 'all' || i.severity === state.severity) &&
    (skip.includes('tag') || !state.tag || (i.tags || []).includes(state.tag)) &&
    // A picked day overrides the time window.
    (state.day ? dayKey(i) === state.day : ['within', 'possible'].includes(timeMatch(i, state.window))) &&
    (!q || [i.name, i.summary, ...(i.tags || []), i.category, i.correction, i.detail?.whatHappened].join(' ').toLowerCase().includes(q))));
}

function render() {
  const rows = visible();
  $('#incident-list').innerHTML = listHTML(rows, openIds, state.tag);
  fixIcons($('#incident-list'));
  $('[data-headline]').innerHTML = headlineHTML(rows.length, state);
  const filtered = Object.keys(DEFAULTS).some((k) => state[k] !== DEFAULTS[k]);
  $('#result-status').innerHTML = filtered
    ? `${rows.length} of ${incidents.length} <button type="button" class="clear" data-clear>Reset filters</button>`
    : '';
  $('#bars').innerHTML = barsHTML(incidents, localToday(), 30, state.day);
  $$('#window [data-window]').forEach((b) => b.setAttribute('aria-pressed', String(!state.day && b.dataset.window === state.window)));
  renderChips();
}

function renderChips() {
  // Re-rendering the rows must not jump their horizontal scroll or drop keyboard focus.
  const scroll = [$('#status').scrollLeft, $('#tagbar').scrollLeft];
  const focused = document.activeElement?.closest?.('#status [data-status], #status [data-severity], #tagbar [data-tag]');
  const refocus = focused && (focused.dataset.status ? `#status [data-status="${focused.dataset.status}"]` : focused.dataset.severity ? `#status [data-severity="${focused.dataset.severity}"]` : `#tagbar [data-tag="${CSS.escape(focused.dataset.tag)}"]`);
  // One row: All, then severity (how bad), then evidence (how sure). Each chip counts what picking it would show.
  const sevPool = visible('severity'), evPool = visible('status');
  const allChip = `<button type="button" data-status="all" class="chip" title="Every severity and evidence level" aria-pressed="${state.status === 'all' && state.severity === 'all'}"><span>All</span><span class="n">${visible('status', 'severity').length}</span></button>`;
  const sevChips = Object.entries(SEVERITY).map(([k, sv]) => {
    const n = sevPool.filter((i) => i.severity === k).length;
    return `<button type="button" data-severity="${k}" class="chip sev-chip sev-${k}${n ? '' : ' none'}" title="${esc(sv.label + ': ' + sv.hint)}" aria-pressed="${state.severity === k}"><span>${sv.label}</span><span class="n">${n}</span></button>`;
  }).join('');
  const evChips = Object.entries(STATUS).map(([k, st]) => {
    const n = evPool.filter((i) => i.status === k).length;
    return `<button type="button" data-status="${k}" class="chip st-${k}${n ? '' : ' none'}" title="${esc(st.label + ': ' + st.hint)}" aria-pressed="${state.status === k}">${st.icon()}<span>${st.label}</span><span class="n">${n}</span></button>`;
  }).join('');
  $('#status').innerHTML = allChip + sevChips + '<span class="chip-sep" aria-hidden="true"></span>' + evChips;
  // Tag order is fixed by overall use, so the row doesn't reshuffle under your finger.
  const overall = new Map(), now = new Map();
  for (const i of incidents) for (const t of i.tags || []) overall.set(t, (overall.get(t) || 0) + 1);
  for (const i of visible('tag')) for (const t of i.tags || []) now.set(t, (now.get(t) || 0) + 1);
  $('#tagbar').innerHTML = [...overall.keys()].sort((a, b) => overall.get(b) - overall.get(a) || a.localeCompare(b))
    .map((t) => `<button type="button" class="tag${now.get(t) ? '' : ' none'}" data-tag="${esc(t)}" aria-pressed="${t === state.tag}">${esc(t)}<span class="n">${now.get(t) || 0}</span></button>`).join('');
  [$('#status').scrollLeft, $('#tagbar').scrollLeft] = scroll;
  if (refocus) $(refocus)?.focus();
}

function renderLegend() {
  $('#legend').innerHTML =
    Object.entries(SEVERITY).map(([k, s]) => `<li><span class="sev sev-${k}">${s.label}</span>${esc(s.hint)}.</li>`).join('') +
    Object.entries(STATUS).map(([k, s]) => `<li><span class="ev st-${k}">${s.icon()}${s.label}</span>${esc(s.hint)}.</li>`).join('');
}

// Missing favicons fall back to the domain's first letter.
function fixIcons(root) {
  for (const img of root.querySelectorAll('img.fav')) {
    const swap = () => { const s = document.createElement('span'); s.className = 'fav fav-letter'; s.textContent = img.dataset.letter || '•'; img.replaceWith(s); };
    if (img.complete && img.naturalWidth === 0 && img.src) swap(); else img.addEventListener('error', swap, { once: true });
  }
}

function toggle(article, force) {
  const open = force ?? !article.classList.contains('open');
  article.classList.toggle('open', open);
  article.querySelector('.toggle').setAttribute('aria-expanded', String(open));
  if (open) openIds.add(article.id); else openIds.delete(article.id);
  history.replaceState(null, '', open ? '#' + article.id : location.pathname + location.search);
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || !incidents.some((i) => i.id === id)) return;
  if (!document.getElementById(id)) { Object.assign(state, DEFAULTS, { window: 'all' }); $('#search').value = ''; render(); }
  const a = document.getElementById(id);
  toggle(a, true);
  a.scrollIntoView({ block: 'start' });
}

async function load() {
  try {
    const r = await fetch('./data/incidents.json', { cache: 'no-cache' });
    if (!r.ok) throw Error(String(r.status));
    const data = await r.json();
    incidents = data.incidents;
    $('[data-updated]').textContent = 'Sources checked ' + dayLabel(data.updated);
    renderLegend(); render(); openFromHash();
  } catch {
    $('#incident-list').innerHTML = '<p class="empty">Couldn’t load the log. <a href="./data/incidents.json">Raw data</a></p>';
  }
}

async function loadPRs() {
  const btn = $('#refresh-prs'); btn.disabled = true;
  const list = $('#pr-list');
  try {
    const items = (await cachedJSON('iof-prs', `https://api.github.com/repos/${REPO}/issues?state=open&per_page=50`, btn.dataset.fresh ? 0 : 600000))
      .filter((i) => !i.draft);
    await loadMyVotes(items);
    list.innerHTML = items.length ? items.map((i) => {
      const url = safeURL(i.html_url) || `https://github.com/${REPO}/pulls`;
      return `<li><a class="pr-title" href="${esc(url)}" target="_blank" rel="noopener">${i.pull_request ? icon.pr() : icon.issue()}<span><span class="num">#${esc(i.number)}</span> ${esc(i.title)}</span></a>${(i.labels || []).length ? `<span class="tags">${i.labels.map((l) => `<span class="tag static">${esc(l.name)}</span>`).join('')}</span>` : ''}<span class="votes">${votesHTML(i)}</span></li>`;
    }).join('') : '<li class="muted">Queue’s empty. <a href="#submit" data-open-submit>Add one</a>.</li>';
  } catch {
    list.innerHTML = `<li class="muted">GitHub isn’t answering. <a href="https://github.com/${REPO}/pulls" target="_blank" rel="noopener">See PRs</a>.</li>`;
  } finally { btn.disabled = false; }
}

async function loadStars() {
  try {
    const repo = await cachedJSON('iof-repo', `https://api.github.com/repos/${REPO}`);
    if (typeof repo.stargazers_count !== 'number') return;
    const n = repo.stargazers_count;
    for (const el of $$('[data-stars]')) { el.textContent = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n); el.hidden = false; }
  } catch {}
}

function setupDog() {
  const video = $('.dog video'), btn = $('.dog-toggle');
  if (!video) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => { btn.innerHTML = video.paused ? icon.play() : icon.pause(); btn.setAttribute('aria-label', video.paused ? 'Play animation' : 'Pause animation'); };
  const flip = () => { if (video.paused) { video.preload = 'auto'; video.play().catch(() => {}); } else video.pause(); };
  video.addEventListener('play', sync); video.addEventListener('pause', sync);
  btn.addEventListener('click', flip); video.addEventListener('click', flip);
  btn.hidden = false; sync();
  if (!still.matches) { video.preload = 'auto'; video.play().catch(sync); }
}

function setupTip() {
  const tip = $('.tip'), chart = $('#bars');
  const show = (bar) => {
    tip.textContent = bar.dataset.tip; tip.hidden = false;
    const c = chart.getBoundingClientRect(), b = bar.getBoundingClientRect();
    const x = Math.min(Math.max(b.left - c.left + b.width / 2, tip.offsetWidth / 2), c.width - tip.offsetWidth / 2);
    tip.style.left = x + 'px';
  };
  chart.addEventListener('pointerover', (e) => { const b = e.target.closest('.bar'); if (b) show(b); });
  chart.addEventListener('focusin', (e) => { const b = e.target.closest('.bar'); if (b) show(b); });
  chart.addEventListener('pointerleave', () => { tip.hidden = true; });
  chart.addEventListener('focusout', () => { tip.hidden = true; });
}

document.addEventListener('click', (e) => {
  const t = e.target;
  const bar = t.closest('.bar');
  if (bar && !bar.disabled) { state.day = state.day === bar.dataset.day ? null : bar.dataset.day; render(); return; }
  const win = t.closest('[data-window]');
  if (win) { state.window = win.dataset.window; state.day = null; render(); return; }
  const chip = t.closest('[data-status]');
  if (chip?.closest('#status')) {
    if (chip.dataset.status === 'all') { state.status = 'all'; state.severity = 'all'; }
    else state.status = chip.dataset.status === state.status ? 'all' : chip.dataset.status;
    render(); return;
  }
  const sev = t.closest('[data-severity]');
  if (sev?.closest('#status')) { state.severity = sev.dataset.severity === state.severity ? 'all' : sev.dataset.severity; render(); return; }
  const tag = t.closest('[data-tag]');
  if (tag) { state.tag = state.tag === tag.dataset.tag ? null : tag.dataset.tag; render(); if (tag.closest('.incident')) $('#log').scrollIntoView({ block: 'start' }); return; }
  if (t.closest('[data-clear]')) { Object.assign(state, DEFAULTS); $('#search').value = ''; render(); return; }
  const clamped = t.closest('p.clamp');
  if (clamped && !getSelection().toString()) { clamped.classList.remove('clamp'); return; }
  const art = t.closest('.incident');
  if (art && (t.closest('.toggle') || t.closest('.chev') || (t.closest('.sum') && !getSelection().toString()))) toggle(art);
  if (t.closest('.perma')) { e.preventDefault(); toggle(art, true); }
  const copy = t.closest('.copy');
  if (copy) {
    // The share link (not the #fragment) gets this incident's own preview card on X, LinkedIn, Slack…
    const url = new URL(`./i/${copy.dataset.copy}/`, location.origin + location.pathname).href;
    navigator.clipboard?.writeText(url).then(() => {
      copy.innerHTML = icon.check() + '<span class="sr">Copied</span>'; copy.classList.add('done'); copy.title = 'Copied';
      setTimeout(() => { copy.innerHTML = icon.copy() + '<span class="sr">Copy share link</span>'; copy.classList.remove('done'); copy.title = 'Copy share link'; }, 1600);
    }).catch(() => { prompt('Copy this link', url); });
  }
});

$('#search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
$('#refresh-prs').addEventListener('click', (e) => { e.currentTarget.dataset.fresh = '1'; loadPRs(); });
addEventListener('hashchange', openFromHash);

async function start() {
  fixIcons(document);
  setupDog();
  setupTip();
  load();
  loadStars();
  const tags = await fetch('./data/tags.json').then((r) => r.json()).then((d) => d.tags).catch(() => []);
  const intent = await setupContribute({ tags, refresh: () => { $('#refresh-prs').dataset.fresh = '1'; loadPRs(); } });
  await loadPRs();
  applyVoteIntent(intent);
}
start();
