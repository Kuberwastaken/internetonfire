# Source triage batch 2 - 22 October 2026

Base checked: main `00f8b21815c6676a954ca29b6b8074b13b3b7116`. Content only, no layout or renderer changes. Eleven existing listed records deepened. No new incidents. Prior eight deep accounts preserved.

## Material review notes

- OVHcloud advisory has new attribution detail: traces stolen credentials to a personal editor extension and GlassWorm infrastructure. Earlier research said the initial compromise was unknown; corrected here. Do not run a suspect binary to check it.
- LiteLLM: Docker Hub and GHCR containment times differ; startup persistence means running Python/pip before cleanup can re-execute malware.
- Tensorlake: remove the token-monitor persistence before GitHub-token revocation on an affected host; destructive behavior makes generic rotate-first advice unsafe. Consult the platform-specific vendor steps, not a copied shell command.
- TeamUpdraft: vendor and Nethemba differ over whether the disconnect update closes every old key. Nethemba documents the 1.26.12 bug and a 12:07-21:00 UTC Oct 18 key-deletion gap in 1.26.13. Preserve both attribution and the manual-key check.
- ConnectWise: tenant sign-in and success counts are not data-theft counts; no public read audit trail is not proof no data was read.
- GhostAction: over 30,000 targeted repositories and 3,174 attempted secrets are not confirmed theft totals. Response article initially Oct 7, updated through Oct 13.
- Zeabur: Dec 31 is final shutdown, not a promise all services run until then. Service wind-down starts Dec 1.

## Zeabur infrastructure breach

Status: confirmed.

**What happened:** Over October 14 and 15, 2026, an attacker used Zeabur internal credentials stored in plaintext to walk through two paths that met inside Zeabur's internal network. On one path they used internal AWS keys and shared-cluster admin tokens (no expiry, created January 2024, admin interface open to the public internet) to read service settings, environment variables and the contents of 865 database containers across 9 regions, then about 53 production secrets from the secrets management service. On the other they used an old GCP key to read root passwords stored in plaintext in server initialization settings and signed in as root to 101 GCP Dedicated Servers. From a compromised server they added a node to Zeabur's internal network and read the platform database through an internal read-only account for about 37 minutes on October 15. Zeabur's preliminary report distinguishes confirmed, assessed and unconfirmable facts throughout, and corrects its August statement that all internal admin keys had been rotated: that statement was incomplete, which is exactly why the credentials used this time were still valid. This was Zeabur's second breach in under two months. On October 17 the founder announced Zeabur is shutting down entirely, citing the incidents and deeper maintainability problems, not only the breach.

**Exposure:** Confirmed read from the platform database: 3,218,965 environment variable records (names and values), 321,810 accounts (email, username, phone number), 566 plaintext zSend API keys (revoked) and 11,536 platform Access Tokens stored only as hashes (all revoked). On the shared cluster, environment variables and secrets of all services in 9 regions were read (partly confirmed), and 865 database services had commands run inside them, including n8n at scale and some PostgreSQL databases table by table. 101 GCP Dedicated Servers (92 users) had confirmed root sign-ins. Zeabur says the attacker was mainly hunting directly usable API keys, especially AI service keys, and treats everything read as leaked. Taipei and Hong Kong database backups should be treated as leaked. No use of the Zeabur GitHub App against user repositories was found.

**Fix / advice:** Zeabur revoked the cluster admin tokens, AWS and GCP keys and the internal network node, blocked public SSH to admin interfaces, signed out all users and revoked all platform Access Tokens and zSend keys. Its user guidance: replace every password and key stored on Zeabur even if already rotated after August, recreate access tokens, change database-internal passwords, rotate n8n encryption keys and new-api/one-api upstream keys, audit GitHub for Zeabur App actions in the October 15 window, and check bills back to October 14 (September 1 for GCP servers). GCP Dedicated Server users are told to treat servers as compromised and rebuild. Separately, Zeabur published a wind-down plan: new purchases stopped immediately, shared cluster services pause December 1, everything shuts down by December 31, 2026, with refunds, compensation claims and a migration guide handled through support.

**Unknowns:** Zeabur lists plainly unresolved items: how the initial credentials were obtained (its leading hypothesis, the GitHub App key leaked in August exposing the private configuration repository, is explicitly unproven and GitHub had not replied to its records request), how much data was actually pulled from cluster databases (logs keep commands, not output), the download scope of backups and storage objects, read activity on GCP, whether Hetzner and DigitalOcean tokens were used, and anything before October 14. Unknown root sign-ins to the same GCP servers were recorded September 1 to 5 and cannot be attributed.

