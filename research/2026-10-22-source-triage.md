# Source triage - 22 October 2026

Public-source review for the agreed incident list. No leak samples or private records were accessed. New sources and expanded content are in `data/incidents.json`, under each incident's optional `detail` field. This content does not require a layout change.

## Scope

Meta Muse is excluded by the latest instruction. The separate Microsoft contextual entry is excluded. Plex is retained explicitly. Rajasthan Police is an explicit addition, kept unverified. Other entries map to the original list.

## Important corrections

- eMudhra: 60 million is lifetime issuance, not the number affected. Eight intermediate keys were weak; forgery was possible, not demonstrated. Company says they issued no end-entity certificates. Apple/Microsoft exact response dates are not independently verified.
- SBI: 3,897 PII records in preliminary review of about 375,000 records. Authenticity, origin and total scope remain under investigation.
- PHP: vendor confirms two critical 9.2 RCE bugs and Oct 21 fixed releases. Take offline if unpatchable/unsupported, not every PHP site. A stale claim that the planned release was Oct 22 was removed after reading PHP's own notice.
- GitLab: Oct 21 CVE-2026-110264, not the different Oct 12 bug. Current vendor notice does explicitly give CVSS 10.0, affected versions from 7.0 and fixed versions. Exploitation conditions are qualified.
- Node.js: ten CVEs, highest severity high; release date Oct 21, not an assumed today.
- Plex: vendor says 1.43.3.10861 and later are fixed. Older internet-facing installs may already be compromised. KEV due dates differ by CVE and bind US federal civilian agencies, not all users.
- Rajasthan: publicly reported attacker claims, not an established police-system compromise. No police statement found in the checked coverage.

## Enriched records

### Plex Media Server flaws exploited (Plex2Shell)

Status: confirmed.

**What happened:** Four Plex Media Server bugs (CVE-2026-96652, -96654, -96655, -96656) can be chained to steal an admin token and run code. Plex patched in 1.43.3 (the Sept 1 forum post). The researcher published details Oct 16 and a proof of concept three days later. Exploitation reports began Oct 17, first against honeypots to install a cryptominer. CISA added all four to KEV on Oct 20.

**Exposure:** Plex Media Server before 1.43.3.10861. Chaining the bugs can let an unauthenticated remote attacker run code with the privileges of the Plex server process. Individual flaw scores differ; a chain score is not each individual CVE's score.

**Fix / advice:** Update Plex Media Server to 1.43.3.10861 or newer. NAS installs may need a manual package install. Plex says an older server reachable from the internet should be treated as potentially compromised: update and follow its incident-response steps, not only apply the patch.

**Unknowns:** Servers not updated since August. How many real servers are compromised is unknown.

Sources:

- CISA: Adds Six Known Exploited Vulnerabilities to Catalog (2026-10-20): https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog
- BleepingComputer · Reporting (2026-10-21): https://www.bleepingcomputer.com/news/security/cisa-hackers-chain-plex-flaws-in-plex2shell-attacks-to-breach-servers/
- Ars Technica · Reporting (2026-10-19): https://arstechnica.com/security/2026/10/recently-fixed-plex-media-vulnerabilities-are-being-exploited-to-install-malware/
- SecurityWeek · Reporting (2026-10-19): https://www.securityweek.com/plex2shell-exploit-chain-weaponized-against-plex-servers-hours-after-disclosure/
- X · zm_0x (2026-10-16): https://x.com/zm_0x/status/2111138023543108005
- X · TheHackersNews (2026-10-20): https://x.com/TheHackersNews/status/2112391529126101243
- Plex forum security notice (2026-10-19): https://forums.plex.tv/t/important-security-update-for-plex-media-server-v1-43-2-and-earlier/942319
- CISA KEV data file (2026-10-22): https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.csv


### SBI customer data on dark web

Status: reported.

