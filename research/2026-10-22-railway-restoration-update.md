# Railway existing-entry maintenance, Oct 22 evening

Base 126a3fee324c7cedbd4466ae310042eda0d303ec. Only Railway detail fields changed; all 37 IDs and prior records preserved. No UI files.

Primary status: https://status.railway.com/incident/QH8L8B3E

At 14:50 UTC on Oct 22, the page reported Pro and Enterprise deployments available but slower, with Hobby/Free/Trial builds still being enabled. The initial all-deployment pause must not be presented as the present state of every plan. The entry now uses a timestamped snapshot and links current status. Initial disclosure date stays unchanged.

Primary credential reset/recovery guide: https://blog.railway.com/p/security-disclosure-recommendation-redeploy-buckets-and-reconnect-github-after-the-credential-reset

The guide distinguishes invalidated held GitHub account tokens from registry personal-access tokens removed from Railway. Those registry tokens may still work on GitHub and require user revocation there. Bucket credentials need redeploy; GitHub account connections need reconnection. Do not imply Railway's removal alone revoked all registry tokens. No commands, credentials or customer records included.
