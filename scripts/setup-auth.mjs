// One-time setup for in-page voting and submitting.
//   1. deploys worker/ to Cloudflare (needs `npx wrangler login` first)
//   2. opens GitHub's "create app from manifest" page: you click Create
//   3. stores the app's client secret as a Worker secret (never written to disk) and its client id in wrangler.toml
//   4. points index.html at the worker
//   5. prints the link to install the app on the repo: you click Install
// Usage: node scripts/setup-auth.mjs
import http from 'node:http';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const PORT = 3977;
const wrangler = (args, input) => {
  const r = spawnSync('npx', ['-y', 'wrangler@4', ...args], { cwd: 'worker', input, encoding: 'utf8' });
  if (r.status !== 0) throw Error(`wrangler ${args.join(' ')} failed:\n${r.stderr || r.stdout}`);
  return r.stdout + r.stderr;
};

console.log('Deploying the worker…');
const out = wrangler(['deploy']);
const workerURL = out.match(/https:\/\/internetonfire-auth\.[a-z0-9-]+\.workers\.dev/)?.[0];
if (!workerURL) throw Error('Could not find the workers.dev URL in:\n' + out);
console.log('Worker:', workerURL);

const manifest = {
  name: 'internetonfire',
  url: 'https://kuber.studio/internetonfire/',
  description: 'Vote on and submit incidents from kuber.studio/internetonfire. Only acts on the internetonfire repo.',
  callback_urls: [`${workerURL}/callback`],
  redirect_url: `http://127.0.0.1:${PORT}/done`,
  public: true,
  request_oauth_on_install: false,
  default_permissions: { metadata: 'read', issues: 'write', pull_requests: 'write' },
  default_events: [],
};

const page = `<!doctype html><meta charset="utf-8"><title>Create GitHub App</title>
<body style="font:16px system-ui;max-width:32rem;margin:4rem auto">
<p>Creating the <b>internetonfire</b> GitHub App. GitHub will ask you to confirm.</p>
<form id="f" method="post" action="https://github.com/settings/apps/new">
<input type="hidden" name="manifest" value="${JSON.stringify(manifest).replace(/"/g, '&quot;')}">
<button>Continue to GitHub</button></form><script>document.getElementById('f').submit()</script>`;

await new Promise((resolve, reject) => {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    if (url.pathname === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page); }
    if (url.pathname !== '/done') { res.writeHead(404); return res.end(); }
    try {
      const r = await fetch(`https://api.github.com/app-manifests/${encodeURIComponent(url.searchParams.get('code') || '')}/conversions`, {
        method: 'POST', headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'internetonfire-setup' },
      });
      if (!r.ok) throw Error(`GitHub said ${r.status}: ${await r.text()}`);
      const app = await r.json();
      wrangler(['secret', 'put', 'GITHUB_CLIENT_SECRET'], app.client_secret);
      const toml = fs.readFileSync('worker/wrangler.toml', 'utf8').replace(/GITHUB_CLIENT_ID = ".*"/, `GITHUB_CLIENT_ID = "${app.client_id}"`);
      fs.writeFileSync('worker/wrangler.toml', toml);
      wrangler(['deploy']);
      const html = fs.readFileSync('index.html', 'utf8').replace(/<meta name="iof-auth" content="[^"]*">/, `<meta name="iof-auth" content="${workerURL}">`);
      fs.writeFileSync('index.html', html);
      const install = `https://github.com/apps/${app.slug}/installations/new`;
      res.writeHead(302, { Location: install }); res.end();
      console.log(`\nApp created: ${app.html_url}\nNow click Install (only on Kuberwastaken/internetonfire): ${install}\nThen commit worker/wrangler.toml and index.html and push.`);
      server.close(); resolve();
    } catch (e) { res.writeHead(500); res.end(String(e.message)); server.close(); reject(e); }
  });
  server.listen(PORT, '127.0.0.1', () => {
    const u = `http://127.0.0.1:${PORT}/`;
    console.log('Opening', u);
    try { execFileSync('open', [u]); } catch { console.log('Open it in your browser.'); }
  });
});
