// Mirrors data/tags.json as GitHub labels so issues and PRs can be tagged. Needs the gh CLI, authenticated.
// Usage: node scripts/sync-labels.mjs
import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const repo='Kuberwastaken/internetonfire';
const {tags}=JSON.parse(fs.readFileSync('data/tags.json','utf8'));
for(const t of tags){
 execFileSync('gh',['label','create',t.id,'--repo',repo,'--color','f4b183','--description',t.description,'--force'],{stdio:'inherit'});
}
console.log(`synced ${tags.length} labels`);
