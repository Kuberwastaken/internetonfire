import fs from 'node:fs';
import {validate} from './validate.mjs';
import {barsHTML, headlineHTML, listHTML, sharePageHTML, sortIncidents} from '../render.js';
import {timeMatch} from '../time.js';

const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
const errors=validate(data);if(errors.length)throw Error(errors.join('\n'));

// Prerender the log so the page reads without JavaScript and paints before the data fetch.
// Matches app.js's default view (last week); the page re-renders with the visitor's clock on load.
const today=new Date().toISOString().slice(0,10);
const week=data.incidents.filter(i=>['within','possible'].includes(timeMatch(i,'week')));
const html=fs.readFileSync('index.html','utf8')
  .replace('<!--HEADLINE-->',()=>headlineHTML(week.length))
  .replace('<!--LIST-->',()=>listHTML(sortIncidents(week)))
  .replace('<!--BARS-->',()=>barsHTML(data.incidents,today));

fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const file of ['style.css','app.js','render.js','contribute.js','time.js','assets','data'])fs.cpSync(file,'dist/'+file,{recursive:true});
fs.writeFileSync('dist/index.html',html);
// One share page per incident (dist/i/<id>/); scripts/og.mjs renders the images they point at.
for(const item of data.incidents){fs.mkdirSync(`dist/i/${item.id}`,{recursive:true});fs.writeFileSync(`dist/i/${item.id}/index.html`,sharePageHTML(item));}
fs.writeFileSync('dist/.nojekyll','');
console.log('Static site built in dist/');
