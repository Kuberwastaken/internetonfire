import fs from 'node:fs';
import {validate} from './validate.mjs';
import {barsHTML, headlineHTML, listHTML, periodDir, periods, periodSharePageHTML, sharePageHTML, sortIncidents} from '../render.js';
import {timeMatch} from '../time.js';
import {atomFeed, jsonLd, llmsTxt, sitemap} from './seo.mjs';

const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
const errors=validate(data);if(errors.length)throw Error(errors.join('\n'));

// Prerender the log so the page reads without JavaScript and paints before the data fetch.
// The headline matches app.js's default view (last week). The list carries every incident so crawlers and
// no-JS readers get the whole log; the page re-filters with the visitor's clock on load.
const today=new Date().toISOString().slice(0,10);
const week=data.incidents.filter(i=>['within','possible'].includes(timeMatch(i,'week')));
const html=fs.readFileSync('index.html','utf8')
  .replace('<!--HEADLINE-->',()=>headlineHTML(week.length))
  .replace('<!--LIST-->',()=>listHTML(sortIncidents(data.incidents)))
  .replace('<!--JSONLD-->',()=>jsonLd(data))
  .replace('<!--BARS-->',()=>barsHTML(data.incidents,today));

fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const file of ['style.css','app.js','render.js','contribute.js','time.js','assets','data'])fs.cpSync(file,'dist/'+file,{recursive:true});
fs.writeFileSync('dist/index.html',html);
// One share page per incident (dist/i/<id>/); scripts/og.mjs renders the images they point at.
for(const item of data.incidents){fs.mkdirSync(`dist/i/${item.id}`,{recursive:true});fs.writeFileSync(`dist/i/${item.id}/index.html`,sharePageHTML(item));}
// Day and week share pages (dist/d/<date>/, dist/w/<iso-week>/); scripts/og.mjs renders their cards.
for(const p of [...periods(data).days,...periods(data).weeks]){fs.mkdirSync(`dist/${periodDir(p.kind)}/${p.key}`,{recursive:true});fs.writeFileSync(`dist/${periodDir(p.kind)}/${p.key}/index.html`,periodSharePageHTML(p));}
fs.writeFileSync('dist/.nojekyll','');
const tags=JSON.parse(fs.readFileSync('data/tags.json','utf8')).tags;
fs.writeFileSync('dist/llms.txt',llmsTxt(data,tags));
fs.writeFileSync('dist/feed.xml',atomFeed(data));
fs.writeFileSync('dist/sitemap.xml',sitemap(data));
console.log('Static site built in dist/');