Sources:

- Zeabur status · Original source (2026-10-15): https://status.zeabur.com/incident/1091243
- Zeabur: October 2026 security incident (preliminary report) (2026-10-19): https://zeabur.com/blogs/october-2026-security-incident
- Zeabur is shutting down: what happens next (2026-10-17): https://zeabur.com/blogs/zeabur-is-shutting-down
- BleepingComputer · Reporting (2026-10-20): https://www.bleepingcomputer.com/news/security/zeabur-shutting-down-after-second-security-breach-in-two-months/
- Cyber Insider · Reporting (2026-10-21): https://cyberinsider.co.uk/zeabur-details-credential-failures-and-database-access-in-october-breach/
- X · zeaburapp (2026-10-20): https://x.com/zeaburapp/status/2112383555326423418


## OVHcloud CLI releases backdoored

Status: confirmed.

**What happened:** On Oct 19, attackers used a compromised OVHcloud developer GitHub account to replace release binaries for CLI versions 0.11.0 through 0.15.0 with credential-stealing malware. Source code and the internal production build platform were not affected. OVHcloud removed the malicious assets and enabled immutable GitHub releases.

**Exposure:** Only users who downloaded or installed CLI versions 0.11.0 to 0.15.0 during the 94-minute window on October 19 (14:47 to 16:21 UTC+2) are affected; OVHcloud counts roughly 250 downloads. Earlier downloads of the same versions are unaffected, as are v0.10.0 and below and v0.16.0. The malicious binaries were the real CLI recompiled with embedded malicious Go code, designed to steal secrets and files. Users can check for a temp folder named envchecker-xxxx and verify their binary against the MD5 hashes of compromised builds in the advisory appendix.

**Fix / advice:** Do not run a suspected binary to check it. Compare its hash with the vendor advisory, delete affected binaries, and use the clean signed 0.16.0 release or a later trusted release. If an affected binary ran, OVHcloud says to treat reachable secrets as compromised and follow its credential-rotation and host-review guidance.

**Unknowns:** OVHcloud now traces the stolen developer credentials to a malicious editor extension installed on a personal MacBook in 2025, with infrastructure linked to GlassWorm. It says the corporate laptop and internal production platform were not compromised. The number of downloads is about 250, not a confirmed count of infected users.

Sources:

- GitHub Advisory GHSA-862f-55f5-vmvw (OVHcloud) (2026-10-19): https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw
- BleepingComputer · Reporting (2026-10-20): https://www.bleepingcomputer.com/news/security/ovhcloud-cli-releases-backdoored-on-github-to-steal-developer-secrets/
- The Hacker News: Hackers Hijack Five OVHcloud CLI Releases (2026-10-20): https://thehackernews.com/2026/10/hackers-hijack-five-ovhcloud-cli.html
- Dark Reading · Reporting (2026-10-21): https://www.darkreading.com/cyberattacks-data-breaches/ovhcloud-github-compromise-glassworm-threat-actors
- X · olesovhcom (2026-10-19): https://x.com/olesovhcom/status/2112225308589834260


## Rank Math PRO 3.0.123 malware

Status: confirmed.

**What happened:** Rank Math identified that the official download of Rank Math PRO version 3.0.123 contained malware for an 11-hour window, from October 15, 2026 20:02 UTC to October 16, 2026 07:12 UTC. Anyone who installed and activated that build in the window should treat their WordPress site as compromised. The free Rank Math SEO plugin on WordPress.org was not affected. Rank Math removed the affected files and released clean version 3.0.124. Reporting by BleepingComputer, SecurityWeek and The Hacker News frames this as a supply chain compromise of the vendor's download infrastructure; Rank Math's own page focuses on the recovery steps and does not detail how the files were poisoned.

**Exposure:** Limited to Rank Math PRO users who downloaded or updated to 3.0.123 during the affected window. Sites that installed but never activated the plugin are told to delete the files and scan as a precaution; downloads without install show no indication of compromise. The malware can recreate its hidden backdoor whenever someone visits the site, and it plants malicious entries in the wp_options table (option names _uf6qdn2hmm, t8krdk990phb, _np5pvf754c) and talks to the domain rank1cdn.com. Separately, some free users' Rank Math account details were deleted as a side effect of the vendor's system refresh, with emailed re-creation instructions.

