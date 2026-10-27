# GhostAction October escalation: source check

Primary source: GitGuardian, Gaetan Ferry, October 27, 2026, "GhostAction Crosses Paths With PolinRider: Inside the October Escalation".
https://blog.gitguardian.com/ghostaction-x-polinrider/

The full article body was read, including execution limits, endpoint behavior, attribution uncertainty and remediation. This updates the existing GhostAction entry; it does not add a separate incident.

## What changed

- GitGuardian counted 72,026 operator commits across 22,964 public repositories, 2,875 owners and 1,792 pushing accounts in the October 13-21 wave. 1,382 of those accounts also pushed the October 8 payload. All counts are observed lower bounds, not confirmed theft or execution counts.
- Five families cover GitHub-hosted workflows, self-hosted runners, a fake-font Node.js stealer launched by a trusted VS Code folder-open task, and AWS role access attempts through OIDC.
- GitGuardian found no successful runs of the new malicious workflows. The self-hosted family originally had a YAML syntax error. The endpoint stealer does not use Actions and is outside GitHub's workflow hold. The article does not provide a confirmed endpoint infection or new stolen-secret total.
- Three families attempt host persistence via a crontab entry marked #ghc2. Removing repository files alone does not remove host persistence if code executed. Summaries describe the behavior without reproducing executable payloads.
- Last observed GhostAction commit: October 21, 04:37 UTC. Separate October 22-26 rewrites added PolinRider loaders to some GhostAction commits. There are no clear indicators that both campaigns have the same actor; copied launcher code and overlapping stolen tokens are the researchers' working hypothesis.

## Numeric caveat

The article says 14,906 repositories were earlier victims and 7,989 were new. These sum to 22,895, not its reported total of 22,964. The entry retains the headline total with attribution and omits the inconsistent old/new split, rather than inventing a reconciliation.

## Scope and chronology

Preserve the existing incident ID, original incident date, original disclosure date, prior-wave confirmed theft figures, all previous sources and all other incident objects. Update only the existing GhostAction object and the dataset's updated day to the source publication date. No design, renderer, workflow or code changes. No new incident, shared-actor attribution, confirmed AWS compromise, endpoint infection total or new theft total is inferred.
