# Add an incident. Bring a source.

1. Check the existing log and [open pull requests](https://github.com/Kuberwastaken/internetonfire/pulls) for duplicates.
2. Fork the repository. Add or update one entry in `data/incidents.json`. Use the example below. Keep descriptions short and factual.
3. Run `npm ci`, `npm test` and `npm run build`. Open a pull request with the original source, disclosure date, and vendor response if one exists.
4. React 👍 or 👎 on the pull request description. Explain substantive objections in a comment. Reactions help reviewers prioritise; they never automatically merge a change.
5. A maintainer checks evidence, dates, privacy and wording before merging. Merging to `main` publishes the site through GitHub Pages.

No git setup? [Open an incident report](https://github.com/Kuberwastaken/internetonfire/issues/new?template=incident.yml). A maintainer can turn it into a PR. A free GitHub account is required for submissions and reactions.

## Entry format

```json
{
  "id": "vendor-incident-2026",
  "name": "Vendor: what happened, in one line",
  "subject": "Vendor",
  "summary": "A short description of what the source actually supports.",
  "status": "reported",
  "severity": "high",
  "date": "2026-10-22",
  "dateLabel": "Disclosed 22 Oct 2026",
  "tags": ["supply-chain", "npm", "malware"],
  "sources": [
    {
      "label": "Incident report",
      "url": "https://example.com/incident-report",
      "kind": "primary",
      "date": "2026-10-22"
    }
  ],
  "correction": "Optional context, disagreement, or limits of the evidence."
}
```

Replace the example URL with an actual source. Use `null` for unknown dates. The top-level `updated` date is the last editorial source check, not a claim that every incident happened then.

### Name

`name` is the headline people skim. Say who and what happened, with the number that matters, and nothing the sources don't support: "LiteLLM 1.107.0 shipped a credential stealer via PyPI and Docker", not "LiteLLM / backdoored releases". Keep hedges ("possibly", "claims") when the evidence is soft. Aim for under 75 characters.

### Severity

`severity` is how bad the incident is, separate from how well it's sourced (`status`). Judge what actually happened, not the CVSS score alone.

- `critical`: exploited or compromised at scale; secrets, data or code execution in attackers' hands. Act now.
- `high`: a real compromise with bounded scope, or a severe flaw that needs urgent patching.
- `medium`: patched with no known exploitation, contained, or limited impact.
- `low`: informational, such as a downstream response or an unsubstantiated claim.

A confirmed, patched bug with no exploitation is usually `medium`; a confirmed credential stealer in a popular package is `critical`. Change severity when the facts change, and say why in the PR.

### Subject

`subject` is the short name for the share card: "Vendor is on fire." Keep it to the product, company or thing that's burning (max 40 characters). Without it, the part of `name` before " / " is used.

### Tags

`tags` is a list of ids from [`data/tags.json`](data/tags.json): what happened (`breach`, `malware`, `exploited`), where (`npm`, `cloud`, `ai`) and who (`healthcare`, `india`). Pick every one that fits; they become filters on the site. If nothing fits, add a new tag to `data/tags.json` in the same PR with a one-line description. Keep ids short, lowercase and hyphenated. Maintainers mirror tags as GitHub labels so issues and PRs can be tagged too. (`category` is the old free-text field; entries that still have it show it until someone tags them.)

### Evidence status

- `confirmed`: a primary source supports this entry's specific description, not every claim in a thread.
- `reported`: attributed reporting supports the description, but direct confirmation is limited.
- `disputed`: material contradictory evidence exists. Describe both positions and link them.
- `unverified`: an unresolved claim with insufficient evidence. Do not phrase it as an established incident.

Source kinds: `primary` for original advisories or research; `report` for journalism; `post` for public posts; `response` for vendor or researcher replies. A public post can link evidence, but popularity alone is not confirmation. Keep dates of posts separate from the event date. Say whether the entry date is occurrence, disclosure or publication. Do not relabel old events "this week".

## Editorial checks

Distinguish vulnerabilities, exploitation, breaches, outages and allegations. An outage does not prove a breach. Patch severity is not proof of exploitation. Do not combine campaigns merely because their victims overlap. Attribute disputed assessments. Prefer an original advisory, then independent reporting, then public posts and responses. Add the X post permalink, not a search URL or screenshot without provenance. Keep a response beside the claim it addresses.

Do not submit credentials, private messages, leaked data, exploit payloads, instructions to attack systems, or identifying victim records. This is an incident index, not a leak mirror. Links must be HTTPS and lead to the claimed evidence. Avoid URL shorteners. Do not copy whole articles. Keep private correspondence out of PRs and commit history.

## Corrections and maintenance

Correct the existing entry rather than silently deleting inconvenient evidence. Explain material changes in `correction` and the PR description. Existing claims can be downgraded when sources fail. A date or confidence change needs evidence. Security-sensitive site bugs can be reported without publishing exploit details; never put tokens in an issue.

The site is static. There is no submission database and no anonymous voting backend. GitHub is the source of truth for submissions, PRs, reactions and review. Its public API may rate-limit the in-page PR list; the direct GitHub link always remains available. No reaction threshold or automation grants permission to merge. Changes to workflows, dependencies or executable code need separate code review, not just editorial review.

### Time filtering

When adding new records, set `disclosureDate` to the source publication/disclosure date (ISO date or null), separate from the incident occurrence date. Add `disclosedAt` only if the original source provides an exact timestamp with a verified timezone, for example `2026-10-22T08:00:00Z`. Do not infer clock times from “hours ago” or turn date-only evidence into midnight. Date-only records are excluded from last-hour results and labelled when their possible timezone range overlaps longer windows.
