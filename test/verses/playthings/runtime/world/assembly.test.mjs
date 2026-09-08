import test from 'node:test';
import assert from 'node:assert/strict';
import {assembleSpatialWorld,findPath,planSpatialDemand,withLinkState} from '../../../../../src/verses/playthings/runtime/world/index.mjs';

const record=(id,parentId,tiles=false,structure=false,extra={})=>({id,parentId,historicalTimeMs:0,capabilities:{tiles,structure},...extra});
function tavern(){return [
 record('tavern',null,false,true),record('floor1','tavern',true),record('floor2','tavern',true),
 record('bar','floor1',false,true),record('side','floor1',false,true),record('kitchen','floor1',false,true),
 record('201','floor2',false,true),record('202','floor2',false,true),
 record('tavern-note','tavern',false,false,{displayArea:3}),record('landing-note','floor1',false,false,{displayArea:4}),record('bar-event','bar')
];}
const demand=()=>planSpatialDemand(tavern(),{historicalTimeMs:0,seed:'fixture',surfaceOrder:{tavern:['floor1','floor2']}});

test('ready demand compiles rectangular Root/level geometry with doors, barriers and stairs',()=>{
 const world=assembleSpatialWorld(demand(),{seed:'fixture',capabilitiesQualified:true});
 assert.equal(world.status,'ready');assert.equal(world.geometryQualified,true);assert.equal(world.navigationCompiled,true);
 assert.deepEqual(new Set(world.world.surfaces.map(s=>s.id)),new Set(['@playthings:world','floor1','floor2']));
 assert.ok(world.world.barriers.length>0);assert.ok(world.world.links.some(l=>l.id==='door:tavern'));
 assert.deepEqual(world.world.links.filter(l=>l.kind==='stairs').map(l=>l.id),['stairs:tavern:floor1','stairs:tavern:floor2']);
 assert.equal(findPath(world.world,world.locations['tavern-note'],world.locations['bar-event']).status,'found');
});

test('structure barriers make the generated door actual topology, not decoration',()=>{
 const built=assembleSpatialWorld(demand(),{seed:'fixture',capabilitiesQualified:true});
 assert.equal(findPath(built.world,built.locations['landing-note'],built.locations['bar-event']).status,'found');
 const closed=withLinkState(built.world,'door:bar',false);
 assert.equal(findPath(closed,built.locations['landing-note'],built.locations['bar-event']).status,'unreachable');
});

test('container occupies its containing surface and connects to a distinct walkable interior',()=>{
 const d=planSpatialDemand([record('house',null,true,true),record('note','house')],{historicalTimeMs:0,seed:'fixture'});
 const built=assembleSpatialWorld(d,{seed:'fixture',capabilitiesQualified:true});
 assert.equal(built.status,'ready');
 const root=built.world.surfaces.find(s=>s.id==='@playthings:world'),inside=built.world.surfaces.find(s=>s.id==='house');
 assert.ok(root.blocked.length>0);assert.ok(inside);assert.equal(built.locations.note.surfaceId,'house');
 assert.ok(built.world.links.some(l=>l.id==='door:house'&&l.kind==='door'));
 assert.ok(built.world.links.some(l=>l.id==='passage:house'&&l.kind==='passage'));
});

test('later nested history does not move an earlier enclosure or its usable entry when the surface grows',()=>{
 const early=planSpatialDemand([record('surface',null,true),record('z-old','surface',false,true,{historicalTimeMs:0})],{historicalTimeMs:0,seed:'fixture'});
 const later=planSpatialDemand([record('surface',null,true),record('z-old','surface',false,true,{historicalTimeMs:0}),record('a-later','surface',false,true,{historicalTimeMs:1})],{historicalTimeMs:1,seed:'fixture'});
 const a=assembleSpatialWorld(early,{seed:'fixture',capabilitiesQualified:true}),b=assembleSpatialWorld(later,{seed:'fixture',capabilitiesQualified:true});
 const oldA=a.geometry.find(g=>g.nodeId==='z-old'),oldB=b.geometry.find(g=>g.nodeId==='z-old');
 assert.deepEqual(oldB.outerRect,oldA.outerRect);assert.deepEqual(oldB.entry,oldA.entry);
 assert.ok(b.world.surfaces.find(s=>s.id==='surface').width>a.world.surfaces.find(s=>s.id==='surface').width);
});

test('partial demand and missing capability provenance cannot claim qualified geometry',()=>{
 const partial=planSpatialDemand(tavern(),{historicalTimeMs:0,seed:'fixture'});
 assert.equal(assembleSpatialWorld(partial,{seed:'fixture',capabilitiesQualified:true}).status,'blocked');
 const built=assembleSpatialWorld(demand(),{seed:'fixture'});assert.equal(built.status,'ready');assert.equal(built.geometryQualified,false);assert.equal(built.spatialCapabilitiesApplied,false);
});
