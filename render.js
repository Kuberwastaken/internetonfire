// Pure HTML-string renderers, shared by the browser (app.js) and the static prerender (scripts/build.mjs).
// Every piece of data goes through esc() or safeURL(); nothing from incidents.json is trusted as markup.

const svg = (body, cls = '', fill = false) =>
  `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const FLAME = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';

export const icon = {
  flame: (cls) => svg(FLAME, cls),
  flameSolid: (cls) => svg(FLAME, cls, true),
  github: (cls) => svg('<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>', cls, true),
  x: (cls) => svg('<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/>', cls, true),
  star: (cls) => svg('<path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z"/>', cls),
  plus: (cls) => svg('<path d="M12 5v14M5 12h14"/>', cls),
  search: (cls) => svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', cls),
  help: (cls) => svg('<circle cx="12" cy="12" r="9.5"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>', cls),
  scale: (cls) => svg('<path d="M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>', cls),
  chevron: (cls) => svg('<path d="m6 9 6 6 6-6"/>', cls),
  copy: (cls) => svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>', cls),
  check: (cls) => svg('<path d="M20 6 9 17l-5-5"/>', cls),
  link: (cls) => svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>', cls),
  out: (cls) => svg('<path d="M7 17 17 7M8 7h9v9"/>', cls),
  pr: (cls) => svg('<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"/>', cls),
  issue: (cls) => svg('<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>', cls),
  refresh: (cls) => svg('<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>', cls),
  data: (cls) => svg('<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>', cls),
  pause: (cls) => svg('<path d="M9 5v14M15 5v14"/>', cls),
  play: (cls) => svg('<path d="M7 4.5v15l12-7.5z"/>', cls),
};

export const STATUS = {
  confirmed: { label: 'Confirmed', icon: icon.flameSolid, hint: 'A primary source backs it' },
  reported: { label: 'Reported', icon: icon.flame, hint: 'Credible reporting, no primary confirmation' },
  disputed: { label: 'Disputed', icon: icon.scale, hint: 'Sources disagree' },
  unverified: { label: 'Unverified', icon: icon.help, hint: 'A claim going around, not established' },
};

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function safeURL(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}

const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };
const href = (url) => esc(safeURL(url) || '#');
const ext = (url, inner, cls = '', title = '') =>
  `<a href="${href(url)}"${cls ? ` class="${cls}"` : ''}${title ? ` title="${esc(title)}"` : ''} target="_blank" rel="noopener noreferrer">${inner}</a>`;

export function favicon(url) {
  const h = host(url);
  return `<img class="fav" src="./assets/source-icons/${esc(h)}.png" alt="" width="16" height="16" data-letter="${esc(h.replace(/^(x|twitter)\.com$/, '𝕏').charAt(0).toUpperCase())}">`;
}

// Civil dates (YYYY-MM-DD) are formatted in UTC so the label never drifts a day by viewer timezone.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const utc = (key) => new Date(key + 'T00:00:00Z');
export const shortDate = (key) => (key ? `${utc(key).getUTCDate()} ${MONTHS[utc(key).getUTCMonth()]}` : '');
export const dayLabel = (key) => (key ? `${WEEKDAYS[utc(key).getUTCDay()]} ${shortDate(key)}` : 'Date unknown');
export const dayKey = (item) => item.disclosureDate || item.date || null;

export function addDays(key, n) {
  const d = new Date(key + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}

function verdictTone(v) {
  const s = String(v).toLowerCase();
  if (/not supported|false|wrong|overstated|incorrect/.test(s)) return 'no';
  if (/unverified|unknown/.test(s)) return 'unk';
  if (/partly|qualif|clarify|roughly|mostly|separate|condition|not cisa|but|reported by/.test(s)) return 'part';
  if (/support|accurate|right|true|correct/.test(s)) return 'yes';
  return 'part';
}
const TONE_MARK = { yes: '✓', part: '~', no: '✗', unk: '?' };
const KIND = { primary: 'primary', report: 'report', post: 'post', response: 'response' };

const block = (title, body) => (body ? `<section class="blk"><h4>${title}</h4>${body}</section>` : '');
// Long paragraphs start clamped; app.js unclamps on click.
const para = (text) => (text ? `<p${text.length > 420 ? ' class="clamp"' : ''}>${esc(text)}</p>` : '');

function moreHTML(item) {
  const d = item.detail || {};
  const claims = (d.claimChecks || []).map((c) => {
    const tone = verdictTone(c.verdict);
    return `<li class="claim ${tone}"><span class="mark" aria-hidden="true">${TONE_MARK[tone]}</span><div><q>${esc(c.claim)}</q> <span class="verdict">${esc(c.verdict)}</span><p>${esc(c.explanation)}${c.url && safeURL(c.url) ? ' ' + ext(c.url, icon.out(), 'inline-src', host(c.url)) : ''}</p></div></li>`;
  }).join('');
  const responses = (d.responses || []).map((r) =>
    `<li><b>${esc(r.by)}</b>${r.date ? ` <time datetime="${esc(r.date)}">${esc(shortDate(r.date))}</time>` : ''}<p>${esc(r.summary)}${r.url && safeURL(r.url) ? ' ' + ext(r.url, icon.out(), 'inline-src', host(r.url)) : ''}</p></li>`).join('');
  const sources = item.sources.map((s) =>
    `<li>${ext(s.url, `${favicon(s.url)}<span class="src-label">${esc(s.label)}</span>`)}<span class="src-meta">${esc(KIND[s.kind] || s.kind)}${s.date ? ' · ' + esc(shortDate(s.date)) : ''}</span></li>`).join('');
  return [
    block('What happened', para(d.whatHappened)),
    block('Exposed', para(d.exposure)),
    block('Do this', para(d.fix)),
    block('Still unknown', para(d.remaining)),
    block('Claims, checked', claims && `<ul class="claims">${claims}</ul>`),
    block('Responses', responses && `<ul class="responses">${responses}</ul>`),
    block('When', para(item.dateLabel)),
    block('Note', para(item.correction)),
    block('Sources', sources ? `<ul class="sources">${sources}</ul>` : '<p>No source yet. Got one? Send a PR.</p>'),
  ].join('');
}

export const SITE = 'https://kuber.studio/internetonfire/';

// "Node.js" in "Node.js is on fire." Falls back to the part of the name before " / ".
export const subjectOf = (item) => (item.subject || item.name.split(' / ')[0]).trim();

// Static page behind each share link. Crawlers read its tags (they never see #fragments);
// people are sent straight on to the entry. No meta refresh, so crawlers don't follow it home.
export function sharePageHTML(item) {
  const id = esc(item.id), title = esc(`${subjectOf(item)} is on fire.`);
  const desc = esc(item.summary.length > 200 ? item.summary.slice(0, 197).replace(/\s+\S*$/, '') + '…' : item.summary);
  const url = `${SITE}i/${id}/`, image = `${SITE}assets/og/${id}.jpg`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · internetonfire</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="internetonfire">
<meta property="og:url" content="${url}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${title} This is fine.">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@kuberwastaken"><meta name="twitter:creator" content="@kuberwastaken">
<meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${image}">
<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
<script>location.replace('../../#${id}')</script>
</head><body style="font:16px system-ui;padding:2rem"><a href="../../#${id}">${title}</a></body></html>
`;
}

