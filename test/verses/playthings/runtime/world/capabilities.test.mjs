import test from 'node:test';
import assert from 'node:assert/strict';
import {createCompanionSpatialWorld,createPresentationSurfaceOrder,planCompanionSpatialDemand,qualifySpatialCapabilities} from '../../../../../src/verses/playthings/runtime/world/index.mjs';

const records=[
 {id:'w::house',parentId:null,historicalTimeMs:0},
 {id:'w::floor-b',parentId:'w::house',historicalTimeMs:1},
 {id:'w::floor-a',parentId:'w::house',historicalTimeMs:1},
 {id:'w::note',parentId:'w::house',historicalTimeMs:2},
];
const metadata=Object.fromEntries(records.map((r,i)=>[r.id,{id:r.id,workspaceId:'w',path:r.id.slice(3),schemaId:i===0?'tiinex.topic.v1':'tiinex.task.v1'}]));
const resource=(slot,owner,extra={})=>({namespace:'playthings',slot,id:`r:${slot}`,path:`x.playthings.${slot}.png`,providerId:'fixture',owner,...extra});
function resolver(query){
 if(query.owner.artifactPath==='house'&&query.slot==='structure')return {status:'resolved',resources:[resource('structure',{kind:'artifact',workspaceId:'w',artifactPath:'house'})]};
 if(query.owner.artifactPath.startsWith('floor-')&&query.slot==='tiles')return {status:'resolved',resources:[resource('tiles',{kind:'schema',schemaId:'tiinex.task.v1'})]};
 if(query.owner.artifactPath==='note'&&query.slot==='props')return {status:'resolved',resources:[resource('props',{kind:'root'})]};
 return {status:'missing',resources:[]};
}

test('only exact artifact and exact schema winners activate spatial capability',()=>{
 const p=qualifySpatialCapabilities({records,metadata,resolveCompanions:resolver});
 assert.equal(p.status,'ready');
 assert.deepEqual(p.records.find(r=>r.id==='w::house').capabilities,{tiles:false,structure:true,props:false});
 assert.deepEqual(p.records.find(r=>r.id==='w::floor-a').capabilities,{tiles:true,structure:false,props:false});
 assert.equal(p.records.find(r=>r.id==='w::note').capabilities.props,false);
 assert.ok(p.findings.some(f=>f.id==='w::note'&&f.code==='spatial-capability.fallback-does-not-activate'));
});

test('ambiguous/blocked resolver output fails capability qualification closed',()=>{
 const p=qualifySpatialCapabilities({records:[records[0]],metadata,resolveCompanions:q=>q.slot==='tiles'?{status:'ambiguous',resources:[]}:{status:'missing',resources:[]}});
 assert.equal(p.status,'blocked');assert.ok(p.findings.some(f=>f.code==='spatial-capability.ambiguous'));
});

test('exact owner metadata is required and resolver errors stay visible',()=>{
 assert.equal(qualifySpatialCapabilities({records:[records[0]],metadata:{},resolveCompanions:resolver}).status,'blocked');
 const p=qualifySpatialCapabilities({records:[records[0]],metadata,resolveCompanions:()=>{throw Error('boom');}});
 assert.equal(p.status,'blocked');assert.ok(p.findings.some(f=>f.code==='spatial-capability.resolver-threw'));
});

test('surface ordering is deterministic presentation policy, not lexicographic floor numbering',()=>{
 const projection=qualifySpatialCapabilities({records,metadata,resolveCompanions:resolver});
 const a=createPresentationSurfaceOrder(projection.records,{seed:'fixture'}),b=createPresentationSurfaceOrder([...projection.records].reverse(),{seed:'fixture'});
 assert.deepEqual(a,b);assert.equal(a.levelNumberingIsSemantic,false);
 assert.deepEqual(new Set(a.surfaceOrder['w::house']),new Set(['w::floor-a','w::floor-b']));
});

test('qualified companions feed recursive demand without fallback capability leakage',()=>{
 const p=planCompanionSpatialDemand({records,metadata,resolveCompanions:resolver},{historicalTimeMs:2,seed:'fixture'});
 assert.equal(p.status,'ready');
 assert.equal(p.demand.nodes.find(n=>n.id==='w::house').capabilities.structure,true);
 assert.deepEqual(new Set(p.demand.nodes.find(n=>n.id==='w::house').internalSurfaceOrder),new Set(['w::floor-a','w::floor-b']));
 assert.equal(p.demand.nodes.some(n=>n.id==='w::note'),false);
});

test('qualified companion chain can compile navigation geometry without reading pixels',()=>{
 const p=createCompanionSpatialWorld({records,metadata,resolveCompanions:resolver},{historicalTimeMs:2,seed:'fixture'});
 assert.equal(p.status,'ready');assert.equal(p.spatialWorld.geometryQualified,true);assert.equal(p.spatialWorld.navigationCompiled,true);
 assert.ok(p.spatialWorld.world.links.some(link=>link.kind==='stairs'));
});


test('exact schema capability is source-neutral and may come from a dynamically supplied provider',()=>{
 const external=(query)=>query.owner.artifactPath==='floor-a'&&query.slot==='tiles'?{status:'resolved',resources:[resource('tiles',{kind:'schema',schemaId:'tiinex.task.v1'},{providerId:'workspace-or-remote-schema-provider'})]}:{status:'missing',resources:[]};
 const p=qualifySpatialCapabilities({records:[records[2]],metadata,resolveCompanions:external});
 assert.equal(p.status,'ready');assert.equal(p.records[0].capabilities.tiles,true);assert.equal(p.receipts[0].channels.tiles.basis,'exact-schema');
 assert.equal(p.receipts[0].channels.tiles.resource.providerId,'workspace-or-remote-schema-provider');
});
