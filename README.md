# internetonfire

**The internet is on fire. Keep the receipts.**

A source-linked index of security incidents, infrastructure failures and AI mishaps. A minimal dark layout, Inter typography, and the “This is fine” dog. Brief descriptions, publication dates, evidence labels, original reports, and corrections.

[Open the website](https://kuber.studio/internetonfire/) · [Submit an incident](https://github.com/Kuberwastaken/internetonfire/issues/new?template=incident.yml) · [Review PRs](https://github.com/Kuberwastaken/internetonfire/pulls) · [Contribute](CONTRIBUTING.md)

## Read it carefully

A viral list is not a dated incident report. Entries are marked **Confirmed**, **Reported**, **Disputed** or **Needs evidence**. Old incidents keep their real dates. Unknown dates stay unknown. Sources support the specific description, not every surrounding allegation. Corrections live beside the entry and in git history.

This is an open notebook, not an emergency alert service. Verify the advisory for your own systems before acting.

## Run locally

Requires Node.js 22+ and Python 3 for the local server.

```sh
npm ci
npm test
npm run build
npm run dev
```

Open `http://localhost:4173`. `npm run build` copies the static site to `dist/`; no framework or runtime package is needed in production.

For browser checks:

```sh
npx playwright install chromium
npm run test:browser
```

The browser suite starts its own local server, checks mobile and desktop layouts, search, filters, sort, source links, submission dialog, keyboard close, reduced-motion fallback and GitHub API failure handling. It writes local screenshots to `test-results/`, which is not committed.

## How updates work

Edit `data/incidents.json` and send a PR. Schema checks reject missing dates, invalid statuses, unsafe source URLs, and unsourced confirmations. A maintainer reviews the actual evidence. Reactions on the PR body are visible on the site and are a review signal only. Nobody can vote an unsupported claim directly onto the page. [The contribution guide](CONTRIBUTING.md) has the format and review checklist.

GitHub Actions tests and builds pull requests with read-only permissions. Pushes to `main` deploy the tested static build with the official GitHub Pages actions. PR code never receives deployment credentials. Deployments use a concurrency group to prevent stale publishes. The public PR list is fetched on page load and manual refresh, not continuously polled. API errors leave a direct link to the review queue.

## Structure

```text
data/incidents.json  dated source records
app.js               safe DOM rendering, filters, PR list
style.css            responsive dark layout
scripts/             schema validation and static build
tests/               data checks and browser checks
.github/             PR/issue templates and CI/deployment
```

## Type and assets

The interface uses self-hosted [Inter](https://github.com/rsms/inter), licensed under the SIL Open Font License in `assets/Inter-LICENSE.txt`. The dog illustration is credited to K.C. Green; provenance is in `assets/THIS-IS-FINE.md`. The illustration starts still and can be animated explicitly; reduced-motion preferences stop playback.

Code is MIT licensed. The Kuber Hand font remains its owner's work and is excluded from that code licence; no broader font redistribution grant is implied. Incident summaries are brief editorial descriptions with attribution links, not copied articles.

## Notebook time windows

Time filters use source publication/disclosure time, not the original incident occurrence date. `disclosedAt` is an optional exact ISO timestamp with timezone. `disclosureDate` is date-only when a source gives no clock time. Date-only records never qualify for last-hour results. A date-only record can appear as a labelled possible overlap in longer rolling windows, using a conservative timezone envelope rather than inventing midnight. All/history retains unknown and older entries.

Newest sorts by publication/disclosure date. Undated publications sort last. Event dates remain in the context disclosure, alongside expanded reporting, affected systems, responses, claim checks, corrections and all source links. Search includes the expanded reporting. The refresh button fetches the latest deployed incident data without a cached response.

All local URLs are relative, so the static build works at `https://kuber.studio/internetonfire/`. The top navigation links to GitHub for starring and opens the submission guide. The PR queue and GitHub reaction links remain at the bottom, with a shortcut above the log.

To run browser checks with an installed Chrome rather than Playwright Chromium, use `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`.
