import test from 'node:test';
import assert from 'node:assert/strict';
import {createStoryPlan} from '../../../../../src/verses/playthings/runtime/story/index.mjs';
import {createRootWorldScaffold,findPath} from '../../../../../src/verses/playthings/runtime/world/index.mjs';

const story=records=>createStoryPlan(records);
const record=(id,time,parentId=null)=>({id,parentId,historicalTimeMs:time,authors:['A']});

test('Root scaffold is deterministic and input-order independent',()=>{
 const records=[record('b',1,'a'),record('a',0),record('c',1,'a')];
 const a=createRootWorldScaffold(story(records)),b=createRootWorldScaffold(story([...records].reverse()));
 assert.deepEqual(a,b);assert.equal(a.spatialCapabilitiesApplied,false);assert.equal(a.geometryQualified,false);
});

test('later history cannot move already placed Root scaffold records',()=>{
 const early=story([record('a',0),record('b',1,'a')]);
 const later=story([record('a',0),record('b',1,'a'),record('c',2,'b')]);
 const a=createRootWorldScaffold(early),b=createRootWorldScaffold(later);
 assert.deepEqual(a.locations.a,b.locations.a);assert.deepEqual(a.locations.b,b.locations.b);
});

test('hash collisions stack instead of inventing semantic separation',()=>{
 const records=Array.from({length:8},(_,i)=>record(`r${i}`,i));
 const p=createRootWorldScaffold(story(records),{size:3,maxRecords:8,seed:'collision-fixture'});
 const cells=new Map();for(const [id,point] of Object.entries(p.locations)){const key=`${point.x},${point.y}`;cells.set(key,[...(cells.get(key)||[]),id]);}
 assert.ok([...cells.values()].some(ids=>ids.length>1));
 assert.ok(p.findings.some(f=>f.code==='root-scaffold.presentation-collision'));
});

test('record budget leaves semantic records unplaced rather than spawning at origin',()=>{
 const records=Array.from({length:5},(_,i)=>record(`r${i}`,i));
 const p=createRootWorldScaffold(story(records),{size:3,maxRecords:3});
 assert.equal(Object.keys(p.locations).length,3);assert.equal(p.admittedRecordIds.length,3);
 assert.ok(p.findings.some(f=>f.code==='root-scaffold.record-budget'&&f.omitted===2));
 assert.equal(p.locations.r4,undefined);
});

test('admitted locations are real walkable points in the shared navigation engine',()=>{
 const p=createRootWorldScaffold(story([record('a',0),record('b',1,'a')]));
 const route=findPath(p.world,p.locations.a,p.locations.b);
 assert.equal(route.status,'found');assert.equal(route.nodes[0].surfaceId,p.surfaceId);
});

test('prototype-looking ids remain ordinary location keys',()=>{
 const p=createRootWorldScaffold(story([record('__proto__',0)]));
 assert.deepEqual(p.locations['__proto__'].surfaceId,p.surfaceId);
 assert.ok(Object.hasOwn(p.locations,'__proto__'));
});
