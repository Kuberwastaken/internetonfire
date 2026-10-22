const $ = (selector) => document.querySelector(selector);
const REPO = 'Kuberwastaken/internetonfire';
const labels = {confirmed:'Confirmed',reported:'Reported',disputed:'Disputed',unverified:'Needs evidence'};
let incidents = [];
function el(tag, text, className) { const n=document.createElement(tag); if(text!==undefined)n.textContent=text;if(className)n.className=className;return n; }
export function safeURL(value){try{const u=new URL(value);return u.protocol==='https:' ? u.href : null;}catch{return null;}}
function sourceLink(source) {const a=el('a',source.label+' ↗','source-link');a.href=safeURL(source.url)||'#';if(source.date)a.append(el('small',source.date));if(source.verification==='excerpt'){a.title='Search excerpt checked; full source body not independently read';a.append(el('small','excerpt only'));}return a;}
function row(item) {
 const article=el('article',undefined,'incident');article.id=item.id;
 const header=el('div',undefined,'incident-header'); const title=el('h3');title.append(el('span','>','marker'),document.createTextNode(item.name));header.append(title);
 const date=el(item.date?'time':'span',item.dateLabel || item.date || 'Date not established',item.date?'':'date');if(item.date)date.dateTime=item.date;header.append(date);article.append(header);
 const meta=el('div',undefined,'metadata');meta.append(el('span',labels[item.status],'evidence '+item.status),el('span',item.category));article.append(meta,el('p',item.summary));
 if(item.sources.length){const links=el('div',undefined,'links');item.sources.forEach(s=>links.append(sourceLink(s)));article.append(links);}
 else article.append(el('p','No substantiating source yet. Help verify this claim.','small'));
 if(item.correction){const d=el('details');d.append(el('summary','Context / correction'),el('p',item.correction));article.append(d);}
 return article;
}
function render(){const query=$('#search').value.toLowerCase().trim(),status=$('#status').value;let rows=incidents.filter(i=>(status==='all'||i.status===status)&&[i.name,i.summary,i.category,i.correction].join(' ').toLowerCase().includes(query));rows.sort($('#sort').value==='name'?(a,b)=>a.name.localeCompare(b.name):(a,b)=>(b.date||'').localeCompare(a.date||'')||a.name.localeCompare(b.name));const fragment=document.createDocumentFragment();for(const item of rows)fragment.append(row(item));if(!rows.length)fragment.append(el('p','Nothing matches. Try another name or evidence filter.','empty'));$('#incident-list').replaceChildren(fragment);$('#result-status').textContent=query||status!=='all'?`${rows.length} matching ${rows.length===1?'entry':'entries'}`:'';}
async function load(){try{const r=await fetch('./data/incidents.json');if(!r.ok)throw Error();const data=await r.json();incidents=data.incidents;$('#updated').textContent='Sources checked '+data.updated;render();}catch{$('#incident-list').replaceChildren(el('p','The log could not load. Try reloading, or read the source data linked below.','empty'));$('#updated').textContent='Source index unavailable';}}
['search','status','sort'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',render));
const dialog=$('#submit-dialog');$('#submit').addEventListener('click',()=>dialog.showModal());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
let prLoading=false;
async function loadPRs(){if(prLoading)return;prLoading=true;$('#refresh-prs').disabled=true;try{const response=await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=100`,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw Error(response.status);const issues=await response.json();const prs=issues.filter(p=>p.pull_request);const frag=document.createDocumentFragment();if(!prs.length)frag.append(el('p','No open pull requests right now. The notebook is open.','small'));for(const pr of prs){const box=el('div',undefined,'pr');const left=el('div');const link=el('a',`#${pr.number} ${pr.title}`);link.href=safeURL(pr.html_url)||`https://github.com/${REPO}/pulls`;left.append(link,el('br'),el('small','Opened '+pr.created_at.slice(0,10)+' · review sources before merging'));const votes=el('a',`👍 ${pr.reactions?.['+1']||0}   👎 ${pr.reactions?.['-1']||0} · React on GitHub ↗`,'votes');votes.href=link.href;box.append(left,votes);frag.append(box);}$('#pr-list').replaceChildren(frag);}catch{$('#pr-list').replaceChildren(el('p','Live review list unavailable (GitHub may be rate-limiting). Use “View pull requests” above.','small'));}finally{prLoading=false;$('#refresh-prs').disabled=false;}}
$('#refresh-prs').addEventListener('click',loadPRs);load();loadPRs();
