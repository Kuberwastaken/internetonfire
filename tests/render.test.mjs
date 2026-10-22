import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {barsHTML, dayLabel, incidentHTML, listHTML, sortIncidents} from '../render.js';
const base={id:'x',name:'<img src=x onerror=alert(1)>',summary:'"quoted" & <b>',status:'reported',date:'2026-10-20',disclosureDate:'2026-10-21',dateLabel:'Oct 20',category:'test',sources:[{label:'Bad',url:'javascript:alert(1)',kind:'report',date:null}]};
test('data is escaped, never markup',()=>{const html=incidentHTML(base);assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('&quot;quoted&quot; &amp; &lt;b&gt;'))});
test('non-https source links are neutralised',()=>assert.ok(!incidentHTML(base).includes('javascript:')));
test('grouped by disclosure day, newest first',()=>{const html=listHTML(sortIncidents([{...base,id:'a',disclosureDate:'2026-10-01'},{...base,id:'b'}]));assert.ok(html.indexOf('id="b"')<html.indexOf('id="a"'));assert.ok(html.includes(dayLabel('2026-10-21')))});
test('day labels do not drift by timezone',()=>assert.equal(dayLabel('2026-10-21'),'Wed 21 Oct'));
test('bars cover 30 days and count disclosures',()=>{const html=barsHTML([base,{...base,id:'y'}],'2026-10-22');assert.equal((html.match(/class="bar[ "]/g)||[]).length,30);assert.ok(html.includes('Wed 21 Oct: 2 incidents'))});
test('every incident prerenders',()=>{const data=JSON.parse(fs.readFileSync(new URL('../data/incidents.json',import.meta.url)));const html=listHTML(sortIncidents(data.incidents));for(const i of data.incidents)assert.ok(html.includes(`id="${i.id}"`),i.id)});
