# Oct 31, 2026 - Scribd breach (HN "Tell HN" lead)

Trigger: user forwarded https://news.ycombinator.com/item?id=50312756 ("Tell HN: Scribd Breached", 147 pts / 62 comments) with no instruction; triaged first (a bare forwarded link is not a publication order), user then approved with "Ship it".

## Scribd - ADDED (confirmed, medium)
- HN item 50312756: a user posted the verbatim breach notification email received Mon Oct 26, 2026. Sender: Epiq on behalf of Scribd, Inc. (parent of Scribd, Slideshare, Everand, Fable). Listed data: email address, last 4 digits of credit card + country, card issuer, card expiry, payment history (explicitly not full card details). No evidence of misuse; system secured, law enforcement + DPAs notified.
- Vendor primary: https://support.scribd.com/hc/en-us/articles/53787421531284-Information-about-the-recent-security-incident - confirms unauthorized third-party access, lateral movement to other internal systems, user info accessed ("basic account information" for most; "more sensitive information" for a smaller number, unspecified), vulnerability closed, phased notifications via Epiq, password reset recommended.
- Date conflict preserved: help-center article carries an "Updated October 01, 2026" stamp while the posted notice arrived Oct 26 and the HN thread is Oct 31; intrusion/discovery dates unstated. Entry anchored on the Oct 26 documented notification with the conflict explicit in dateLabel, correction and detail.remaining.
- No independent press coverage found at time of writing (search surfaced only the help-center page and the HN thread).

Dedupe check against data/incidents.json before writing: no existing scribd/slideshare/everand/fable entries (52 entries at main, incl. commit 8717fe9).
