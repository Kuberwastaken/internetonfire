# Railway incident resolved (Oct 23 22:06 UTC) - research note, 2026-10-24

Source read fresh 2026-10-24 ~04:18 IST (Oct 23 22:48 UTC): https://status.railway.com/incident/QH8L8B3E

## Verified facts (status page, Oct 23 22:06 UTC update, incident marked Resolved)
- "This incident has been resolved. Builds, deployments, the Railway API, and the dashboard are operating normally."
- New signups remain temporarily paused while Railway focuses on existing customers.
- station.railway.com remains unavailable, tracked in a separate notice: https://status.railway.com/incident/ZEO9X68O (verified same fetch: Oct 23 22:03 UTC notice, Triaging; dashboard, API, builds and deployments not affected; station and signups still down/paused).
- Railway still advises users who have not done so to rotate sensitive credentials stored in Railway environment variables, revoke the old credentials and redeploy dependent services.
- The preliminary report remains linked: https://blog.railway.com/p/preliminary-report-october-security-incident. The final forensic report is still pending.
- An intermediate Monitoring update at Oct 23 20:43 UTC (builds operational, possibly slower during redeploy backlog; station down; signups paused) is superseded by the 22:06 resolution.

## Caveats preserved
- Resolution is of platform operations, NOT a blanket all-clear on credential exposure: workspaces outside the higher-risk notification groups remain unconfirmed-safe per Railway's own Oct 23 19:18 UTC wording.
- The preliminary report's upper bound (1.85% of workspaces, ~100,000, potentially compromised) is an upper bound, not a confirmed count. Entry point undisclosed; source-code access not ruled out; final forensic report pending.

## Entry changes (narrow maintenance, existing entry only)
- responses: +1 (Oct 23 22:06 UTC resolution update, with the signups/station caveats and rotation reminder).
- remaining: Monitoring sentence replaced with resolution sentence, keeping the not-confirmed-safe caveat and upper bound.
- dateLabel: "Disclosed 21 Oct 2026; incident resolved 23 Oct, forensics ongoing".
- status stays "confirmed" (schema has no resolved enum; the compromise itself remains confirmed).