export function tagsHTML(item, active = null) {
  // Entries submitted before tags existed fall back to their old free-text category.
  if (!Array.isArray(item.tags)) return item.category ? `<span class="tags"><span class="legacy">${esc(item.category)}</span></span>` : '';
  return `<span class="tags">${item.tags.map((t) => `<button type="button" class="tag${t === active ? ' on' : ''}" data-tag="${esc(t)}" aria-pressed="${t === active}">${esc(t)}</button>`).join('')}</span>`;
}

export function incidentHTML(item, open = false, activeTag = null) {
  const st = STATUS[item.status] || STATUS.unverified;
  const id = esc(item.id);
  const shown = item.sources.slice(0, 5).map((s) => ext(s.url, favicon(s.url), 'fav-link', s.label)).join('');
  const extra = item.sources.length > 5 ? `<span class="more-n">+${item.sources.length - 5}</span>` : '';
  return `<article class="incident${open ? ' open' : ''}" id="${id}" data-status="${esc(item.status)}">
<div class="head"><span class="st st-${esc(item.status)}" title="${st.label}: ${st.hint}">${st.icon()}<span class="sr">${st.label}</span></span><h3><button class="toggle" type="button" aria-expanded="${open}" aria-controls="${id}-more">${esc(item.name)}</button></h3><span class="share"><a class="perma" href="#${id}" title="Link to this">${icon.link()}<span class="sr">Link to ${esc(item.name)}</span></a><button type="button" class="copy" data-copy="${id}" title="Copy share link">${icon.copy()}<span class="sr">Copy share link</span></button></span></div>
<p class="sum">${esc(item.summary)}</p>
<div class="foot">${tagsHTML(item, activeTag)}<span class="favs">${shown}${extra}</span><button class="chev" type="button" aria-hidden="true" tabindex="-1">${icon.chevron()}</button></div>
<div class="more" id="${id}-more">${moreHTML(item)}</div>
</article>`;
}

