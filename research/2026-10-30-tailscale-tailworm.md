# 2026-10-30 - Tailworm: Tailscale/headscale pre-patch disclosure (triage)

Source: user asked to "add tailscale incident" while linking the Cursor post. The real
Tailscale incident this week is the Tailworm disclosure; added alongside the Cursor entry so
both readings of the request are covered.

## Verification chain

- Original report: https://tailworm.com/ (Cyberdione Labs; public over Oct 24-25 weekend;
  disclosure post dated Oct 24). 11 findings vs Tailscale 1.104.2 + headscale 0.29.5, lab-
  reproduced; six high; four in Tailscale SSH (root Unix-socket forwarding: ssh -L privileged
  dials, ssh -R socket replacement, path-check race), plus app connectors (conn25), headscale
  unauthenticated memory exhaustion, DERP client unbounded read, tailscale serve issues.
- Vendor: https://tailscale.com/security-bulletins (TS-2026-014/015/016/017, all "fixed in
  1.104.4 or newer"), https://tailscale.com/ssh-investigation-update (updated Oct 27),
  https://tailscale.com/blog/tailscale-ssh-findings-fixes (Oct 28), changelog v1.104.4 Oct 28.
- Press: BleepingComputer Oct 27, SecurityWeek Oct 27 (uncoordinated disclosure criticism;
  wormable-chaining demonstration vs Tailscale's "not a worm" response).

## Judgment calls

- status confirmed (vendor bulletins + shipped fixes), severity high (foothold required; no
  in-the-wild exploitation reported).
- date 2026-10-24 (public disclosure), disclosureDate same; fix timeline in dateLabel.
- Distinct from tailscale-ts-2026-013-emudhra (TS-2026-013, eMudhra distrust, Oct 21) - no
  overlap beyond vendor.
- Remaining-status gap kept honest: bulletins itemize only the four fixed issues; status of
  the other seven findings (headscale/app-connector/DERP) not enumerated by the vendor.