**What happened:** State Bank of India told stock exchanges on Oct 21, 2026 that about 375,000 records tied to it were found on the dark web, and that its preliminary analysis found 3,897 records with personal information. It learned of it on Oct 16 from its threat intelligence provider, the Defence Cyber Agency and CERT-In.

**Exposure:** For the 3,897: names, registered mobile numbers, dates of birth, gender, emails, addresses, branch and CIF identifiers, lead IDs and loan/lead metadata. The bank says authenticity and completeness still need a detailed investigation and that core operations are not affected.

**Fix / advice:** SBI activated incident response and hired a CERT-In-empanelled agency. Customers have not been given specific steps in the checked sources.

**Unknowns:** Source of the leak, authenticity and full scope are not established. The Internet Freedom Foundation says affected customers could get calls from people posing as SBI who can recite their details, and wants SBI to notify them (The Hindu). BusinessToday says a group called Siriusim had claimed the hack on BreachForums; that claim is not verified.

Sources:

- The Hindu: SBI admits exposure of customer data on the Dark Web (2026-10-21): https://www.thehindu.com/business/Economy/state-bank-of-india-investigates-exposure-customer-records-dark-web-october-21/article71606599.ece
- Moneycontrol: SBI flags data leak, says no material impact (2026-10-21): https://www.moneycontrol.com/banking/sbi-flags-incident-of-data-leak-says-no-material-impact-on-bank-s-business-operations-article-14056419.html
- Indian Express: SBI data leak explained (2026-10-21): https://indianexpress.com/article/explained/explained-economics/sbi-data-breach-customer-details-dark-web-exposure-10930302/
- Economic Times · Reporting (2026-10-21): https://economictimes.indiatimes.com/industry/banking/finance/banking/sbi-probes-suspected-data-breach-after-3-75-lakh-records-surface-on-dark-web/articleshow/135083347.cms
- BusinessToday (Siriusim claim) (2026-10-21): https://www.businesstoday.in/india/story/rajasthan-police-allegedly-hacked-70000-identity-records-and-59460-mobile-numbers-claimed-to-be-up-for-sale-562889-2026-10-21


### eMudhra / weak certificate keys

Status: confirmed.

**What happened:** In April 2025 eMudhra, an Indian certificate authority, ran a key ceremony that produced eight intermediate CA certificates with badly weak private keys. A researcher found they could be recovered from the public certificates (some keys were single or double digit numbers, one reportedly just 4). He reported it to Mozilla, Chrome, Apple and Microsoft on Oct 17, 2026. eMudhra revoked all eight on Oct 19.

**Exposure:** Anyone who worked out the keys could have forged a trusted certificate for any website, but only against software that does not check Certificate Transparency or revocation lists. Chrome and Google say no certificates chaining to these intermediates had been logged to CT, so CT-enforcing browsers could not have been attacked. No exploitation has been shown. The 'eight keys' were six TLS intermediates and two code-signing intermediates.

**Fix / advice:** Mozilla blocked them via OneCRL on Oct 17 (done for standard Firefox users by 22:59 UTC) and shipped Firefox 158.0.1, ESR 115.43.1 and 153.5.1, plus NSS 3.131.1 removing the signing root. Chrome blocked them by CRLSet the same day, and removed the emSign ECC Root CA - G3 from its root store. The reporter also says Apple and Microsoft blocked the certificates; their exact update dates were not independently verified here. Cloudflare, Node.js and Tailscale shipped updates.

**Unknowns:** Software that ships its own trust store or ignores revocation needs updates. eMudhra has not confirmed a root cause; it says a wrap/unwrap step created a second weak key set. It says seven of the eight were never used and the eighth issued no certificates. It says one US customer ecosystem needs replacement certificates. Investigation ongoing; MeitY has set up a probe panel.

Sources:

