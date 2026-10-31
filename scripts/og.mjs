// Renders a social card per incident ("Node.js is on fire.") into dist/assets/og/<id>.jpg,
// plus one per disclosure day and ISO week ("Fri 30 Oct is on fire.") for the period share
// pages (dist/assets/og/d-<date>.jpg, w-<week>.jpg). Run after scripts/build.mjs.
// Set CHROME_PATH to use a local Chromium.
import {chromium} from '@playwright/test';
import fs from 'node:fs';import path from 'node:path';
import {periodDir, periods, subjectOf} from '../render.js';

const only=process.argv[2];
const {incidents}=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
fs.mkdirSync('dist/assets/og',{recursive:true});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630}});
 await page.goto('file://'+path.resolve('tools/og/card.html'));
 await page.evaluate(()=>document.fonts.ready);
 // Shrink the headline until it fits the text column (long names wrap, then get smaller).
 const shoot=async(subject,file,nowrap=false,names='')=>{
  await page.evaluate(({subject,nowrap,names})=>{
   const h=document.querySelector('h1');const span=document.querySelector('[data-subject]');span.textContent=subject;
   // Period subjects ("26 Oct - 1 Nov") stay on one line so a range never breaks mid-date;
   // the shrink loop below drops the font size until it fits.
   span.style.whiteSpace=nowrap?'nowrap':'';
   // Period cards also list the period's incident names - the embed preview must show them,
   // not hide them in the description. Same type as the tagline, a size down.
   let namesEl=document.querySelector('[data-names]');
   if(names){
    if(!namesEl){namesEl=document.createElement('p');namesEl.setAttribute('data-names','');h.after(namesEl);}
    namesEl.textContent=names;
    namesEl.style.cssText='margin:26px 0 0;font-size:30px;line-height:1.25;letter-spacing:-.015em;color:#3b3a37;font-weight:600';
   }else if(namesEl)namesEl.remove();
   let size=96;h.style.fontSize=size+'px';
   const col=[...document.querySelector('.col').children];
   const tooBig=()=>h.scrollWidth>h.clientWidth||col.at(-1).getBoundingClientRect().bottom-col[0].getBoundingClientRect().top>540;
   while(size>44&&tooBig()){size-=4;h.style.fontSize=size+'px';}
  },{subject,nowrap,names});
  await page.screenshot({path:file,type:'jpeg',quality:88});
 };
 let n=0;
 for(const item of incidents){
  if(only&&item.id!==only)continue;
  await shoot(subjectOf(item),`dist/assets/og/${item.id}.jpg`);n++;
 }
 // A period card carries the period's names, deduped, truncated to fit the card.
 const namesOf=(items)=>{
  const names=[...new Set(items.map(subjectOf))];const kept=[];
  for(const name of names){if([...kept,name].join(' · ').length>90)break;kept.push(name);}
  const more=names.length-kept.length;
  return kept.join(' · ')+(more?` · +${more} more`:'');
 };
 if(!only)for(const p of [...periods({incidents}).days,...periods({incidents}).weeks]){await shoot(p.label,`dist/assets/og/${periodDir(p.kind)}-${p.key}.jpg`,true,namesOf(p.items));n++;}
 console.log(`Rendered ${only?1:n} social cards`);
}finally{await browser.close();}
