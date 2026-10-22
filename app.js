import {timeMatch} from './time.js';

const $ = selector => document.querySelector(selector);
const REPO = 'Kuberwastaken/internetonfire';
const labels = {confirmed: 'Confirmed', reported: 'Reported', disputed: 'Disputed', unverified: 'Needs evidence'};
const dateFormatter = new Intl.DateTimeFormat('en', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
const formatDate = value => value ? dateFormatter.format(new Date(value)) : 'Date unknown';
let incidents = [];

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function safeURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
}
function link(text, url, className) {
  const node = el('a', text, className);
  node.href = safeURL(url) || `https://github.com/${REPO}`;
  return node;
}
function publicationDate(item) {
  return item.disclosedAt || item.disclosureDate || '';
}
function sourceLink(source) {
  const url = safeURL(source.url);
  if (!url) return el('span', source.label);
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const a = link(hostname, url, 'source-link');
  a.title = source.label;
  const img = el('img');
  img.src = './assets/source-icons/' + hostname + '.png';
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => img.remove());
  a.prepend(img);
  return a;
}
function context(item) {
  const details = el('details');
  details.append(el('summary', `${item.sources.length} ${item.sources.length === 1 ? 'source' : 'sources'} & context`));
  const body = el('div', undefined, 'context');
  body.append(el('p', 'Event: ' + item.dateLabel, 'event-date'));
  if (publicationDate(item)) body.append(el('p', 'Published: ' + formatDate(publicationDate(item)) + (item.disclosedAt ? ' · ' + item.disclosedAt : ' · exact time not supplied'), 'event-date'));
  const detail = item.detail || {};
  for (const [key, title] of [['whatHappened', 'What happened'], ['exposure', 'Who is affected'], ['fix', 'Fix / response'], ['remaining', 'What is still unknown']]) {
    if (detail[key]) body.append(el('h4', title), el('p', detail[key]));
  }
  if (detail.responses?.length) {
    body.append(el('h4', 'Responses'));
    for (const response of detail.responses) {
      const p = el('p');
      p.append(link(response.by, response.url), document.createTextNode(' — ' + response.summary));
      body.append(p);
    }
  }
  if (detail.claimChecks?.length) {
    body.append(el('h4', 'Claims checked'));
    for (const check of detail.claimChecks) {
      const p = el('p');
      p.append(el('strong', check.claim + ' — ' + check.verdict + '. '), document.createTextNode(check.explanation + ' '), link('Source ↗', check.url));
      body.append(p);
    }
  }
  if (item.correction) body.append(el('h4', 'Correction / clarification'), el('p', item.correction));
  body.append(el('h4', 'Sources'));
  const list = el('ul', undefined, 'receipts');
  for (const source of item.sources) {
    const li = el('li');
    li.append(link(source.label, source.url), el('small', ' · ' + formatDate(source.date) + (source.verification === 'excerpt' ? ' · excerpt only' : '')));
    list.append(li);
  }
  body.append(list);
  details.append(body);
  return details;
}
function row(item) {
  const article = el('article', undefined, 'incident');
  article.id = item.id;
  const header = el('div', undefined, 'incident-header');
  const title = el('h3');
  const permalink = el('a', item.name);
  permalink.href = '#' + item.id;
  title.append(permalink);
  const published = publicationDate(item);
  const date = el(published ? 'time' : 'span', published ? formatDate(published) : 'Publication unknown', 'date');
  if (published) date.dateTime = published;
  header.append(title, date);
  const meta = el('div', undefined, 'metadata');
  meta.append(el('span', labels[item.status], 'evidence ' + item.status), el('span', item.category));
  article.append(header, meta, el('p', item.summary));
  if ($('#time-window').value !== 'all' && timeMatch(item, $('#time-window').value) === 'possible') {
    article.append(el('p', 'Date-only source: may overlap this window; exact time is not established.', 'small'));
  }
  const sources = el('div', undefined, 'links');
  const seen = new Set();
  for (const source of item.sources) {
    const url = safeURL(source.url);
    if (!url) continue;
    const host = new URL(url).hostname;
    if (!seen.has(host) && seen.size < 3) { sources.append(sourceLink(source)); seen.add(host); }
  }
  if (item.sources.length) article.append(sources);
  else article.append(el('p', 'No substantiating source yet. Help verify this claim.', 'small'));
  article.append(context(item));
  return article;
}
function render() {
  const query = $('#search').value.toLowerCase().trim();
  const status = $('#status').value;
  const window = $('#time-window').value;
  const rows = incidents.filter(item => ['within', 'possible'].includes(timeMatch(item, window)) &&
    (status === 'all' || item.status === status) &&
    [item.name, item.summary, item.category, item.correction, JSON.stringify(item.detail || {})].join(' ').toLowerCase().includes(query));
  rows.sort($('#sort').value === 'name'
    ? (a, b) => a.name.localeCompare(b.name)
    : (a, b) => publicationDate(b).localeCompare(publicationDate(a)) || a.name.localeCompare(b.name));
  const fragment = document.createDocumentFragment();
  rows.forEach(item => fragment.append(row(item)));
  if (!rows.length) fragment.append(el('p', window === 'hour'
    ? 'No incidents with a verified timestamp in the last hour. Date-only reports are not assigned an hour.'
    : 'Nothing matches. Try a different search or filter.', 'empty'));
  $('#incident-list').replaceChildren(fragment);
  $('#result-status').textContent = `${rows.length} of ${incidents.length} incidents` + (window === 'hour' ? ' · Exact timestamps only' : ' · By publication date');
}
let dataLoading = false;
async function load() {
  if (dataLoading) return;
  dataLoading = true;
  $('#refresh-data').disabled = true;
  try {
    const response = await fetch('./data/incidents.json', {cache: 'no-cache'});
    if (!response.ok) throw Error(response.status);
    const data = await response.json();
    incidents = data.incidents;
    $('#updated').textContent = 'Checked ' + formatDate(data.updated);
    render();
  } catch {
    if (!incidents.length) $('#incident-list').replaceChildren(el('p', 'The index could not load. Try refreshing, or read the source data linked below.', 'empty'));
    $('#updated').textContent = 'Could not refresh';
    $('#result-status').textContent = incidents.length ? 'Showing previously loaded records' : 'Incident data unavailable';
  } finally {
    dataLoading = false;
    $('#refresh-data').disabled = false;
  }
}
for (const id of ['search', 'status', 'sort', 'time-window']) $('#'+id).addEventListener(id === 'search' ? 'input' : 'change', render);
$('#refresh-data').addEventListener('click', load);

