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

Hit **+** on the site: fill in the name, what happened, a source and tags. Sign in with GitHub to submit in place, or hand it off to a prefilled GitHub issue, or copy it as a `gh` command. Or edit `data/incidents.json` and open a PR.

Everything waiting for review is listed on the site. Tap 👍 / 👎 to vote (one GitHub sign-in); it's a real reaction on the issue or PR. Votes set review order and never merge anything. From a terminal:

```sh
gh api -X POST repos/Kuberwastaken/internetonfire/issues/<number>/reactions -f content=+1
```

Sign-in goes through a GitHub App that is installed only on this repo with issues and pull-request write access, so the token can open issues, comment and react here and nowhere else. A tiny Cloudflare Worker (`worker/`) does the OAuth code exchange; the token stays in your browser. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

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
app.js                filters, bars, GitHub stars and review queue
contribute.js         submit dialog, voting, GitHub sign-in
worker/               Cloudflare Worker for the GitHub OAuth exchange
time.js               time-window matching
scripts/              validation and static build
tools/                favicon fetcher, social card prompt
scripts/setup-auth.mjs  one-time GitHub App + worker setup
```

Code is MIT. Inter is OFL (`assets/Inter-LICENSE.txt`). "This is fine" is by K.C. Green (`assets/THIS-IS-FINE.md`).

---

another dumb project by [@kuberwastaken](https://x.com/kuberwastaken)
