import {chromium} from '@playwright/test';import fs from 'node:fs';import assert from 'node:assert/strict';
// Usage: node tests/live-check.mjs https://kuber.studio/internetonfire/   (CHROME_PATH optional)
const url=process.argv[2];if(!url)throw Error('Pass the actual deployed URL');
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});fs.mkdirSync('test-results',{recursive:true});
try{for(const width of [320,390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.locator('.incident').first().waitFor();
 const rows=await page.locator('.incident').count();assert.ok(rows>=35);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.ok(await page.evaluate(()=>document.fonts.check('16px Inter')));
 await page.screenshot({path:`test-results/live-home-${width}.png`});
 await page.locator('#search').fill('NGINX / five');assert.equal(await page.locator('.incident').count(),1);await page.locator('#search').fill('');
 await page.locator('.incident .toggle').first().click();assert.ok(await page.locator('.incident .more').first().isVisible());
 await page.locator('#review').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/live-review-${width}.png`});
 assert.ok(!(await page.locator('#pr-list').innerText()).includes('test fixture'));
 console.log(JSON.stringify({width,rows,stars:await page.locator('[data-stars]').first().innerText(),queue:await page.locator('#pr-list').innerText(),errors}));
 assert.deepEqual(errors,[]);await page.close();
}}finally{await browser.close();}
