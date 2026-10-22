// Caches a favicon for every source domain in data/incidents.json that lacks one.
// Usage: node tools/fetch-source-icons.mjs
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('data/incidents.json','utf8'));
const dir='assets/source-icons';fs.mkdirSync(dir,{recursive:true});
const hosts=new Set(data.incidents.flatMap(i=>i.sources.map(s=>new URL(s.url).hostname.replace(/^www\./,''))));
for(const host of hosts){
 const file=`${dir}/${host}.png`;if(fs.existsSync(file))continue;
 // Subdomains without their own icon (status.example.com) borrow the parent domain's.
 const candidates=[host];const parts=host.split('.');if(parts.length>2)candidates.push(parts.slice(1).join('.'));
 let saved=false;
 for(const domain of candidates){
  const r=await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`,{headers:{'User-Agent':'OpenAI File Downloader, XaiImageApiFetch/1.0'}});
  if(!r.ok)continue;
  fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));console.log('saved',host,domain===host?'':`(from ${domain})`);saved=true;break;
 }
 if(!saved)console.log('no icon',host);
}
