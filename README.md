# internetonfire

**The internet is on fire. This is fine.**

A running log of security incidents: breaches, backdoored packages, exploited bugs. Every entry links to its source and carries an evidence label. An AI agent does the triage; anyone can correct it with a PR.

[kuber.studio/internetonfire](https://kuber.studio/internetonfire/) · [Report an incident](https://github.com/Kuberwastaken/internetonfire/issues/new?template=incident.yml) · [Open PRs](https://github.com/Kuberwastaken/internetonfire/pulls) · [Contributing](CONTRIBUTING.md)

## Evidence labels

| | |
|---|---|
| **Confirmed** | A primary source (vendor advisory, researcher write-up) backs the description. |
| **Reported** | Credible reporting, no primary confirmation yet. |
| **Disputed** | Sources disagree. Both sides are linked. |
| **Unverified** | A claim going around. Not an established incident. |

Entries are grouped by the day they went public, not the day they happened. An outage isn't a breach; a CVE isn't proof of exploitation.

## Contributing and voting

Edit `data/incidents.json` and open a PR, or file an issue with the template. React 👍 / 👎 on a PR to vote; the site shows the counts. Votes set review order and never merge anything. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

## Run it

Node 22+ and Python 3.

```sh
npm ci
npm test            # schema, time windows, renderer
npm run build       # validates data, prerenders the log into dist/
npm run dev         # http://localhost:4173
npx playwright install chromium && npm run test:browser
```

No framework, no runtime dependencies. Pushes to `main` are tested and deployed to GitHub Pages.

```text
data/incidents.json   the log
render.js             HTML renderers shared by the browser and the build
app.js                filters, bars, GitHub stars and PR queue
time.js               time-window matching
scripts/              validation and static build
tools/                favicon fetcher, social card renderer
```

Code is MIT. Inter is OFL (`assets/Inter-LICENSE.txt`). "This is fine" is by K.C. Green (`assets/THIS-IS-FINE.md`).

---

another dumb project by [@kuberwastaken](https://x.com/kuberwastaken)
