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
 // Renders one card. titles (period cards only) lists every company/product name
 // disclosed in the range, one per line; the font shrinks until all of them fit -
 // nothing is hidden behind "+N more". Sparse periods keep the standard composition; when the list can't
 // fit it at a readable size, the card switches to a dense composition (compact header,
 // smaller art, full-width multi-column list) in the same type and colors.
 // Returns the layout used so dense/failed renders are visible in the build log.
 const shoot=async(subject,file,nowrap=false,titles=[])=>{
  const layout=await page.evaluate(({subject,nowrap,titles})=>{
   const body=document.body;body.classList.remove('dense');
   const h=document.querySelector('h1');const span=document.querySelector('[data-subject]');span.textContent=subject;
   // Period subjects ("26 Oct - 1 Nov") stay on one line so a range never breaks mid-date;
   // the shrink loop below drops the font size until it fits.
   span.style.whiteSpace=nowrap?'nowrap':'';
   document.querySelector('[data-names]')?.remove();
   let namesEl=null;
   if(titles.length){
    namesEl=document.createElement('div');namesEl.setAttribute('data-names','');namesEl.className='names';
    for(const t of titles){const d=document.createElement('div');d.className='issue';d.textContent=t;namesEl.append(d);}
    h.after(namesEl);
   }
   const col=document.querySelector('.col');
   const hOverflow=()=>h.scrollWidth>h.clientWidth+1;
   const colTooBig=()=>{const kids=[...col.children];return hOverflow()||kids.at(-1).getBoundingClientRect().bottom-kids[0].getBoundingClientRect().top>540;};
   if(!titles.length){
    let size=96;h.style.fontSize=size+'px';
    while(size>44&&colTooBig()){size-=4;h.style.fontSize=size+'px';}
    return{mode:'incident'};
   }
   // Standard composition: shrink the title list (floor 19px), then the headline.
   for(let ns=27;ns>=19;ns--){
    namesEl.style.fontSize=ns+'px';
    for(let size=96;size>=44;size-=4){h.style.fontSize=size+'px';if(!colTooBig())return{mode:'standard',namesSize:ns,headlineSize:size};}
   }
   // Dense composition. The names list must clear the smaller art; clearArt() pins its
   // top below the art's bottom edge, then the fit check keeps it above the footer url.
   body.classList.add('dense');
   // The tagline stays above the list; the footer url is absolutely placed, so the
   // fit check below keeps the list clear of it.
   document.querySelector('.fine').after(namesEl);
   namesEl.style.columnCount=titles.length>20?'3':'2';
   const art=document.querySelector('.art');
   const clearArt=()=>{const a=art.getBoundingClientRect();const r=namesEl.getBoundingClientRect();
    const m=parseFloat(getComputedStyle(namesEl).marginTop);namesEl.style.marginTop=Math.max(22,Math.round(m+a.bottom+18-r.top))+'px';};
   for(let ns=22;ns>=13;ns--){
    namesEl.style.fontSize=ns+'px';
    for(let size=72;size>=40;size-=4){h.style.fontSize=size+'px';clearArt();
     if(!hOverflow()&&namesEl.getBoundingClientRect().bottom<=562)return{mode:'dense',namesSize:ns,headlineSize:size};}
   }
   // Max composition for the busiest periods: smallest art, tighter header, wider columns.
   body.classList.remove('dense');body.classList.add('max');
   namesEl.style.columnCount=titles.length>28?'4':'3';
   for(let ns=16;ns>=12;ns--){
    namesEl.style.fontSize=ns+'px';
    for(let size=64;size>=36;size-=4){h.style.fontSize=size+'px';clearArt();
     if(!hOverflow()&&namesEl.getBoundingClientRect().bottom<=560)return{mode:'max',namesSize:ns,headlineSize:size};}
   }
   return{mode:'fail',titles:titles.length};
  },{subject,nowrap,titles});
  if(layout.mode==='fail')throw new Error(`period card cannot fit ${layout.titles} titles legibly: ${file}`);
  await page.screenshot({path:file,type:'jpeg',quality:88});
  return layout;
 };
 let n=0;
 for(const item of incidents){
  if(only&&item.id!==only)continue;
  await shoot(subjectOf(item),`dist/assets/og/${item.id}.jpg`);n++;
 }
 if(!only)for(const p of [...periods({incidents}).days,...periods({incidents}).weeks]){
  // Every company/product name disclosed in the period, deduped, all of them visible.
  const titles=[...new Set(p.items.map(subjectOf))];
  const layout=await shoot(p.label,`dist/assets/og/${periodDir(p.kind)}-${p.key}.jpg`,true,titles);n++;
  console.log(`${periodDir(p.kind)}-${p.key}: ${layout.mode} (${titles.length} names, names ${layout.namesSize}px, headline ${layout.headlineSize}px)`);
 }
 console.log(`Rendered ${only?1:n} social cards`);
}finally{await browser.close();}
