export function timeMatch(item,window,now=Date.now()){
 if(window==='all')return 'within';const ms={hour:3600000,day:86400000,week:604800000,month:2592000000}[window];if(!ms)return 'outside';const start=now-ms;
 if(item.disclosedAt){const t=Date.parse(item.disclosedAt);return Number.isFinite(t)&&t>=start&&t<=now?'within':'outside';}
 if(!item.disclosureDate)return 'unknown';
 // A source with no timezone or clock time spans every civil timezone, not a fabricated midnight.
 const lo=Date.parse(item.disclosureDate+'T00:00:00Z')-14*3600000,hi=Date.parse(item.disclosureDate+'T00:00:00Z')+38*3600000;
 if(hi<start||lo>now)return 'outside';if(window==='hour')return 'unknown';return lo>=start&&hi<=now?'within':'possible';
}
