# Oct 30-31, 2026 - HN incident wave triage (Northflank, Bunny CDN, Linode)

Trigger: user forwarded three leads from the Hacker News front page on Oct 31 ("binnode, bunny cdn, northflank -- check HN", then "update internet on fire for all please"). "binnode" matches no entity on HN or the web in this context; treated as the Linode story (the third front-page incident of the same wave; an HN commenter lists the day as "Bun, Cursor, Northflank, and now Linode"). Flagged to the user as an inference, not a certainty.

## Northflank - ADDED (confirmed, critical)
- HN "Northflank Breached" 404 pts / 299 comments (item 50305025), links https://status.northflank.com.
- Status page: Wiz threat alert 11:43 UTC Oct 30 -> patching within the hour -> 13:58 UTC "assume all environment variables have been decrypted, rotate all keys" -> users confirm unauthorised AI API key use -> possible match to Wiz "Black October" attacker IPs. Force-enabled Postgres/MongoDB rotation + audit logs for all tiers. Most platform components in major outage; app/API up.
- Wiz report (Oct 30): Northflank is the ninth AI developer platform incident this month (Fireworks, Andromeda, Zeabur, Lightning AI, OpenCode, Railway, Warp, CommandCode, Northflank). Zeabur, Railway, OpenCode, Warp already tracked here - same campaign context.

## Bunny CDN - ADDED (confirmed response, access unproven, medium)
- HN "Bunny CDN Security Incident" 212 pts / 40 comments (item 50308697), links https://status.bunny.net/incidents/p6gf1by9kr7m.
- Infrastructure provider intrusion via third-party server management software; one Armenia CDN node affected; pulled in 20 min, wiped, removed. No evidence of access found by either investigation, cannot be ruled out. All platform TLS certs reissued; managed custom-domain certs rotating through Oct 31. Provider unnamed.

## Linode - ADDED (advisory, reported, high)
- HN "Linode Security Incident" 176 pts / 98 comments (item 50310687), links https://status.linode.com/incidents/nt58zhx3pmgm.
- CVE-2026-98432: Linux kernel IPv4 use-after-free, remote unauthenticated, CVSS 9.8, published Oct 15 (linux-cve-announce, Red Hat RHSB-2026-016 critical). Akamai advisory opened Oct 30: investigating, deploying mitigations, no evidence of exploitation on the Akamai Compute platform. Filed as reported/advisory with a correction note against the "breach" reading.

Dedupe check against data/incidents.json before writing: no existing northflank/bunny/linode/akamai entries.

## Northflank follow-up - Oct 31 13:34 UTC (verified same day)
- Live re-check of https://status.northflank.com/cmvv0rn5a092f14rutwccodpp: new official update "Secret rotation for MySQL and Redis is now available to all customers. Please rotate all secrets if you have not already."
- Also on the timeline since the entry was written: Oct 31 01:04 UTC audit logs enabled for all customers including free users (already reflected in the entry's fix field).
- Record updated in place: dateLabel, primary source URL/date, fix, and Northflank response entry. Incident remains "Identified / major outage" per the status page; no new incident or UI change.

## Bunny CDN follow-up - Oct 31 12:50 UTC (verified same day)
- Live re-check of https://status.bunny.net/ (incident p6gf1by9kr7m timeline): managed TLS certificate reissuance COMPLETE - all managed certs reissued with new private keys, previous certs revoked, no action for managed customers; self-managed customers still advised to revoke/reissue.
- New posture facts: bunny.net has stopped using the affected provider while its investigation continues, and is changing configuration distribution so each PoP only receives config and TLS certs for the sites it actively serves. Both investigations still find no evidence of unauthorized access to the bunny.net server.
- Record updated in place: dateLabel, primary source date, fix, and bunny.net response entry. No new incident or UI change.
