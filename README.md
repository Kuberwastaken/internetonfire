# internetonfire

**The internet is on fire. Keep the receipts.**

A plain, source-linked notebook of security incidents, infrastructure failures and AI mishaps. Names, short descriptions, real dates, original reports, public posts and responses. No doom dashboard.

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

The browser suite starts its own local server, checks mobile and desktop layouts, search, filters, sort, source links, submission dialog, keyboard close, and GitHub API failure handling. It writes local screenshots to `test-results/`, which is not committed.

## How updates work

Edit `data/incidents.json` and send a PR. Schema checks reject missing dates, invalid statuses, unsafe source URLs, and unsourced confirmations. A maintainer reviews the actual evidence. Reactions on the PR body are visible on the site and are a review signal only. Nobody can vote an unsupported claim directly onto the page. [The contribution guide](CONTRIBUTING.md) has the format and review checklist.

GitHub Actions tests and builds pull requests with read-only permissions. Pushes to `main` deploy the tested static build with the official GitHub Pages actions. PR code never receives deployment credentials. Deployments use a concurrency group to prevent stale publishes. The public PR list is fetched on page load and manual refresh, not continuously polled. API errors leave a direct link to the review queue.

## Structure

```text
data/incidents.json  dated source records
app.js               safe DOM rendering, filters, PR list
style.css            responsive paper / ink layout
scripts/             schema validation and static build
tests/               data checks and browser checks
.github/             PR/issue templates and CI/deployment
```

## Type and assets

Body text uses [Inter](https://github.com/rsms/inter), licensed under the SIL Open Font License in `assets/Inter-LICENSE.txt`. Handwritten accents use Kuber's published prototype from [Kuber Hand](https://kuber.studio/handwriting-font/), used here at his request. No handwriting samples, source documents or private correspondence are included. The prototype is an accent font, not a claim to simulate newly handwritten text.

Code is MIT licensed. The Kuber Hand font remains its owner's work and is excluded from that code licence; no broader font redistribution grant is implied. Incident summaries are brief editorial descriptions with attribution links, not copied articles.