export function listHTML(items, openIds = new Set(), activeTag = null) {
  if (!items.length) return '<p class="empty">Nothing here. Suspiciously fine.</p>';
  const groups = new Map();
  for (const item of items) { const k = dayKey(item) || ''; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(item); }
  let html = '';
  for (const [k, rows] of groups) {
    html += `<h2 class="day"><span>${esc(dayLabel(k || null))}</span><span class="n">${rows.length}</span></h2>`;
    html += rows.map((r) => incidentHTML(r, openIds.has(r.id), activeTag)).join('');
  }
  return html;
}

const WINDOW_PHRASE = { day: 'in the last 24 hours', week: 'in the last week', month: 'in the last 30 days', all: 'logged so far' };

// The hero line mirrors whatever filters are active, e.g. "12 confirmed incidents tagged #ai in the last week".
export function headlineHTML(count, { status = 'all', window = 'week', day = null, tag = null, q = '' } = {}) {
  const adj = status !== 'all' && STATUS[status] ? STATUS[status].label.toLowerCase() + ' ' : '';
  const noun = count === 1 ? 'incident' : 'incidents';
  const parts = [`<b>${count || 'No'}</b> ${adj}${noun}`];
  if (tag) parts.push(`tagged <span class="htag">#${esc(tag)}</span>`);
  if (q.trim()) parts.push(`matching “${esc(q.trim())}”`);
  parts.push(day ? `on ${esc(dayLabel(day))}` : WINDOW_PHRASE[window] || WINDOW_PHRASE.week);
  return parts.join(' ') + '.';
}

export function sortIncidents(items) {
  return [...items].sort((a, b) => (dayKey(b) || '').localeCompare(dayKey(a) || '') || (b.date || '').localeCompare(a.date || '') || a.name.localeCompare(b.name));
}

// One bar per civil day ending on `today`. Count = incidents that went public that day.
export function barsHTML(items, today, days = 30, selected = null) {
  const counts = new Map();
  for (const i of items) { const k = dayKey(i); if (k) counts.set(k, (counts.get(k) || 0) + 1); }
  const keys = Array.from({ length: days }, (_, n) => addDays(today, n - days + 1));
  const max = Math.max(1, ...keys.map((k) => counts.get(k) || 0));
  const bars = keys.map((k) => {
    const n = counts.get(k) || 0;
    const label = `${dayLabel(k)}: ${n} ${n === 1 ? 'incident' : 'incidents'}`;
    return `<button type="button" class="bar${n ? '' : ' zero'}${selected === k ? ' sel' : ''}" data-day="${k}" ${n ? '' : 'disabled '}aria-label="${esc(label)}" aria-pressed="${selected === k}" data-tip="${esc(label)}"><span style="height:${n ? Math.max(8, Math.round((n / max) * 100)) : 0}%"></span></button>`;
  }).join('');
  return `<div class="bars">${bars}</div><div class="axis"><span>${esc(shortDate(keys[0]))}</span><span>${esc(shortDate(keys[Math.floor(days / 2)]))}</span><span>Today</span></div>`;
}
