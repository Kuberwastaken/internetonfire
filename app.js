import { timeMatch } from './time.js';
import { STATUS, barsHTML, dayKey, dayLabel, esc, icon, listHTML, safeURL, sortIncidents } from './render.js';

const REPO = 'Kuberwastaken/internetonfire';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = { q: '', status: 'all', window: 'all', day: null };
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
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw Error(String(r.status));
  const v = await r.json();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
  return v;
}

function visible() {
  const q = state.q.toLowerCase().trim();
  return sortIncidents(incidents.filter((i) =>
    (state.status === 'all' || i.status === state.status) &&
    (!state.day || dayKey(i) === state.day) &&
    ['within', 'possible'].includes(timeMatch(i, state.window)) &&
    (!q || [i.name, i.summary, i.category, i.correction, i.detail?.whatHappened].join(' ').toLowerCase().includes(q))));
}

function render() {
  const rows = visible();
  $('#incident-list').innerHTML = listHTML(rows, openIds);
  fixIcons($('#incident-list'));
  const filtered = state.q || state.status !== 'all' || state.window !== 'all' || state.day;
  $('#result-status').innerHTML = filtered
    ? `${rows.length} of ${incidents.length}${state.day ? ` · ${esc(dayLabel(state.day))}` : ''} <button type="button" class="clear" data-clear>Clear</button>`
    : '';
  $('#bars').innerHTML = barsHTML(incidents, localToday(), 30, state.day);
  $$('#window [data-window]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.window === state.window)));
  $$('#status [data-status]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === state.status)));
}

function renderChips() {
  const count = (s) => incidents.filter((i) => s === 'all' || i.status === s).length;
  $('#status').innerHTML = ['all', ...Object.keys(STATUS)].map((s) => {
    const n = count(s);
    if (s !== 'all' && !n) return '';
    const st = STATUS[s];
    return `<button type="button" data-status="${s}" class="chip${st ? ' st-' + s : ''}" title="${st ? esc(st.hint) : 'Everything'}" aria-pressed="false">${st ? st.icon() : ''}<span>${st ? st.label : 'All'}</span><span class="n">${n}</span></button>`;
  }).join('');
  $('#legend').innerHTML = Object.entries(STATUS).map(([k, s]) => `<li><span class="st st-${k}">${s.icon()}</span><b>${s.label}</b> ${esc(s.hint)}.</li>`).join('');
}

function renderHeadline() {
  const n = incidents.filter((i) => ['within', 'possible'].includes(timeMatch(i, 'week'))).length;
  $('[data-week]').textContent = n || 'No';
  $('[data-week-noun]').textContent = n === 1 ? 'incident' : 'incidents';
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
  if (!document.getElementById(id)) { Object.assign(state, { q: '', status: 'all', window: 'all', day: null }); $('#search').value = ''; render(); }
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
    renderChips(); renderHeadline(); render(); openFromHash();
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
    list.innerHTML = items.length ? items.map((i) => {
      const url = safeURL(i.html_url) || `https://github.com/${REPO}/pulls`;
      return `<li><a class="pr-title" href="${esc(url)}" target="_blank" rel="noopener">${i.pull_request ? icon.pr() : icon.issue()}<span><span class="num">#${esc(i.number)}</span> ${esc(i.title)}</span></a><a class="votes" href="${esc(url)}" target="_blank" rel="noopener" title="Vote on GitHub">👍 ${Number(i.reactions?.['+1'] || 0)}<span>👎 ${Number(i.reactions?.['-1'] || 0)}</span></a></li>`;
    }).join('') : '<li class="muted">Queue’s empty. <a href="#submit">Add one</a>.</li>';
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
  if (bar && !bar.disabled) { state.day = state.day === bar.dataset.day ? null : bar.dataset.day; state.window = 'all'; render(); return; }
  const win = t.closest('[data-window]');
  if (win) { state.window = win.dataset.window; state.day = null; render(); return; }
  const chip = t.closest('[data-status]');
  if (chip?.closest('#status')) { state.status = chip.dataset.status === state.status && state.status !== 'all' ? 'all' : chip.dataset.status; render(); return; }
  if (t.closest('[data-clear]')) { Object.assign(state, { q: '', status: 'all', window: 'all', day: null }); $('#search').value = ''; render(); return; }
  if (t.closest('[data-week-link]')) { state.window = 'week'; state.day = null; render(); return; }
  const clamped = t.closest('p.clamp');
  if (clamped && !getSelection().toString()) { clamped.classList.remove('clamp'); return; }
  const art = t.closest('.incident');
  if (art && (t.closest('.toggle') || t.closest('.chev') || (t.closest('.sum') && !getSelection().toString()))) toggle(art);
  if (t.closest('.perma')) { e.preventDefault(); toggle(art, true); navigator.clipboard?.writeText(location.href).catch(() => {}); }
});

$('#search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
$('#refresh-prs').addEventListener('click', (e) => { e.currentTarget.dataset.fresh = '1'; loadPRs(); });
addEventListener('hashchange', openFromHash);

fixIcons(document);
setupDog();
setupTip();
load();
loadPRs();
loadStars();
