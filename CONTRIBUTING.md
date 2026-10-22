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
  "name": "Vendor / incident name",
  "summary": "A short description of what the source actually supports.",
  "status": "reported",
  "date": "2026-10-22",
  "dateLabel": "Disclosed 22 Oct 2026",
  "category": "Supply chain",
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