**Fix / advice:** Rank Math removed the malicious files, shipped clean PRO 3.0.124, and published a recovery guide: restore the site and database from a backup predating October 15 20:02 UTC (its recommended option), or clean manually in a strict order - delete the rank-math-pro folder entirely (deactivation is not enough), remove the malicious wp_options entries, and block outgoing connections to rank1cdn.com before removing other suspicious files, because the malware can rebuild itself. Afterward, change all site passwords, database credentials and API keys, and install 3.0.124 from the Rank Math account.

**Unknowns:** Rank Math has not publicly explained the intrusion vector that put malware into the official download, and has not published a count of affected sites. The full capability set of the backdoor beyond self-reinstallation is described only in third-party reporting.

Sources:

- Rank Math: PRO 3.0.123 Security Incident (2026-10-16): https://rankmath.com/kb/pro-3-0-123-security-incident/
- BleepingComputer · Reporting (2026-10-19): https://www.bleepingcomputer.com/news/security/wordpress-seo-plugin-rank-math-compromised-to-backdoor-websites/
- SecurityWeek: Rank Math PRO Compromised in Supply Chain Attack (2026-10-19): https://www.securityweek.com/rank-math-pro-wordpress-plugin-compromised-in-supply-chain-attack/
- The Hacker News: Rank Math PRO Hijacked (2026-10-19): https://thehackernews.com/2026/10/popular-wordpress-seo-plugin-rank-math.html
- X · TheHackersNews (2026-10-19): https://x.com/TheHackersNews/status/2112219875083186264


## TeamUpdraft customer database compromised

Status: confirmed.

**What happened:** Over the weekend of October 17-18, 2026, an attacker used a compromised key to gain unauthorized access to teamupdraft.com, the vendor of the UpdraftPlus WordPress backup plugin. TeamUpdraft believes its customer database was accessed and says the attacker abused UpdraftCentral - the remote management service built into every copy of UpdraftPlus - to send validly signed commands to connected sites, creating admin accounts and installing malicious plugins. Security firm Nethemba, whose own sites were hit on October 19, documented that the attacker held UpdraftCentral's private dashboard keys, which are generated and kept by the service, and could therefore install arbitrary code on any connected site. Nethemba's first installed backdoor was broken and crashed the site, which is how the intrusion surfaced within hours; working variants circulated afterward. TeamUpdraft says the speed of the exploitation and the initially faulty backdoor code suggest the attackers used AI to accelerate the operation. The plugin downloads themselves were not affected.

**Exposure:** TeamUpdraft believes its database was accessed, including customer contact/billing information, order history, password hashes, two-factor settings and service connection keys. Keys could let attackers command sites connected to UpdraftCentral Cloud. Nethemba observed malicious plugins on connected sites; install counts and estimates of possibly connected sites are not counts of breached sites. Sites without a connection key do not accept this attack path, and the vendor says self-hosted dashboards are unaffected.

**Fix / advice:** TeamUpdraft closed the access route, signed out every account, replaced affected credentials, disconnected every site from UpdraftVault and replaced all UpdraftClone client keys. It shipped emergency UpdraftPlus releases to delete old UpdraftCentral cloud keys: 1.26.12 and 2.26.12 on October 19 contained a bug that deleted nothing, fixed the same evening in 1.26.13 and 2.26.13, which WordPress.org pushed to all sites automatically. Nethemba found even 1.26.13 only deletes keys created before 12:07 UTC on October 18, so keys created between 12:07 and 21:00 UTC that day must be deleted by hand. Site owners are told to check Users and Plugins (including Must-Use) for anything unrecognized, change admin passwords, and treat sites as potentially compromised until checked. TeamUpdraft reported the incident to the ICO and police and brought in an external security firm. Wordfence released a firewall rule blocking UpdraftCentral commands.

**Unknowns:** The full extent of site compromise through the leaked keys is unknown. As of October 21 the attacker was still sending UpdraftCentral commands to Nethemba's sites (blocked there), meaning stolen keys keep working on any site that has not updated and deleted them. How the initial teamupdraft.com key was compromised has not been explained. TeamUpdraft's updates also note it temporarily took its support form offline because of the separate industry-wide PHP vulnerabilities.

Sources:

