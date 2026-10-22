import fs from 'node:fs';
import {validate} from './validate.mjs';
import {barsHTML, listHTML, sortIncidents} from '../render.js';

const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
const errors=validate(data);if(errors.length)throw Error(errors.join('\n'));

// Prerender the log so the page reads without JavaScript and paints before the data fetch.
const today=new Date().toISOString().slice(0,10);
const html=fs.readFileSync('index.html','utf8')
  .replace('<!--LIST-->',()=>listHTML(sortIncidents(data.incidents)))
  .replace('<!--BARS-->',()=>barsHTML(data.incidents,today));

fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const file of ['style.css','app.js','render.js','time.js','assets','data'])fs.cpSync(file,'dist/'+file,{recursive:true});
fs.writeFileSync('dist/index.html',html);
fs.writeFileSync('dist/.nojekyll','');
console.log('Static site built in dist/');
