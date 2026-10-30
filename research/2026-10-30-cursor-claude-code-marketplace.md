# 2026-10-30 - Cursor marketplace trojanized Claude Code 2.1.313 (triage)

Source: user-submitted X link (cursor_ai announcement), requested as "add tailscale incident".
Identity resolved: the link is Cursor's official announcement of the trojanized Claude Code
extension incident, not a Tailscale incident. Tailworm (Tailscale) handled separately in
research/2026-10-30-tailscale-tailworm.md.

## Verification chain

- X post verified live (signed-in read): @cursor_ai, posted Oct 30, 2026, confirms "a security
  incident affecting a modified Claude Code VS Code extension" via the Cursor marketplace,
  "at most 5,000 users", "not developed by Anthropic", marketplace taken down and reinstated,
  links the Cursor security notice.
- Primary: https://cursor.com/blog/claude-code-extension-security-notice (Oct 29, 2026).
  Window ~2:27am-1:35pm PT Oct 29; darwin-arm64 and win32-x64 builds; IoCs incl. svc-telemetry
  key (SHA256:0Z6R+DF64Do2nwQic8a7kkfDLNNk4IiK+2U2Rci4htk), C2 134.209.82.225 (22, 8099/beacon),
  persistence com.apple.sysmond / SysMon; remediation scripts for macOS + Windows; server taken
  offline with hosting provider.
- Independent: OpenSourceMalware (updated post; originally blamed Open VSX, corrected after
  Cursor contact), Rescana (registry cross-checks: no 2.1.313 on npm/Open VSX/MS marketplace;
  Anthropic changelog 2.1.312 -> 2.1.314; no CVE/KEV), Phorion (advisory; Open VSX attribution
  superseded; macOS enable-step likely fails for standard users).

## Judgment calls

- status confirmed (vendor notice + 3 independent analyses), severity high (Rescana's
  assessment; no CVE/CVSS assigned).
- date 2026-10-29 (malicious availability window + vendor notice); X announcement Oct 30 in
  dateLabel.
- Not merged with any existing entry; distinct from tailscale-ts-2026-013-emudhra and
  tailscale-tailworm-ssh-vulns.