- TeamUpdraft: security incident - what customers need to know (2026-10-19): https://teamupdraft.com/blog/security-incident-october-2026/
- Nethemba: UpdraftCentral backdoor analysis (2026-10-19): https://nethemba.com/updraftcentral-backdoor-analysis/
- The Hacker News · Reporting (2026-10-21): https://thehackernews.com/2026/10/attackers-abuse-updraftcentral-keys-to.html
- CSO Online · Reporting (2026-10-21): https://www.csoonline.com/article/4238422/wordpress-sites-compromised-after-teamupdraft-credential-exposure.html
- X · TheHackersNews (2026-10-21): https://x.com/TheHackersNews/status/2112831962281099387


## ConnectWise Cloud Backup identities compromised

Status: confirmed.

**What happened:** Attackers used compromised ConnectWise Cloud Backup application credentials to request Microsoft Graph tokens in customer Microsoft 365 tenants on Oct 15. Huntress observed automated sign-ins and, in two reviewed tenants, privilege escalation plus added client secrets that could maintain access. ConnectWise later attributed the attack to a China state-aligned group using an agentic AI framework, citing Microsoft intelligence. That attribution is not independent proof of every claim about the wider campaign.

**Exposure:** Any tenant that ever consented to the ConnectWise Cloud Backup or related Cloud Management applications was reachable, since the stolen credential works everywhere the apps are consented. Huntress identified almost 1,000 Entra tenants with sign-in activity from the attacker IP, with over 300 successful; it confirmed unauthorized sign-ins in 162 tenants as of October 16. Backup app permissions are broad (mailboxes, OneDrive, SharePoint, Teams, directory data), but Huntress found no evidence of mailbox or file manipulation in the two tenants with post-compromise activity, while warning that Microsoft Graph directory reads leave no audit record, so reads cannot be ruled out. A successful sign-in is not proof of data theft. ConnectWise says existing backup archives remain encrypted, isolated and preserved, with no indication of compromise, and no other ConnectWise products are impacted.

