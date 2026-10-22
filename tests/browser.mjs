import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';import fs from 'node:fs';import assert from 'node:assert/strict';
// Set CHROME_PATH to use a local Chromium instead of Playwright's pinned download.
const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));const total=data.incidents.length;
fs.mkdirSync('test-results',{recursive:true});const server=spawn('python3',['-m','http.server','4184','--bind','127.0.0.1'],{stdio:'ignore'});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
const issues=[{number:7,title:'Add example incident (test fixture)',html_url:'https://github.com/Kuberwastaken/internetonfire/pull/7',created_at:'2026-10-22T00:00:00Z',pull_request:{},draft:false,labels:[{name:'npm'}],reactions:{'+1':3,'-1':1}},{number:8,title:'Draft redesign (should be hidden)',html_url:'https://github.com/Kuberwastaken/internetonfire/pull/8',pull_request:{},draft:true,reactions:{}}];
const mockGitHub=(page,status=200)=>page.route('https://api.github.com/**',r=>status!==200?r.fulfill({status,body:'rate limit'}):r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().url().includes('/issues')?issues:{stargazers_count:42})}));
try{
 for(let n=0;n<30;n++){try{if((await fetch('http://127.0.0.1:4184')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await mockGitHub(page);
  await page.goto('http://127.0.0.1:4184',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.fonts.check('16px Inter')),'Inter loaded');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
  const headN=async()=>{const t=await page.locator('[data-headline] b').innerText();return t==='No'?0:Number(t);};
  const week=await headN();assert.equal(await page.locator('.incident').count(),week,'default view is last week');
  assert.ok((await page.locator('[data-headline]').innerText()).includes('in the last week'));
  // Collapsed by default; details stay hidden until opened.
  assert.equal(await page.locator('.incident .more').first().isVisible(),false);
  await page.screenshot({path:`test-results/home-${width}.png`});
  // Search
  await page.locator('#search').fill('zzzz-not-an-incident');assert.equal(await page.locator('.incident').count(),0);await page.getByText('Suspiciously fine').waitFor();
  await page.locator('#search').fill('');assert.equal(await page.locator('.incident').count(),week);
  // All time
  await page.locator('[data-window="all"]').click();assert.equal(await page.locator('.incident').count(),total);assert.equal(await headN(),total);assert.ok((await page.locator('[data-headline]').innerText()).includes('logged so far'));
  // Evidence chips
  await page.locator('#status [data-status="unverified"]').click();
  for(const s of await page.locator('.incident').evaluateAll(ns=>ns.map(n=>n.dataset.status)))assert.equal(s,'unverified');
  assert.ok((await page.locator('[data-headline]').innerText()).includes('unverified'));
  await page.locator('[data-clear]').click();assert.equal(await page.locator('.incident').count(),week);
  // Tags: bar filter and on-card tags
  const tag=await page.locator('#tagbar .tag').first().getAttribute('data-tag');await page.locator('#tagbar .tag').first().click();
  for(const tags of await page.locator('.incident').evaluateAll(ns=>ns.map(n=>[...n.querySelectorAll('.tag')].map(t=>t.dataset.tag))))assert.ok(tags.includes(tag));
  assert.equal(await headN(),await page.locator('.incident').count());assert.ok((await page.locator('[data-headline]').innerText()).includes('#'+tag));
  await page.locator('.incident .tag[aria-pressed="true"]').first().click();assert.equal(await page.locator('.incident').count(),week);
  // Bar click filters to one day
  const bar=page.locator('.bar:not([disabled])').last();const day=await bar.getAttribute('data-day');await bar.click();
  const shown=await page.locator('.incident').count();assert.ok(shown>0&&shown<=total);assert.equal(await page.locator('.bar.sel').getAttribute('data-day'),day);
  assert.equal(await headN(),shown);await page.locator('.bar.sel').click();assert.equal(await page.locator('.incident').count(),week);
  // Expand + permalink
  const first=page.locator('.incident').first();await first.locator('.toggle').click();assert.ok(await first.locator('.more').isVisible());
  assert.equal(await first.locator('.toggle').getAttribute('aria-expanded'),'true');assert.ok(page.url().endsWith('#'+await first.getAttribute('id')));
  await page.screenshot({path:`test-results/open-${width}.png`});
  await first.locator('.toggle').click();assert.equal(await first.locator('.more').isVisible(),false);
  // Only https or in-page links inside incidents
  for(const href of await page.locator('.incident a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href'))))assert.ok(href.startsWith('https://')||href.startsWith('#'),href);
  // GitHub: star count, PR queue (drafts hidden), vote counts
  await page.locator('[data-stars]').first().waitFor();assert.equal(await page.locator('[data-stars]').first().innerText(),'42');
  const queue=await page.locator('#pr-list').innerText();assert.ok(queue.includes('test fixture'));assert.ok(!queue.includes('should be hidden'));assert.equal((await page.locator('.vote[data-content="+1"]').first().textContent()).replace(/\s+/g,' ').trim(),'👍 3');assert.ok(queue.includes('npm'));
  await page.locator('#review').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/review-${width}.png`});
  // Signed out, no auth endpoint: votes and the submit dialog hand off to GitHub
  await page.evaluate(()=>{window.open=(u)=>{window.__opened=u;};});const opened=()=>page.evaluate(()=>window.__opened);
  await page.locator('.vote[data-content="+1"]').first().click();assert.ok((await opened()).endsWith('/issues/7'));
  await page.locator('.top [data-open-submit]').click();assert.ok(await page.locator('#submit-dialog').evaluate(d=>d.open));
  await page.locator('#submit-form [data-primary]').click();assert.ok((await page.locator('.form-msg').innerText()).includes('name'));
  await page.locator('#submit-form [name=name]').fill('Example Corp breach');await page.locator('#submit-form [name=summary]').fill('Example summary.');await page.locator('#submit-form [name=sources]').fill('https://example.com/advisory');
  await page.locator('#tag-pick .tag-opt').first().click();await page.locator('#submit-form .check').click();
  await page.screenshot({path:`test-results/submit-${width}.png`});
  await page.locator('#submit-form [data-primary]').click();
  const prefill=new URL(await opened());assert.equal(prefill.searchParams.get('template'),'incident.yml');assert.equal(prefill.searchParams.get('name'),'Example Corp breach');assert.ok(prefill.searchParams.get('tags'));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#submit-dialog').evaluate(d=>d.open),false);
  // API failure fallback
  await page.unroute('https://api.github.com/**');await mockGitHub(page,403);await page.locator('#refresh-prs').click();await page.getByText('GitHub isn’t answering',{exact:false}).waitFor();
  // Deep link opens the entry
  await page.goto('http://127.0.0.1:4184/#zeabur-breach',{waitUntil:'networkidle'});assert.ok(await page.locator('#zeabur-breach .more').isVisible());
  // Reduced motion keeps the dog still
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.dog video').evaluate(v=>v.paused),true);
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.screenshot({path:`test-results/dark-${width}.png`});
  // Signed in through the auth worker: vote toggles a real reaction, submit opens an issue
  {
   const calls=[];const auth=await browser.newPage({viewport:{width,height:1000}});auth.on('pageerror',e=>errors.push(e.message));
   await auth.route('http://127.0.0.1:4184/',async r=>{const res=await r.fetch();r.fulfill({response:res,body:(await res.text()).replace('<meta name="iof-auth" content="">','<meta name="iof-auth" content="https://auth.test">')});});
   await auth.route('https://avatars.test/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg"/>'}));
   await auth.route('https://api.github.com/**',r=>{const u=new URL(r.request().url()),m=r.request().method();calls.push(m+' '+u.pathname);const json=(b,st=200)=>r.fulfill({status:st,contentType:'application/json',body:JSON.stringify(b)});
    if(u.pathname==='/user')return json({login:'tester',avatar_url:'https://avatars.test/u'});
    if(u.pathname.endsWith('/reactions')&&m==='GET')return json([]);
    if(u.pathname.endsWith('/reactions')&&m==='POST')return json({id:99,content:JSON.parse(r.request().postData()).content},201);
    if(/\/reactions\/99$/.test(u.pathname)&&m==='DELETE')return r.fulfill({status:204});
    if(u.pathname.endsWith('/issues')&&m==='POST'){const b=JSON.parse(r.request().postData());assert.ok(b.body.includes('### Tags'));assert.ok(b.title.startsWith('[Incident] '));return json({number:12,html_url:'https://github.com/Kuberwastaken/internetonfire/issues/12'},201);}
    if(u.pathname.endsWith('/issues'))return json(issues);return json({stargazers_count:42});});
   await auth.goto('http://127.0.0.1:4184/#iof_token=test-token',{waitUntil:'networkidle'});
   assert.equal(new URL(auth.url()).hash,'','token stripped from the URL');assert.equal(await auth.evaluate(()=>JSON.parse(localStorage.getItem('iof-gh-token'))),'test-token');
   assert.equal(await auth.locator('#account').isVisible(),true);
   const up=auth.locator('.vote[data-content="+1"]').first();await up.click();await auth.waitForFunction(()=>document.querySelector('.vote[data-content="+1"]').getAttribute('aria-pressed')==='true');
   assert.equal((await up.locator('.n').innerText()),'4');assert.ok(calls.includes('POST /repos/Kuberwastaken/internetonfire/issues/7/reactions'));
   await up.click();await auth.waitForFunction(()=>document.querySelector('.vote[data-content="+1"]').getAttribute('aria-pressed')==='false');assert.ok(calls.some(c=>c.startsWith('DELETE ')));
   await auth.locator('.top [data-open-submit]').click();assert.ok((await auth.locator('#submit-form [data-primary]').innerText()).includes('@tester'));
   await auth.locator('#submit-form [name=name]').fill('Example');await auth.locator('#submit-form [name=summary]').fill('Summary.');await auth.locator('#submit-form [name=sources]').fill('https://example.com/a');await auth.locator('#tag-pick .tag-opt').first().click();await auth.locator('#submit-form .check').click();
   await auth.locator('#submit-form [data-primary]').click();await auth.getByText('#12').waitFor();await auth.keyboard.press('Escape');assert.ok(calls.includes('POST /repos/Kuberwastaken/internetonfire/issues'));
   await auth.locator('#account .avatar-btn').click();await auth.locator('[data-signout]').click();assert.equal(await auth.locator('#account').isVisible(),false);
   await auth.close();
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}: layout, font, search, chips, headline, bars, expand, links, stars, queue, fallback, deep link, motion, tags, submit, voting`);
 }
}finally{await browser.close();server.kill();}
