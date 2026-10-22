import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {validate} from '../scripts/validate.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/incidents.json',import.meta.url)));
test('incident data follows evidence schema',()=>assert.deepEqual(validate(data),[]));
test('unsourced confirmation rejected',()=>assert.ok(validate({updated:'2026-10-22',incidents:[{id:'test',name:'Test',summary:'Test',status:'confirmed',date:null,dateLabel:'Unknown',category:'Security',sources:[]}]}).length));
test('source URLs cannot execute JavaScript',()=>assert.ok(validate({updated:'2026-10-22',incidents:[{id:'test',name:'Test',summary:'Test',status:'reported',date:null,dateLabel:'Unknown',category:'Security',sources:[{label:'Bad',url:'javascript:alert(1)',kind:'report',date:null}]}]}).length));
