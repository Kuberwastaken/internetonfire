# Oct 31, 2026 - eMudhra: Cloudflare exploitation/patching follow-up (existing incident maintenance)

Trigger: read-only watch report of Cloudflare's Oct 30 follow-up post. Scope: update the existing `emudhra-ca-key-compromise` entry only; no new incident, no UI changes (Codex owns design).

## Source (primary, full-read)
- https://blog.cloudflare.com/emudhra-patching/ ("4 real? Tracking exploitation and patching of eMudhra's weak keys", Oct 30, 2026; Guerreiro, Carr, de Moura, Westerbaan). Companion to the Oct 20 post already cited.

## What the entry now carries (verified against the post text)
- Exploitation telemetry: a week of Pingora logging on Cloudflare's outbound connections (rolled out Oct 21) saw about 22,000 attempted handshakes presenting the weak keys. Two-thirds were fetches of test sites such as emudhra.we-have-a-problem.com; almost all the rest were origins that appear to have made a certificate for themselves with the weak intermediate.
- About 160 handshakes carried forged certificates whose SANs named other organizations' domains (some consumer IoT), unrelated to the requested SNI, some valid over two years. Cloudflare assesses these looked like the servers' own default certificates, not interception: same certificate presented from many Cloudflare locations, and the names failed hostname verification anyway.
- One forged certificate dated Oct 20 18:19 UTC - under an hour after Mozilla's bug report went public. Forging began within hours of disclosure.
- Cloudflare: no evidence the weak keys were used to intercept its connections so far; does not exclude carefully targeted interception; no indirect compromise signals seen. This refines, and does not contradict, the entry's earlier "No exploitation has been shown."
- Patching status: all high-priority Cloudflare systems patched; a small number of confirmed low-impact tickets still being worked.
- Visitor telemetry (kept with its caveats, per post): 50 million probes over the week on a fraction of challenge pages; sample skewed by unconfirmed bots and limited to JavaScript-executing clients, so not an internet-wide measure. Within it: modern browsers mostly patched; Android WebView 30-40% still accepting; more than half of probes across large networks still accept the compromised chain; progress flat after the first weekend. The late-week Chrome 150-154/macOS "patching" jump was a bot-traffic classification change (Oct 29 ~18:00 UTC detection); Chrome 150-154 on Linux decline is the suggestive exception.
- Vendor notes via Cloudflare: eMudhra announced it is exiting the public CA business; blamed a mistake in a key generation script it has not shared; first signed a CRL with what may have been a correctly generated key, then corrected it to one signed with the weak key; role of auditors and cross-signers still to be cleared up.

## Claims deliberately NOT made
- No internet-wide exploitation or population claims: the 50M-probe sample is bot-skewed and JS-only, and the post says so.
- No confirmed interception: forged certificates exist, but observed ones looked like server defaults; targeted interception is neither confirmed nor excluded.

## Changes
- data/incidents.json: only `emudhra-ca-key-compromise` touched (1 source added, exposure refined, remaining extended, 1 response added, 1 claimCheck added). No other record, no UI files.
