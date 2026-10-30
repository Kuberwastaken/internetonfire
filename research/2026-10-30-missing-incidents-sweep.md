# 2026-10-30 - Missing-incidents sweep (batch 2 triage)

Context: user asked for "anything else not there" (23:42 IST) and then "find others too if
there's major ones we don't know" (23:52 IST). Sweep covered Oct 22-30 disclosures across
vendor notices, SecurityWeek/BleepingComputer/Ars/Reuters/TechCrunch and weekly roundups.

## VS Code chronology check (user: "I think vsc covered it before")

No earlier VS Code incident for this event. Registry checks (Rescana, Oct 30): Open VSX, npm
and the Microsoft VS Code Marketplace never listed a 2.1.313; the malicious build existed only
in Cursor's marketplace. What the user likely remembers: the FIRST public analyses on Oct 30
(OpenSourceMalware initially, Phorion still) misattributed the build to Open VSX; Cursor then
contacted OpenSourceMalware, which corrected to the Cursor marketplace. So "VSC/Open VSX
covered it" was the early wrong attribution, not an earlier event. The old GitHub issue
anthropics/claude-code#5762 (Open VSX auto-uninstall) is from Aug 2025, unrelated packaging.
No change needed to cursor-claude-code-2-1-313 (its correction field already covers this).

## Added this batch (9 entries + 1 update)

- sonet-plala-breach (confirmed/high) - primary: so-net.ne.jp/info/2026/20261027_0001.html,
  docomo.ne.jp/info/notice/page/261027_05_m.html; reports: SecurityWeek, Nikkei.
- dhs-personnel-records-leak (reported/high) - TechCrunch original + BBC/WIRED/Verge; DHS
  acknowledges "potential breach"; Okta denies compromise (vector unresolved).
- amadeus-pss-airline-breach (confirmed/high) - primary: JAL, ANA, Star Flyer notices;
  Korean Air/Asiana via Seoul Economic Daily Oct 23; Amadeus Oct 1 statement superseded.
- warp-vendor-breach (confirmed/high) - primary: CEO Zach Lloyd statement (LinkedIn);
  BleepingComputer; ~1% of users, agent traces/telemetry, CrowdStrike engaged.
- anthropic-cathedral-intrusion (disputed/high) - Washington Post original (draft Cathedral
  report); Anthropic confirms limited intrusion via bug bounty, disputes scope.
- uefi-edk2-cve-2026-97631 (confirmed/high) - Ars Technica, oss-security, tianocore/edk2
  PR #13302; embargo broken by AMI; PXE-boot + local-network qualifiers kept explicit.
- cloudflare-sglang-kv-cache-leak (confirmed/medium) - Cloudflare blog + Knostic; 155
  responses Aug 27-Sep 9; SGLang fixed in 0.5.22.
- copenhagen-university-breach (confirmed/high) - primary: news.ku.dk + ku.dk notification
  page; BleepingComputer; ~525k people, CPR numbers, 20k card PINs reissued.
- fec-efiling-outage (reported/medium) - Reuters exclusive + NBC/Politico/WaPo; attempted
  breach, system restored Oct 28; no data theft confirmed.
- onamae-desktop-cloud-malware UPDATE - data theft confirmed Oct 24 (GMO 4th report),
  ransom refused (figures conflict: GMO reports $50M, Japan Times ~$1M), first leak Oct 27,
  platform kept offline, $1M bounty Oct 28. Sources: internet.gmo/en/news/article/258/,
  Japan Times, webhosting.today.

## Considered, below the bar (not added)

- ENGIE partner-tool breach (customer count undisclosed, France-only, thin).
- Iran-linked military commissary freezer sabotage (suspicion only, Nextgov-sourced).
- Cequence fake-AI-bot secret scanning, Sophos Gold Ogre/Aur0ra, Cisco NIK C2, grey-market
  Codex/Claude relay, AGENTS.md hijack research - vendor research/threat reporting, no
  confirmed incident.
- North Korea IT-worker guilty plea + OFAC sanctions - enforcement news; existing
  north-korea-campaign entry covers the campaign.
