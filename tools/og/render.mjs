// Renders tools/og/og.html to assets/og.png (1200x630 social card). Usage: node tools/og/render.mjs
import {chromium} from '@playwright/test';import path from 'node:path';
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
const page=await browser.newPage({viewport:{width:1200,height:630}});
await page.goto('file://'+path.resolve('tools/og/og.html'));await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'assets/og.png'});await browser.close();console.log('wrote assets/og.png');
