// Machine-readable companions to the page, generated at build time from data/incidents.json:
// JSON-LD for search engines, an Atom feed, a sitemap and llms.txt.
import {SEVERITY, SITE, STATUS, dayKey, esc, sortIncidents, subjectOf} from '../render.js';

const TITLE = 'The internet is on fire';
const DESCRIPTION = 'A central, community-maintained tracker of recent cybersecurity and AI incidents: breaches, backdoored packages, exploited vulnerabilities and AI platform incidents, each linked to its original source and labelled by how solid the evidence is.';
const REPO = 'https://github.com/Kuberwastaken/internetonfire';
const LICENSE = `${REPO}/blob/main/LICENSE`;
const AUTHOR = {'@type': 'Person', name: 'Kuber Mehta', alternateName: 'kuberwastaken', url: 'https://kuber.studio/', sameAs: ['https://x.com/kuberwastaken', 'https://github.com/Kuberwastaken']};
const entryURL = (i) => `${SITE}#${i.id}`;
const shareURL = (i) => `${SITE}i/${i.id}/`;
const when = (i) => i.disclosedAt || `${dayKey(i) || '2026-01-01'}T00:00:00Z`;

export function jsonLd(data) {
  const items = sortIncidents(data.incidents);
  const graph = [
    {'@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: TITLE, alternateName: 'internetonfire', description: DESCRIPTION, inLanguage: 'en', author: AUTHOR, publisher: AUTHOR},
    {'@type': 'WebPage', '@id': `${SITE}#webpage`, url: SITE, name: `${TITLE}: live cybersecurity and AI incident tracker`, isPartOf: {'@id': `${SITE}#website`},
      primaryImageOfPage: `${SITE}assets/og.jpg`, dateModified: data.updated, about: ['Cybersecurity incidents', 'Data breaches', 'Software supply chain attacks', 'AI security'], mainEntity: {'@id': `${SITE}#incidents`}},
    {'@type': 'Dataset', '@id': `${SITE}#dataset`, name: 'internetonfire incident log', description: DESCRIPTION, url: SITE, sameAs: REPO, creator: AUTHOR, license: LICENSE,
      dateModified: data.updated, isAccessibleForFree: true, keywords: ['cybersecurity', 'data breach', 'supply chain attack', 'npm', 'PyPI', 'vulnerability', 'ransomware', 'AI security', 'incident tracker'],
      distribution: [{'@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE}data/incidents.json`}],
      variableMeasured: ['status', 'tags', 'disclosureDate', 'sources']},
    {'@type': 'ItemList', '@id': `${SITE}#incidents`, name: 'Recent cybersecurity and AI incidents', numberOfItems: items.length, itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: items.map((i, n) => ({'@type': 'ListItem', position: n + 1, url: entryURL(i), name: i.name, description: i.summary}))},
  ];
  // "<" is escaped so no incident text can close the script element.
  return `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replace(/</g, '\\u003c')}</script>`;
}

export function atomFeed(data) {
  const items = sortIncidents(data.incidents).slice(0, 100);
  const updated = items.reduce((m, i) => (when(i) > m ? when(i) : m), `${data.updated}T00:00:00Z`);
  const entries = items.map((i) => `  <entry>
    <id>${esc(entryURL(i))}</id>
    <title>${esc(i.name)}</title>
    <link href="${esc(shareURL(i))}"/>
    <updated>${esc(when(i))}</updated>
    <summary>${esc(`${SEVERITY[i.severity] ? SEVERITY[i.severity].label + ' severity · ' : ''}${STATUS[i.status]?.label || i.status}. ${i.summary}`)}</summary>
${(i.tags || []).map((t) => `    <category term="${esc(t)}"/>`).join('\n')}
  </entry>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${TITLE}</title>
  <subtitle>${esc(DESCRIPTION)}</subtitle>
  <id>${SITE}</id>
  <link href="${SITE}"/>
  <link rel="self" href="${SITE}feed.xml"/>
  <icon>${SITE}assets/favicon.svg</icon>
  <author><name>Kuber Mehta</name><uri>https://x.com/kuberwastaken</uri></author>
  <updated>${esc(updated)}</updated>
${entries}
</feed>
`;
}

export function sitemap(data) {
  const urls = [
    [SITE, data.updated, 'daily', '1.0', `<image:image><image:loc>${SITE}assets/og.jpg</image:loc><image:title>The internet is on fire. This is fine.</image:title></image:image>`],
    [`${SITE}llms.txt`, data.updated, 'daily', '0.6', ''],
    [`${SITE}data/incidents.json`, data.updated, 'daily', '0.5', ''],
    [`${SITE}feed.xml`, data.updated, 'daily', '0.5', ''],
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([loc, mod, freq, pri, extra]) => `  <url><loc>${loc}</loc><lastmod>${mod}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority>${extra}</url>`).join('\n')}
</urlset>
`;
}

export function llmsTxt(data, tags) {
  const items = sortIncidents(data.incidents);
  const line = (i) => `- [${i.name}](${shareURL(i)}): ${SEVERITY[i.severity] ? SEVERITY[i.severity].label + ' severity, ' : ''}${(STATUS[i.status]?.label || i.status).toLowerCase()}, disclosed ${dayKey(i) || 'date unknown'}. ${i.summary}${(i.tags || []).length ? ` Tags: ${i.tags.join(', ')}.` : ''}`;
  return `# internetonfire

> ${DESCRIPTION} Maintained by Kuber Mehta (@kuberwastaken). Entries are triaged by an AI agent and corrected by the community through GitHub. Last source check: ${data.updated}.

Severity (how bad it is, judged on what happened rather than CVSS alone): ${Object.entries(SEVERITY).map(([k, s]) => `**${k}** (${s.hint.charAt(0).toLowerCase() + s.hint.slice(1)})`).join('; ')}.

Evidence (how well-sourced it is): ${Object.entries(STATUS).map(([k, s]) => `**${k}** (${s.hint.toLowerCase()})`).join('; ')}. Entries are grouped by the day they went public, not the day they happened. An outage is not proof of a breach; a CVE is not proof of exploitation. Quote the status label along with any claim.

## Data

- [incidents.json](${SITE}data/incidents.json): the full log. Each incident has id, name, subject, summary, severity, status, date, disclosureDate, tags, sources (label, url, kind: primary|report|post|response, date), an optional correction and an optional detail object (whatHappened, exposure, fix, remaining, responses, claimChecks).
- [tags.json](${SITE}data/tags.json): the tag vocabulary.
- [Atom feed](${SITE}feed.xml): newest incidents.
- Link to one incident with \`${SITE}#<id>\`, or \`${SITE}i/<id>/\` for a link with its own preview card.

## Contribute

Submissions are GitHub issues and pull requests on [Kuberwastaken/internetonfire](${REPO}). Bring an original source. No credentials, leaked data or exploit code.

\`\`\`sh
# report an incident (opens the issue form)
gh issue create -R Kuberwastaken/internetonfire --web

# vote on a submission in review (+1 or -1)
gh api -X POST repos/Kuberwastaken/internetonfire/issues/<number>/reactions -f content=+1
\`\`\`

To change the data directly, edit data/incidents.json and open a PR; the [contribution guide](${REPO}/blob/main/CONTRIBUTING.md) has the format. Tags: ${tags.map((t) => t.id).join(', ')}.

## Incidents

${items.map(line).join('\n')}
`;
}
