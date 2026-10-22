// Caches a favicon for every source domain in data/incidents.json that lacks one.
// Usage: node tools/fetch-source-icons.mjs
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
const dir='assets/source-icons';fs.mkdirSync(dir,{recursive:true});
const hosts=new Set(data.incidents.flatMap(i=>i.sources.map(s=>new URL(s.url).hostname.replace(/^www\./,''))));
for(const host of hosts){
 const file=`${dir}/${host}.png`;if(fs.existsSync(file))continue;
 const r=await fetch(`https://www.google.com/s2/favicons?domain=${host}&sz=64`,{headers:{'User-Agent':'OpenAI File Downloader, XaiImageApiFetch/1.0'}});
 if(!r.ok){console.log('no icon',host);continue;}
 fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));console.log('saved',host);
}
