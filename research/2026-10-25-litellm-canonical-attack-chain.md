# LiteLLM canonical attack-chain report - research note, 2026-10-25

Source read fresh 2026-10-25 ~00:35 IST (Oct 24 19:05 UTC): https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain (published Oct 23, authors: Director of Security + AI engineer, LiteLLM). "The investigation was ongoing, and some assumptions and beliefs in those updates were later proven to be inaccurate or incomplete. This post is the canonical source of truth."

## Key corrections vs the Oct 21 initial post (carried in the entry until now)
- STALE: tokens harvested from logs of an internal LiteLLM deployment exposed to the public internet (possibly via a patched vulnerability / Claude Code embedding CLI tokens in response bodies).
- CANONICAL: on May 27, 2026 a config file (opencode.json) with the master key of a LiteLLM Agent Platform deployment was committed to the PUBLIC LiteLLM-Labs/lite-harness repo; spotted and force-pushed over, but the master key was never revoked. On Oct 10 (21:13-21:28 UTC, from 69.48.229.143) the attacker called the Agent Platform API with it; GET /api/v1/managed_agents/agents?limit=100 returned the org owner's GitHub CLI OAuth token (unscoped, post-2FA).

## Confirmed chain (canonical)
1. Oct 10 22:11/22:12 UTC: throwaway branches ci-tmp-a351cc (BerriAI/litellm) and ci-tmp-be33e9 (BerriAI/litellm-auto) ran workflows posting GH_TOKEN (2nd maintainer) and RELEASE_PLEASE_TOKEN (3rd maintainer) to webhook.site; runs deleted minutes later.
2. Oct 12: second exfiltration round across private repos (minimally sensitive secrets, minimally funded provider keys) - not in the poisoned-artifact path; rotated.
3. Oct 21: project-releaser commit 9cf97e9 repointed the release source to lookalike fork Berri-AI/litellm commit 20535d8f; maintainer-token push rejected by branch protection, owner token overrode. Staging dispatched 10:46:39, production gate approved 11:11:18 (2nd maintainer token, 199.91.221.39). Release approval had been relaxed that week from a physical-device-locked account to any two engineers.
4. Publication: 7 PyPI wheels 11:39:51-11:40:13; Docker Hub + GHCR 11:46:56. Cover-up: run records deleted (3rd maintainer token), revert 285fbdc5 then force-push main back to d687b69 (owner token).
5. Detection: LidorMachluf issue #47826 at 12:06:41 (~20 min after publication); PyPI frozen 13:23, GHCR tags out 13:51, Docker Hub cleaned 14:20.

## Other canonical facts
- Attacker's primary focus: upstream inference API tokens.
- LiteLLM is revoking every token across all internal systems and vendor platforms.
- Process-improvements post promised for the week of Oct 26.
- Indicators published (IPs, branches, commits) - recorded in the response summary.

## Entry changes (narrow maintenance, existing entry only)
- whatHappened: log-harvest theory replaced with the canonical master-key/Agent-Platform chain, explicitly marked as a correction; release mechanics kept and enriched with canonical detail; March/TeamPCP sentence preserved (Datadog attribution).
- remaining: "investigation ongoing / entry point unconfirmed" replaced - investigation complete; install count still unpublished; revocation sweep + process post noted.
- responses: +1 (Oct 23 canonical report). sources: canonical report added as primary (Oct 23). dateLabel unchanged (exposure window fact).
