// GitHub sign-in for internetonfire. Its only job is the OAuth code exchange, which needs the app's
// client secret and which GitHub won't serve to browsers (no CORS). The site then calls api.github.com
// directly with the user's token. The GitHub App is installed on one repo with Issues + Pull requests
// write, so a token can only open issues, comment and react on Kuberwastaken/internetonfire.

const ALLOWED_RETURN = [
  /^https:\/\/kuber\.studio\/internetonfire(\/|$)/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//,
];
const STATE_COOKIE = 'iof_state';

const okReturn = (url) => typeof url === 'string' && ALLOWED_RETURN.some((re) => re.test(url));
const randomHex = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, '0')).join('');
const cookie = (req, name) => (req.headers.get('Cookie') || '').split(/;\s*/).find((c) => c.startsWith(name + '='))?.slice(name.length + 1);
const text = (body, status = 400) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === '/login') {
      const ret = url.searchParams.get('return');
      if (!okReturn(ret)) return text('return URL not allowed');
      const nonce = randomHex(16);
      const auth = new URL('https://github.com/login/oauth/authorize');
      auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      auth.searchParams.set('redirect_uri', `${url.origin}/callback`);
      auth.searchParams.set('state', nonce);
      return new Response(null, {
        status: 302,
        headers: {
          Location: auth.href,
          'Set-Cookie': `${STATE_COOKIE}=${nonce}.${btoa(ret)}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    if (url.pathname === '/callback') {
      const [nonce, ret64] = (cookie(req, STATE_COOKIE) || '').split('.');
      let ret = null;
      try { ret = atob(ret64 || ''); } catch {}
      if (!nonce || nonce !== url.searchParams.get('state') || !okReturn(ret)) return text('Sign-in expired. Go back and try again.');
      const clear = `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
      const back = new URL(ret);
      const code = url.searchParams.get('code');
      if (code) {
        const r = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'internetonfire-auth' },
          body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/callback` }),
        });
        const data = await r.json().catch(() => ({}));
        // The token travels in the fragment, which never reaches a server or a Referer header.
        back.hash = data.access_token ? `iof_token=${encodeURIComponent(data.access_token)}` : 'iof_error=denied';
      } else {
        back.hash = 'iof_error=denied';
      }
      return new Response(null, { status: 302, headers: { Location: back.href, 'Set-Cookie': clear, 'Referrer-Policy': 'no-referrer' } });
    }

    if (url.pathname === '/') return text('internetonfire sign-in. Nothing to see here.', 200);
    return text('Not found', 404);
  },
};