- eMudhra official statement (3 updates · Original source (2026-10-20): https://emudhra.com/en/post/certificate-security-incident
- Cloudflare · Original source (2026-10-20): https://blog.cloudflare.com/emudhra-certificate-compromise
- Scott Helme · Original source (2026-10-20): https://scotthelme.ghost.io/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/
- The Register · Reporting (2026-10-20): https://www.theregister.com/security/2026/10/20/indian-certification-authority-emudhras-private-keys-compromised-one-of-them-was-the-number-4/5304312
- CSO Online · Reporting (2026-10-21): https://www.csoonline.com/article/4238338/google-mozilla-revoke-emudhra-intermediates-after-private-key-compromise.html
- Mozilla Security Blog (2026-10-20): https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/
- Google: Protecting Chrome and Android users (2026-10-20): https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/
- Mozilla Bugzilla 2083449 (2026-10-22): https://bugzilla.mozilla.org/show_bug.cgi?id=2083449
- Reporter's disclosure page (researcher-run, not eMudhra) (2026-10-20): https://emudhra.we-have-a-problem.com/
- The Register: eMudhra defends its keys (2026-10-22): https://www.theregister.com/security/2026/10/22/certification-authority-emudhra-defends-its-laughably-weak-private-keys/5304647


### PHP / PHP2Shell

Status: confirmed.

**What happened:** Two memory-handling bugs in PHP itself can allow unauthenticated remote code execution. One involves out-of-memory cleanup; the other leaves stale state for a later request in the same worker. PHP released fixes on Oct 21. The PHP project uses the CVE identifiers; php2shell is the researchers' name.

**Exposure:** PHP rates both CVSS v4.0 9.2 (the leaked post claimed 10.0). On Apache mod_php, an unauthenticated request can trigger the first bug before application code runs. Amazon Threat Intelligence (via Tenable) reports exploitation attempts from Oct 17, before disclosure. CISA's Oct 21 alert said it had not itself observed exploitation at publication.

**Fix / advice:** Update to PHP 8.5.12, 8.4.27, 8.3.36 or 8.2.35. CISA says take PHP systems offline if you cannot patch or you run PHP 8.1 or older, and that a WAF may give partial protection.

**Unknowns:** PHP is embedded in many products, so inventory is hard. End-of-life branches have no official fix except source backports (per Tenable). The PHP Foundation admitted a fix for the underlying out-of-memory problem had stalled for months.

Sources:

- Tenable: PHP2Shell (CVE-2026-109618, CVE-2026-109619) - FAQ (2026-10-21): https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote
- JFrog Security Research: PHP2Shell - all you need to know (2026-10-21): https://research.jfrog.com/post/php2shell-all-you-need-to-know-about-cve-2026-109618-and-cve-2026-109619/
- PHP news archive: security advisory (2026-10-21): https://www.php.net/archive/2026.php
- CISA alert (2026-10-21): https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching
- PHP Foundation blog (2026-10-21): https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/
- Check Point blog (2026-10-21): https://blog.checkpoint.com/security/php2shell-what-we-know-about-the-leaked-critical-php-vulnerabilities-cve-2026-109618-cve-2026-109619/


### GitLab / critical Onigmo flaw

Status: confirmed.

**What happened:** On Oct 21, 2026 GitLab shipped a critical patch for CVE-2026-110264, an integer overflow in its regular expression compiler. Under certain conditions it could let an unauthenticated user run code on a self-managed server. GitLab rates it CVSS 10.0; the detailed exploitation conditions are not public.

**Exposure:** Self-managed GitLab CE and EE only. GitLab lists affected versions from 7.0 up to the fixed releases. An Oct 12 fix for a different bug does not resolve this Oct 21 vulnerability. GitLab.com already runs the fixed version. Same release also fixes high-severity LDAP auto-linking and OAuth/OIDC cache poisoning issues.

**Fix / advice:** Upgrade to 19.5.1, 19.4.3, 19.3.6, 19.2.9, 19.1.9, 19.0.10 or 18.11.13.

**Unknowns:** No reported exploitation and not on CISA KEV as of Oct 22 per The Hacker News. Exploitation conditions undisclosed.

Sources:

- GitLab Critical Patch Release · Original source (2026-10-21): https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/
- The Hacker News · Reporting (2026-10-21): https://thehackernews.com/2026/10/critical-gitlab-flaw-cvss-100-could.html
- TrustList: GitLab ships another CVSS 10 regex fix (2026-10-21): https://trustlist.uk/security-advisories/gitlab-19-5-1-fixes-second-cvss-10-regex-flaw-cve-2026-110264-and-ldap-account-takeover
- BleepingComputer on the Oct 12 CVE-2026-97229 (2026-10-12): https://www.bleepingcomputer.com/news/security/gitlab-warns-of-max-severity-rce-flaw-in-regex-compiler-engine/


### Tailscale / eMudhra response

Status: confirmed.

**What happened:** Tailscale published bulletin TS-2026-013 on the eMudhra keys. Its client trusts whatever the operating system's certificate store trusts, so a forged eMudhra-signed certificate would have been accepted on devices that still trusted those intermediates.

**Exposure:** Only web PKI connections that rely on the system store. Tailscale says node-to-node WireGuard traffic does not use that store and is not affected. No exploitation reported in the bulletin.

**Fix / advice:** Tailscale v1.104.2 or later (built with Go 1.27.3) explicitly distrusts the compromised certificates. Tailscale's own services were updated.

**Unknowns:** Devices on older clients with OS stores that still contain the intermediates.

Sources:

- Tailscale Security Bulletins - TS-2026-013 (date not established): https://tailscale.com/security-bulletins
- Tailscale Changelog - v1.104.2 (2026-10-21): https://tailscale.com/changelog


### Node.js / security releases

Status: confirmed.

**What happened:** On Oct 21, 2026 the Node.js project shipped security releases v22.23.4, v24.22.1 and v26.12.1 fixing ten CVEs and updating bundled c-ares, OpenSSL (24.x, 22.x), SQLite (22.x), Undici and the CA certificate list to drop the eMudhra intermediates.

**Exposure:** CVE-2026-111497, a Brotli decoder out-of-bounds write that can permit remote code execution, affects 26.x, 24.x and 22.x. The release also fixes TLS hostname bypasses (CVE-2026-105483, CVE-2026-106069), a dns.resolve NUL truncation (CVE-2026-105482) and others. Node rates the highest of them 'high', not critical.

**Fix / advice:** Upgrade to 22.23.4, 24.22.1 or 26.12.1. End-of-life Node versions stay affected.

**Unknowns:** Node's post does not say whether any of the ten CVEs was exploited. Treat that as unknown.

Sources:

- Node.js blog: Wednesday, October 21, 2026 Security Releases (2026-10-21): https://nodejs.org/en/blog/vulnerability/october-2026-security-releases


### Rajasthan Police data breach (claimed)

Status: unverified.

**What happened:** On Oct 21, coverage attributed to an X monitoring account reported that a group calling itself Scarlettgroup claimed to have breached Rajasthan Police. The group claims about 70,000 identity records and 59,460 mobile numbers, plus documents and attachments. These are the group's claims, not independently verified counts.

**Exposure:** Unknown. Nobody independent has confirmed the data is genuine, or that it came from Rajasthan Police systems. If genuine it would be an identity theft and fraud risk.

**Fix / advice:** None reported.

**Unknowns:** Authenticity, source system and scope are all unconfirmed. Coverage reported no Rajasthan Police comment at publication. No leak forum or sample data was accessed for this index.

Sources:

- BusinessToday (2026-10-21): https://www.businesstoday.in/india/story/rajasthan-police-allegedly-hacked-70000-identity-records-and-59460-mobile-numbers-claimed-to-be-up-for-sale-562889-2026-10-21
- India Today (2026-10-21): https://www.indiatoday.in/technology/news/story/rajasthan-govt-website-data-breach-reported-up-to-70000-identity-records-exposed-3022004-2026-10-21
- InfoSecBulletin (2026-10-21): https://infosecbulletin.com/hacker-claim-to-access-rajasthan-police-data-70000-records-allegedly-exposed/