**Fix / advice:** ConnectWise shut off the Cloud Backup application connections, completed an account and credential reset in the affected environment, and began phased service restoration on October 21, with each step security-validated and expected to take several days; from October 22 it posts updates twice daily. Partners are told to keep affected connections disabled until formal reconnection instructions arrive, and to review every Microsoft 365 tenant (their own and managed customers') using ConnectWise's technical guide: Huntress and Sophos advise disabling (not deleting) the abused application IDs, auditing Entra sign-in and audit logs from October 13 onward, and reviewing credentials on all applications because disabling apps does not remove secrets the attacker already planted. Huntress enabled App Instance Property Lock across its own applications after one was backdoored.

**Unknowns:** How the vendor credential was obtained remains unclear. Graph directory reads may leave no audit trail, so the full use of issued tokens cannot be established. Each partner still needs to review its own tenants. Service restoration was phased; the current vendor advisory is the source for reconnection status.

Sources:

- ConnectWise Trust Center advisories (2026-10-16): https://www.connectwise.com/company/trust/advisories
- Huntress · Reporting (2026-10-16): https://www.huntress.com/blog/vendor-credential-enables-unauthorized-access
- Field Effect · Reporting (2026-10-19): https://fieldeffect.com/blog/connectwise-cloud-backup-identities
- Sophos · Reporting (2026-10-19): https://www.sophos.com/en-us/blog/connectwise-cloud-backup-application-abused-in-token-sweep
- The Hacker News: ConnectWise Suspends Cloud Backup (2026-10-18): https://thehackernews.com/2026/10/connectwise-suspends-cloud-backup-after.html
- X · MsftSecIntel (2026-10-17): https://x.com/MsftSecIntel/status/2111358888125878426


## SubQuery npm package backdoored

Status: confirmed.

**What happened:** On October 5, 2026, StepSecurity's automated package analyst flagged @subql/common 5.8.3 on npm, and investigation confirmed a hidden credential-theft and backdoor payload. The release was published through the project's own npm trusted publisher (GitHub Actions OIDC) from a short-lived branch called chore/ci-audit-55: a canary publish (5.8.3-onf-rt1, no payload) at 11:24 UTC, then the payload-bearing 5.8.3 at 11:56 UTC, with the branch deleted around both operations. Because it flowed through the real pipeline, the release carries npm provenance, which records the build origin, not safety. StepSecurity opened GitHub issue 3047 in the SubQuery repository the same day. A maintainer (ianhe8x) responded on October 10 that the compromised token had been deleted and a review started.

**Exposure:** Version 5.8.3 adds a postinstall hook and an export so that even a plain import of @subql/common runs the payload; disabling install scripts alone is not enough. The 83 KB decoded bundle collects environment variables, gh auth token output, SSH keys, .npmrc files, cloud credentials (AWS, GCP, Azure), Kubernetes and Vault secrets, crypto wallets and AI-agent configs, sends them encrypted (RSA-OAEP plus AES-256-GCM) to ci-artifacts.dev, uses stolen GitHub tokens to push a secret-dumping workflow whose commit author is spoofed as github-advanced-security[bot], and installs a reverse-shell implant beaconing to the same host. StepSecurity's dependency review found 19 latest @subql package versions whose dependency ranges can resolve to 5.8.3, so pinning a parent package does not by itself protect downstream installs.

**Fix / advice:** Treat 5.8.3 as unsafe: prevent installation and import, block ci-artifacts.dev, move back to 5.8.2, and investigate any machine or CI runner where 5.8.3 ran as compromised - rotate GitHub, npm, cloud, Kubernetes and Vault credentials and check repos for the spoofed dependabot branch and workflow. StepSecurity's suggested maintainer actions were to deprecate or unpublish 5.8.3, reset latest to 5.8.2, rotate the trusted-publisher configuration and all CI secrets, and publish an advisory; per the GitHub issue, the maintainers deleted the compromised token on October 10 and began their review. The release is catalogued as OSV MAL-2026-17571.

**Unknowns:** How the release pipeline or a commit feeding it was compromised is not established publicly. Whether the canary publish 5.8.3-onf-rt1 (dist-tag redteam, 32 minutes earlier, no payload) was an authorized test is unconfirmed. The number of affected downstream installs and whether SubQuery has completed its review are not public.

Sources:

- GitHub subquery/subql issue #3047 (malicious release report) (2026-10-05): https://github.com/subquery/subql/issues/3047
- StepSecurity: SubQuery Ecosystem Compromise (2026-10-05): https://www.stepsecurity.io/blog/subql-ecosystem-compromised
- GMO Flatt Security: Supply Chain Attack on @subql/common (2026-10-06): https://flatt.tech/research/posts/subql-common-npm-supply-chain-attack/
- OSV MAL-2026-17571 (2026-10-05): https://osv.dev/vulnerability/MAL-2026-17571


## Tensorlake npm credential-stealing worm

Status: confirmed.

**What happened:** On October 7-8, 2026, someone pushed malicious commits directly to the main branch of the tensorlakeai/tensorlake repository under a maintainer's identity - no pull request - and the project's own release workflow published tensorlake 0.5.144 to npm on October 8 at 01:12 UTC. Because it shipped through the real pipeline, the package carries a valid npm provenance attestation; provenance records where a package was built, not whether the code is safe. The preinstall hook ran a credential-stealing worm in the style of Shai-Hulud that also tried to spread to other packages and repositories, and it installed a trap: a gh-token-monitor service that deletes the user's home directory if the stolen GitHub token is revoked. StepSecurity's automated package analyst flagged the release and reported it in GitHub issue 1014. The Register covered it as the Shai-Hulud worm's jump into AI infrastructure.

**Exposure:** Only npm tensorlake 0.5.144 (plus the matching tensorlake-native platform packages); it was live for about 1 hour 40 minutes (01:12 to 02:54 UTC on October 8). PyPI, crates.io and the CLI were not affected, and Tensorlake says it saw no usage of this version via user-agent monitoring. The hook skips CI, targeting developer machines: it harvested GitHub and npm tokens, cloud keys, Kubernetes and Vault secrets, SSH and GPG keys, .env files, browser-saved passwords, crypto wallets and AI tool configs (Claude, Cursor, Windsurf), exfiltrating to a public repo created in the victim's account with the description Shai-Hulud: Here We Go Again, or to iseekaigogo.com. It spread by republishing victims' npm packages and by committing .claude/settings.json and .vscode/tasks.json files into writable repos so it reruns when the project opens in Claude Code or VS Code.

**Fix / advice:** The advisory marks 0.5.143 as the clean fallback for the affected npm release. If 0.5.144 ran, follow the vendor's platform-specific incident guide: remove the gh-token-monitor persistence BEFORE revoking a GitHub token, because failed token checks can trigger deletion of the home directory. Then rotate reachable secrets, check repositories and rebuild the machine if cleanliness cannot be established. This is not a general instruction to delay revocation on unaffected machines.

**Unknowns:** How the maintainer account was compromised is not established in the advisory. Because the worm republishes with stolen npm tokens, dependent packages could surface later; StepSecurity blocks known-bad versions at its registry proxy but the full downstream blast radius is not enumerable. No confirmed count of infected machines exists.

Sources:

- GitHub Advisory GHSA-8g63-53c9-65j2 (Tensorlake) (2026-10-08): https://github.com/tensorlakeai/tensorlake/security/advisories/GHSA-8g63-53c9-65j2
- StepSecurity · Reporting (2026-10-08): https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm
- The Register · Reporting (2026-10-08): https://www.theregister.com/security/2026/10/08/shai-hulud-worm-makes-jump-to-ai-infrastructure-with-tensorlake-compromise/5302054
- The Hacker News: Tensorlake npm Package Compromised (2026-10-08): https://thehackernews.com/2026/10/tensorlake-npm-package-compromised-to.html


## GhostAction GitHub workflow campaign

Status: confirmed.

**What happened:** GhostAction is a supply chain campaign that injects malicious GitHub Actions workflows into repositories using the victims' own compromised credentials, then harvests the secrets those workflows can reach. GitGuardian first revealed it in September 2025 (817 public repositories across 327 users, at least 3,325 secrets exfiltrated) and now says the campaign never stopped: it tracked activity through late 2025 and into 2026 with shifting exfiltration endpoints. A new wave ran from August 31 to September 30, 2026, pushing the workflow to 772 public repositories belonging to 373 users and organizations and targeting 2,577 secrets; GitHub held most runs for approval, so only 499 of 3,669 collected runs executed, exfiltrating 26 confirmed secrets from 13 repositories. Then between October 8 and 12 the campaign accelerated: more than 30,000 repositories across about 3,000 users and orgs were targeted through roughly 1,900 compromised GitHub accounts, attempting to extract 3,174 secrets. This time the workflows actually ran, and Socket confirmed successful exfiltration on October 8, before GitHub began blocking the malicious workflow from running on October 9, so the October 10 and 12 waves extracted nothing.

**Exposure:** Targeted secrets in the 2026 waves include SSH private keys and deployment credentials (446), Azure credentials (218, with one organization exposing an Azure PAT and SSH key across 92 repositories), container registry credentials (142), database credentials (112), AWS access keys (106), FTP credentials (92), Google Cloud and Firebase credentials (80), GitHub tokens (66), and bot tokens plus Cloudflare, npm, PyPI and AI provider keys. The October payload versions also grep the working tree and full git history, with special context capture around AWS key IDs, pointing at intent to hit private repositories too. Confirmed theft counts are much lower than target counts: 26 secrets confirmed exfiltrated in the August-September wave; the October wave's confirmed exfiltration is established by Socket's analysis but without a public total. Victims from earlier waves were hit again, suggesting reliance on unrotated secrets stolen months or years ago.

**Fix / advice:** GitHub began preventing the malicious workflow from running starting October 9, which neutralized the later October waves. Cleanup is visible but incomplete: only 124 of 772 repositories in the August-September wave (16%) had removed the workflow in public history by October 5, and in 92 cases the attacker simply re-pointed old, never-removed workflows at the new endpoint. Affected users need to remove the injected workflow (names include github_actions_security.yml and security-audit.yml), rotate every secret referenced in their CI, and check for runs of the injected workflows. GitGuardian and StepSecurity published the exfiltration indicators, including the IP 193.32.204.199 and earlier endpoints.

**Unknowns:** Attribution is unknown. The full count of secrets stolen in the October wave has no public total. How the roughly 1,900 GitHub accounts were originally compromised is not established, though reuse of previously stolen credentials is the documented pattern. GitGuardian also found a cryptominer injected into kuafuai/DevOpsGPT by the same compromised account days before the new wave, but its analysis concludes the miner is probably a different actor exploiting the same stolen account - an illustration that stolen credentials do not have a single owner.

Sources:

- GitGuardian: GhostAction Returns (772 repos, 30k more in Oct) (2026-10-07): https://blog.gitguardian.com/ghostaction-github-actions-supply-chain-attack-returns/
- GitGuardian · Original source (2025-09-05): https://blog.gitguardian.com/ghostaction-campaign-3-325-secrets-stolen/
- StepSecurity · Reporting (2026-10-09): https://www.stepsecurity.io/blog/ghostaction-returns
- BleepingComputer · Reporting (2025-09-08): https://www.bleepingcomputer.com/news/security/hackers-steal-3-325-secrets-in-ghostaction-github-supply-chain-attack/


## Railway / possible secret exposure

Status: confirmed.

**What happened:** On the morning of October 21, 2026, Railway detected anomalous activity in the systems that store customer environment variables. It disclosed that an unauthorized third party may have accessed those encrypted variables and, for some customers, obtained the decrypted contents. Railway says it believes the attack is part of a series targeting platform companies with the aim of compromising AI inference providers, and it asked those providers to revoke keys proactively. A Railway employee wrote on Hacker News that preliminary forensics point to AI credentials as the attacker's primary goal and called the attacker highly motivated, while cautioning that a formal postmortem is still pending and that the company balanced its duty to warn against the risk of messaging before exploit paths were closed. Railway has not said how the attacker got in.

**Exposure:** Secrets customers stored as environment variables: API keys, database passwords and private registry credentials. Railway says its initial analysis suggests the impact may be limited to a subset of users, but it has not given a count of affected accounts. Separately, individuals reported on X and Hacker News that AI keys stored on Railway were drained in real time, and the founder of Postiz said he took that service offline after Anthropic and Stripe warned that its keys were compromised. Those are individual reports, not Railway findings. Railway has not said that consumers' personal data was taken.

**Fix / advice:** Railway paused all deployments while it investigates, told every customer to immediately roll all environment variables, API keys and private registry credentials, and to review service logs for unusual activity. It reset the credentials it holds on customers' behalf: S3 access keys for every storage bucket and the GitHub tokens Railway held, which forced redeploys for bucket-using services and a manual GitHub reconnect. It published step-by-step follow-up guides covering the bucket and GitHub resets, database credential rotation, and how to check OpenAI, Anthropic, Grok, OpenRouter and Stripe accounts for misuse. It says it will email confirmed-affected customers directly.

**Unknowns:** The entry point and affected-account count are undisclosed, and a formal postmortem was not yet in the checked disclosure. Railway had paused deployments during investigation; its live status page, rather than this snapshot, determines restoration status. Downstream access to customers' application databases has not been established.

Sources:

- Railway: Security Disclosure - Wednesday October 21st (2026-10-21): https://blog.railway.com/p/security-disclosure-wednesday-october-21st
- Railway Status: Platform Outage incident QH8L8B3E (2026-10-22): https://status.railway.com/incident/QH8L8B3E
- Railway · Original source (2026-10-22): https://blog.railway.com/p/security-disclosure-recommendation-redeploy-buckets-and-reconnect-github-after-the-credential-reset
- X · @Railway (2026-10-22): https://x.com/Railway/status/2113025284148715845
- Hacker News discussion with Railway employee comments (2026-10-21): https://news.ycombinator.com/item?id=50188228
- Cybersecurity News reporting (2026-10-22): https://cybersecuritynews.com/railway-security-incident/


## LiteLLM / backdoored releases

Status: confirmed.

**What happened:** In the early morning of October 21, 2026, LiteLLM's release pipeline was compromised and pushed a malicious version 1.107.0 to PyPI and to Docker Hub and GHCR. The package contained compiled malware: a credential stealer that runs every time Python starts, plus a remote-code loader backdoor. According to LiteLLM's own incident write-up, the attacker held GitHub CLI OAuth tokens from three engineers, used an organization owner's token to disable branch protections, pointed the release workflow at a lookalike repository (Berri-AI/litellm instead of BerriAI/litellm), and let the normal signing pipeline publish the poisoned artifacts. LiteLLM believes the tokens were harvested from logs of an internal LiteLLM deployment that was exposed to the public internet, possibly through a recently patched vulnerability; it notes that Claude Code can embed a user's GitHub CLI OAuth token into response bodies, and those bodies may land in LiteLLM logs. This is LiteLLM's second supply chain compromise of 2026; Datadog linked the earlier March incident (versions 1.82.7 and 1.82.8) to TeamPCP and says no connection between the two has been established.

**Exposure:** Anyone who ran pip install on litellm 1.107.0 between 11:39 and 13:23 UTC on October 21, or started the v1.107.0, latest, main-latest or main-stable Docker Hub images between 11:46 and 14:20 UTC (affected GHCR tags were unavailable by 13:51 UTC). The stealer collected cloud credentials (AWS, GCP, Azure, including instance metadata), Kubernetes, Docker, Vault and Terraform secrets, SSH, GPG and TLS keys, Git, npm and PyPI tokens, .env files, shell history, LLM provider API keys, AI coding tool sessions, browser saved passwords and cookies, and credentials stored in a LiteLLM proxy database. Data went encrypted to the lookalike domain www.litellm[.]dev/healthcheck. The backdoor polled a fixed GitHub-hosted file hourly for a new domain; Datadog says that file only ever held test values, so no second-stage payload was observed in the wild. Enterprise customers on LiteLLM's private registry were not affected, and the official 1.107.0 source tag on GitHub is clean.

**Fix / advice:** Affected artifacts were removed or repointed on Oct 21. LiteLLM recommends an explicit clean pin such as 1.106.2. On an affected host, follow the vendor's ordered cleanup before running Python or pip: startup hooks can re-execute the malware. Remove persistence, rebuild from trusted images, then rotate every credential the host or proxy database could reach. Do not treat uninstalling the package as complete cleanup.

**Unknowns:** LiteLLM has not confirmed how the attacker first accessed its internal deployment. The investigation is ongoing and the company committed to rolling updates. The number of users who installed the malicious artifacts has not been published.

Sources:

- LiteLLM · Original source (2026-10-21): https://docs.litellm.ai/blog/security-incident-oct-21-2026
- Datadog Security Labs · Reporting (2026-10-21): https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-docker/


## OpenCode / exposed provider keys

Status: confirmed.

**What happened:** Overnight around October 17-18, 2026, attackers broke into an older OpenCode system and reached stored API keys that some users of the hosted OpenCode Console had linked to external AI providers. OpenCode announced on October 18 that it had suffered a security breach related to a large-scale distillation attack affecting 1.4% of Console users, and said it emailed everyone affected that morning; users without an email were not impacted. Co-founder Dax Raad said attackers had been hitting the company's systems nonstop for at least 48 hours using AI agents, and that the investigation was hampered when the AI models OpenCode was using began refusing to analyze malicious code because of safety filters. The team said things stabilized after OpenAI gave it access to Daybreak, a program offering models vetted for defensive security work. The open source app and CLI were not affected; only the hosted Console stored such keys. The breach happened the same night OpenCode made GLM-5.3-Flash free for users.

**Exposure:** Stored keys for linked providers including OpenAI, Anthropic and Google, for the 1.4% subset of Console users who had external providers linked. The notice to impacted users says the earliest possible key exposure was October 17, 2026, 00:30 UTC, and that no other data appears to have been exposed. Users then reported unauthorized charges on Reddit and X, commonly hundreds of dollars and in some cases over 1,000 or 1,700 dollars overnight; some said Google suspended their projects for abusive activity consistent with hijacked resources. Charge figures are user reports, not an audited total.

**Fix / advice:** OpenCode notified affected users by email on the morning of October 18 and told them to revoke and replace their keys directly with each provider. It said it was working with Google, OpenAI and Anthropic. Anthropic and Google blocked the API keys they believed were exposed. OpenAI said it worked with OpenCode to restore access and refund credits used in the attack, and OpenCode said refunds for unauthorized charges were underway, with its email to impacted users mentioning possible reimbursement.

**Unknowns:** OpenCode has not explained how attackers gained access to the older system, how the keys were stored, or the full extent of misuse, and said the incident remains ongoing. The distillation framing is OpenCode's own characterization; skeptics quoted by TechCrunch argue the use of stolen keys for distillation is unproven and that this may be a straightforward breach. No audited total of financial losses exists.

Sources:

- BleepingComputer · Reporting (2026-10-19): https://www.bleepingcomputer.com/news/security/opencode-hack-exposes-api-keys-amid-ai-distillation-attacks/
- TechCrunch · Reporting (2026-10-19): https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/
- X · @opencode · statement (2026-10-17): https://x.com/opencode/status/2111519637049319818
- X · @thdxr (2026-10-18): https://x.com/thdxr/status/2111790511409258796
- X · @saranormous (2026-10-17): https://x.com/saranormous/status/2111572880450601016

