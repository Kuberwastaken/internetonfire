import {test} from 'node:test';import assert from 'node:assert/strict';import {timeMatch} from '../time.js';const now=Date.parse('2026-10-22T08:00:00Z');
test('hour exact boundary and future excluded',()=>{assert.equal(timeMatch({disclosedAt:'2026-10-22T07:00:00Z'},'hour',now),'within');assert.equal(timeMatch({disclosedAt:'2026-10-22T06:59:59Z'},'hour',now),'outside');assert.equal(timeMatch({disclosedAt:'2026-10-22T08:00:01Z'},'hour',now),'outside')});
test('date-only never assigned an hour',()=>assert.equal(timeMatch({disclosureDate:'2026-10-22'},'hour',now),'unknown'));
test('date-only overlap labelled possible',()=>assert.equal(timeMatch({disclosureDate:'2026-10-21'},'day',now),'possible'));
test('old and unknown remain separate',()=>{assert.equal(timeMatch({disclosureDate:'2025-10-21'},'month',now),'outside');assert.equal(timeMatch({},'week',now),'unknown');assert.equal(timeMatch({},'all',now),'within')});
