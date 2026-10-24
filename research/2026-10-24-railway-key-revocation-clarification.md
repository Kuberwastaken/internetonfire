# Railway precautionary key-revocation clarification - research note, 2026-10-24

Source read fresh 2026-10-24 ~22:33 IST (Oct 24 17:03 UTC): https://status.railway.com/incident/8E4V5WLD (posted Oct 24 13:57 UTC, titled "Clarification: Recent Oct 24 API key revocations are precautionary").

## Verified facts (status page, verbatim substance)
- "Railway is not currently under attack." The recent AI-provider API key revocations are precautionary, tied to the Oct 21 incident, not a new security incident.
- On Oct 23, after the attacker's access was fully removed (Oct 22 03:32 UTC), AI providers requested another batch of potentially affected keys. Railway provided it to OpenAI and Anthropic but could not filter keys by creation time, so the batch inadvertently included newer keys; providers may have revoked replacement keys created after the incident.
- "These revocations do not indicate that your replacement keys were compromised."
- Action if a provider revoked a key: create a replacement, update the Railway environment variable, redeploy dependent services. Providers are contacting affected users directly.
- If keys still work, the notice does not require repeating completed rotations.

## Entry changes (narrow maintenance, existing entry only)
- responses: +1 (the Oct 24 13:57 UTC clarification, with the not-compromised emphasis and the replace/update/redeploy action).
- dateLabel, status, remaining, upper bounds and forensics caveats unchanged: the clarification changes nothing about impact scope, the pending final forensic report, or the resolved-operations state.
- This is not a new incident and is recorded as a response on the existing entry, per scope.
