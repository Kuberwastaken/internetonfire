# Nov 1, 2026 - Amadeus: Malaysia Airlines confirmation (existing incident maintenance)

Trigger: source watcher surfaced Malaysia Airlines' Oct 30 notice confirming impact from the Amadeus incident. Scope: update the existing `amadeus-pss-airline-breach` entry only; no new incident, no UI changes (Codex owns design).

## Sources (full-read)
- Primary: https://www.malaysiaairlines.com/my/en/mh-media-centre/important-for-you/cybersecurity-incident-third-party-technology-provider.html ("Cybersecurity Incident Involving Third-Party Technology Provider", dated 30 Oct 2026 on the airline's media centre).
- Corroborating report: https://www.channelnewsasia.com/asia/malaysia-airlines-amadeus-security-breach-6510631 (CNA, published Nov 1, 2026).

## What the sources actually say (verified against the notice text)
- Malaysia Airlines confirms a cybersecurity incident involving Amadeus, its third-party airline reservation technology provider.
- The incident may have affected certain customer information processed through Amadeus between August 2023 and September 2026 - the same window JAL cited (Aug 2023 - Sep 2026).
- The airline states its own IT systems were not compromised and that there is currently no evidence financial information was accessed.
- No data types, customer counts, or misuse evidence are disclosed; the airline says it is investigating with Amadeus and will provide updates.
- CNA adds: Amadeus said it had become aware of a vulnerability affecting a travel booking display environment but did not respond to a question on how many customers' data were affected. CNA also lists Cathay Pacific, JAL and Asiana among carriers reporting in recent days.
- Note: CNA's article says the airline spoke "on Sunday (Nov 1)", but the notice itself is dated Oct 30 on the airline's site; the entry uses Oct 30 as the notice date and Nov 1 only as CNA's report date.

## Claims deliberately NOT made
- No data types or counts attributed to Malaysia Airlines: the notice discloses none.
- No claim that Malaysia Airlines' own systems were breached: the notice says the opposite.
- No change to the incident's overall disclosureDate (Oct 23, first airline confirmations); the Malaysia Airlines notice is a new confirming carrier, dated by its own Oct 30 notice.

## Changes
- data/incidents.json: only `amadeus-pss-airline-breach` touched (name, summary, dateLabel, 2 sources added, whatHappened extended, remaining extended, 1 response added, 1 claimCheck added) plus the top-level `updated` bump to 2026-11-01. No other record, no UI files.
