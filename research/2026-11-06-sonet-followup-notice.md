# Nov 6, 2026 - So-net/Plala: consolidated follow-up notice (existing incident maintenance)

Trigger: new So-net primary notice dated Nov 6, 2026. Scope: update the existing `sonet-plala-breach` entry only; no new incident, no UI changes (Codex owns design).

## Source (primary, full-read)
- https://www.so-net.ne.jp/info/2026/20261106_0001.html ("So-net会員情報漏洩に関するお詫びとお知らせ", Sony Network Communications, Nov 6, 2026). Consolidated follow-up to the Oct 27 publication and the My Page guidance that ran from Oct 28; addressed to affected customers with the history and detail restated.

## What the notice adds (verified against the page text)
- Leaked member-data items restated: name, phone number, user ID, date of birth, gender, connection ID, the free basic So-net email address, and the contact email address. DOB, gender and contact email are only affected where the customer had registered them. Customers whose basic So-net mailbox had already ended for long-term non-use had the address as it stood at termination exposed.
- Explicit non-leak confirmation: no passwords leaked for the So-net mail addresses, no user ID passwords (member-page login etc.), and no connection passwords for the connection IDs. This is about the basic mailbox and login/connection credentials; it does not walk back the separate ~54,000 mailbox-credential leak across Mail Service (G), A-Box, So-net VAIO Mail and PostPet mail, nor the 16 bank records from the Oct 27 disclosure.
- Affected population restated: current So-net members and former members who withdrew in March 2026 or later.
- Timeline restated: unauthorized access Oct 19, detected and confirmed Oct 23 (server stopped, attacker traffic cut), personal-information leak confirmed by Oct 24 investigation; reported to the Personal Information Protection Commission and others as required by law.
- Current status: as of the notice, So-net has confirmed no misuse of customer information and no secondary harm attributable to the incident; it warns the leaked data could be used for suspicious contact (phishing posing as So-net, or spoofing the customer's own address). Cause investigation continues.
- Customer contact: dedicated dial 0120-36-8887, 10:00-18:00 weekdays and Saturdays.

## Claims deliberately NOT made
- No "all passwords safe" claim: the 54,000 leaked mailbox credentials (four named services) and the 16 bank records stand; the Nov 6 notice's password language covers the basic mail address, member-page login user ID and connection ID passwords only.
- No "no harm, case closed" framing: the notice says no misuse or secondary harm confirmed *so far*; investigation ongoing.

## Changes
- data/incidents.json: only `sonet-plala-breach` touched (1 primary source added, dateLabel extended, exposure refined with the basic-address detail and non-leak confirmations, remaining updated to the no-confirmed-misuse status, 1 response added, existing password claimCheck extended). No other record, no UI files.