const dialog = $('#submit-dialog');
document.querySelectorAll('[data-submit]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('a[href="#method"]').addEventListener('click', () => { $('#method').open = true; });

let prLoading = false;
async function loadPRs() {
  if (prLoading) return;
  prLoading = true;
  $('#refresh-prs').disabled = true;
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=100`, {headers: {Accept: 'application/vnd.github+json'}});
    if (!response.ok) throw Error(response.status);
    const issues = await response.json();
    const prs = issues.filter(issue => issue.pull_request);
    const fragment = document.createDocumentFragment();
    if (!prs.length) fragment.append(el('p', 'No open pull requests right now. Submissions are open.', 'small'));
    for (const pr of prs) {
      const box = el('div', undefined, 'pr');
      const left = el('div');
      const title = link(`#${pr.number} ${pr.title}`, pr.html_url);
      left.append(title, el('br'), el('small', 'Opened ' + formatDate(pr.created_at)));
      const votes = link(`👍 ${pr.reactions?.['+1'] || 0}  👎 ${pr.reactions?.['-1'] || 0} · Vote on GitHub ↗`, title.href, 'votes');
      box.append(left, votes);
      fragment.append(box);
    }
    $('#pr-list').replaceChildren(fragment);
  } catch {
    const message = el('p', 'Live review list unavailable. ', 'small');
    message.append(link('View pull requests on GitHub ↗', `https://github.com/${REPO}/pulls`));
    $('#pr-list').replaceChildren(message);
  } finally {
    prLoading = false;
    $('#refresh-prs').disabled = false;
  }
}
$('#refresh-prs').addEventListener('click', loadPRs);

const dog = $('.dog-brand');
const pauseGif = $('#pause-gif');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
function setAnimation(playing) {
  dog.src = playing ? './assets/this-is-fine.gif' : './assets/this-is-fine.png';
  pauseGif.textContent = playing ? 'pause GIF' : 'play GIF';
  pauseGif.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
}
// A still image keeps the feed calm; animation is an explicit choice.
pauseGif.addEventListener('click', () => setAnimation(dog.src.endsWith('.png')));
motion.addEventListener('change', event => { if (event.matches) setAnimation(false); });

load().then(() => {
  // Initial hash navigation occurs before the async records exist.
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
});
loadPRs();
