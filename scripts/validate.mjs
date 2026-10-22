import fs from 'node:fs';
export function validate(data){
 const errors=[];const ids=new Set();const statuses=['confirmed','reported','disputed','unverified'];
 const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 if(!date(data.updated))errors.push('updated must be a real ISO date');if(!Array.isArray(data.incidents))return ['incidents must be an array'];
 for(const i of data.incidents){const p=i.id||'(missing id)';if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(i.id)||ids.has(i.id))errors.push(p+': unique kebab-case id required');ids.add(i.id);
 for(const k of ['name','summary','dateLabel','category'])if(typeof i[k]!=='string'||!i[k].trim())errors.push(p+': '+k+' required');
 if(!statuses.includes(i.status))errors.push(p+': invalid status');if(i.date!==null&&!date(i.date))errors.push(p+': invalid date');if(i.disclosureDate!==undefined&&i.disclosureDate!==null&&!date(i.disclosureDate))errors.push(p+': invalid disclosureDate');if(i.disclosedAt!==undefined&&(!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(i.disclosedAt)||!Number.isFinite(Date.parse(i.disclosedAt))))errors.push(p+': exact timestamp must include timezone');if(!Array.isArray(i.sources)){errors.push(p+': sources array required');continue;}
 if(i.status!=='unverified'&&!i.sources.length)errors.push(p+': sourced status needs evidence');
 if(i.status==='confirmed'&&!i.sources.some(s=>s.kind==='primary'))errors.push(p+': confirmed needs primary evidence');
 for(const s of i.sources){let url;try{url=new URL(s.url)}catch{}if(url?.protocol!=='https:')errors.push(p+': HTTPS source required');if(!s.label||!['primary','report','post','response'].includes(s.kind))errors.push(p+': source label/kind required');if(s.date!==null&&!date(s.date))errors.push(p+': source date must be ISO or null');}
 }return errors;
}
if(process.argv[1]?.endsWith('validate.mjs')){const errors=validate(JSON.parse(fs.readFileSync(new URL('../data/incidents.json',import.meta.url))));if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('Incident schema valid');}
