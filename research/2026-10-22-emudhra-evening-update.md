# eMudhra existing-entry maintenance, 22 October 2026 evening

Base: main 4b76562d0e17fd2df04d3a054bc1addf6eda09ae. Data blob observed in GitHub contents API before editing. Only emudhra-ca-key-compromise changed, preserving all 36 IDs and the current Codex schema, names, tags and UI.

Source: https://emudhra.com/en/post/certificate-security-incident

The statement fetched at about 18:45 IST says Last updated 22 October 2026 and adds Update 4: Sectigo certificates are available as an alternate option to all customers; G1 roots remain active and supported. The official statement contains the account/support routes; the index does not ask anyone to send secrets.

The current Update 3 also changes report/revocation dates to Oct 17 / Oct 18. The earlier body fetched during the initial build explicitly said Oct 18 / Oct 19. This update does not silently erase that history: it attributes the new date to the revised vendor account and records both versions in the entry correction. We have not independently inspected the certificate revocation record.

Independent source https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/ supports the initial report arriving Oct 17 at 20:06 UTC and Firefox blocking that day; it does not establish the vendor revocation date. https://blog.cloudflare.com/emudhra-certificate-compromise dates Cloudflare awareness to Oct 19, which is not the same event as revocation and does not settle the vendor date change.

No new incident, layout, JavaScript, CSS, dependencies or workflows changed. DisclosureDate stays Oct 20, the initial report publication, so a vendor update does not misleadingly reset first disclosure to today. Source date identifies the current statement update. No stronger impact/exploitation claim is introduced.
