// Renders a social card per incident ("Node.js is on fire.") into dist/assets/og/<id>.jpg.
// Run after scripts/build.mjs. Set CHROME_PATH to use a local Chromium.
import {chromium} from '@playwright/test';
import fs from 'node:fs';import path from 'node:path';
import {subjectOf} from '../render.js';

const only=process.argv[2];
const {incidents}=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
fs.mkdirSync('dist/assets/og',{recursive:true});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630}});
 await page.goto('file://'+path.resolve('tools/og/card.html'));
 await page.evaluate(()=>document.fonts.ready);
 for(const item of incidents){
  if(only&&item.id!==only)continue;
  // Shrink the headline until it fits the text column (long names wrap, then get smaller).
  await page.evaluate((subject)=>{
   const h=document.querySelector('h1');document.querySelector('[data-subject]').textContent=subject;
   let size=96;h.style.fontSize=size+'px';
   const col=[...document.querySelector('.col').children];
   const tooBig=()=>h.scrollWidth>h.clientWidth||col.at(-1).getBoundingClientRect().bottom-col[0].getBoundingClientRect().top>540;
   while(size>44&&tooBig()){size-=4;h.style.fontSize=size+'px';}
  },subjectOf(item));
  await page.screenshot({path:`dist/assets/og/${item.id}.jpg`,type:'jpeg',quality:88});
 }
}finally{await browser.close();}
console.log(`Rendered ${only?1:incidents.length} social cards`);
