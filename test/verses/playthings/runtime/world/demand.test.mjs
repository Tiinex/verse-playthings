import test from 'node:test';
import assert from 'node:assert/strict';
import {classifySpatial,planSpatialDemand} from '../../../../../src/verses/playthings/runtime/world/index.mjs';
const record=(id,parentId,tiles=false,structure=false,extra={})=>({id,parentId,historicalTimeMs:0,capabilities:{tiles,structure},...extra});
const by=(p,id)=>p.nodes.find(n=>n.id===id);
function tavern(){return [record('tavern',null,false,true),record('floor1','tavern',true),record('floor2','tavern',true),record('bar','floor1',false,true),record('side','floor1',false,true),record('kitchen','floor1',false,true),record('201','floor2',false,true),record('202','floor2',false,true),record('tavern-note','tavern',false,false,{displayArea:3}),record('landing-note','floor1',false,false,{displayArea:4}),record('bar-event','bar')];}
const options={historicalTimeMs:0,seed:'world',surfaceOrder:{tavern:['floor1','floor2']}};
test('all 8 switch combinations are disjoint; Props is only a modifier',()=>{
 const types=[];for(const tiles of [false,true])for(const structure of [false,true])for(const props of [false,true]){
  const c=classifySpatial({tiles,structure,props});types.push(c);assert.equal(c.baseType,tiles?(structure?'container':'surface'):(structure?'structure':'non-spatial'));
 }
 assert.equal(types.length,8);assert.throws(()=>classifySpatial({tiles:'true'}));
});
test('generic topic tavern: direct contents stay in owning common zones, not random rooms',()=>{
 const p=planSpatialDemand(tavern(),options);assert.equal(p.status,'ready');
 assert.equal(p.assignments.find(a=>a.artifactId==='tavern-note').spatialHomeId,'tavern');
 assert.equal(p.assignments.find(a=>a.artifactId==='landing-note').spatialHomeId,'floor1');
 assert.equal(p.assignments.find(a=>a.artifactId==='bar-event').spatialHomeId,'bar');
 assert.deepEqual(by(p,'tavern').internalSurfaceOrder,['floor1','floor2']);
 assert.equal(by(p,'tavern').children.length,2);assert.equal(by(p,'floor1').children.length,3);
 assert.equal(p.rootReservations.length,1);assert.equal(p.navigationCompiled,false);
});
test('nested non-spatial topics do not create surfaces or break spatial ancestry',()=>{
 const p=planSpatialDemand([record('house',null,true,true),record('topic','house'),record('event','topic',false,false,{displayArea:6})],{historicalTimeMs:0});
 assert.equal(p.nodes.length,2);assert.equal(by(p,'house').commonDemandArea,6);
 assert.deepEqual(by(p,'house').directArtifactIds,['event','topic']);
});
test('Props resources do not spawn every row or invent occupied physical area',()=>{
 const p=planSpatialDemand([record('p',null,false,false,{capabilities:{props:true}})],{historicalTimeMs:0});
 assert.equal(p.nodes.length,1);assert.equal(p.nodes[0].commonDemandArea,0);assert.equal(p.rootReservations.length,0);
});
test('multiple internal surfaces need an explicit presentation order, not lexicographic floor inference',()=>{
 const p=planSpatialDemand(tavern(),{historicalTimeMs:0});assert.equal(p.status,'partial');
 assert.ok(p.findings.some(f=>f.code==='spatial.surface-order-required'));assert.equal(by(p,'tavern').internalSurfaceOrder,null);
 for(const order of [['floor1'],['floor1','floor1'],['floor1','bar']])assert.throws(()=>planSpatialDemand(tavern(),{...options,surfaceOrder:{tavern:order}}));
});
test('ordering is layout-only and cannot number historical floors semantically',()=>{
 const p=planSpatialDemand(tavern(),options);assert.ok(p.nodes.every(n=>n.levelNumberingIsSemantic===false));
 assert.ok(!JSON.stringify(p).includes('floorNumber'));
});
test('path/filename/author are ignored; input permutation and repeated sampling do not change planning',()=>{
 const a=tavern(),copy=structuredClone(a),p=planSpatialDemand(a,options);
 assert.deepEqual(p,planSpatialDemand([...a].reverse().map(n=>({...n,path:'/moved/'+n.id,authors:['Different']})),options));
 assert.deepEqual(a,copy);assert.ok(Object.isFrozen(p.nodes[0].footprint));
});
test('future records cannot affect current sizes, assignments or pseudorandom choices',()=>{
 const a=tavern();assert.deepEqual(planSpatialDemand(a,options),planSpatialDemand([...a,record('future','tavern',true,true,{historicalTimeMs:1,displayArea:1000})],options));
});
test('missing, future, unknown and cyclic parentage remains unresolved, not Root entry',()=>{
 const p=planSpatialDemand([record('missing','absent',true),record('future-child','future',true),record('future',null,true,false,{historicalTimeMs:1}),record('unknown',undefined,true),record('a','b',true),record('b','a',true)],{historicalTimeMs:0});
 assert.equal(p.nodes.length,1);assert.ok(p.assignments.every(a=>a.status==='unresolved'&&a.spatialHomeId===null));
 for(const code of ['missing-parent','future-parent','unknown-parent','cycle'])assert.ok(p.findings.some(f=>f.code===`spatial.${code}`));
});
test('more direct presentation demand never reduces own common zone budget',()=>{
 const p=planSpatialDemand([record('h',null,true,true)],{historicalTimeMs:0});
 const q=planSpatialDemand([record('h',null,true,true),record('work','h',false,false,{displayArea:200})],{historicalTimeMs:0});
 assert.ok(by(q,'h').minimumCommonArea>by(p,'h').minimumCommonArea);
 assert.ok(by(q,'h').footprint.width*by(q,'h').footprint.height>by(p,'h').footprint.width*by(p,'h').footprint.height);
});
test('root reservations preserve old houses, and growth conflicts are visible',()=>{
 const one=planSpatialDemand([record('h',null,true,true)],{historicalTimeMs:0});
 const two=planSpatialDemand([record('h',null,true,true),record('far',null,true,true)],{historicalTimeMs:1,previousHistoricalTimeMs:0,previousRootPlacements:one.rootReservations});
 assert.deepEqual(two.rootReservations.find(r=>r.id==='h'),one.rootReservations[0]);
 const grown=planSpatialDemand([record('h',null,true,true,{displayArea:1000})],{historicalTimeMs:1,previousHistoricalTimeMs:0,previousRootPlacements:one.rootReservations});
 assert.ok(grown.findings.some(f=>f.code==='growth-needs-repacking'));assert.deepEqual(grown.rootReservations,one.rootReservations);
 assert.throws(()=>planSpatialDemand([],{historicalTimeMs:0,previousHistoricalTimeMs:1,previousRootPlacements:one.rootReservations}));
});
test('invalid budgets, ambiguous identifiers and depth overflow cannot fabricate placements',()=>{
 assert.throws(()=>planSpatialDemand([record('x',null),record('x',null)],{historicalTimeMs:0}));
 assert.throws(()=>planSpatialDemand([record('@playthings:world',null)],{historicalTimeMs:0}));
 assert.throws(()=>planSpatialDemand([record('x',null)],{historicalTimeMs:0,maxNodes:0}));
 const p=planSpatialDemand([record('a',null,true),record('b','a',true),record('c','b',true)],{historicalTimeMs:0,maxDepth:2});
 assert.ok(p.findings.some(f=>f.id==='c'&&f.code==='spatial.depth-budget'));
});
test('aggregate root placement budget produces explicit incompleteness',()=>{
 const p=planSpatialDemand([record('a',null,true,true),record('b',null,true,true)],{historicalTimeMs:0,placement:{maxTotalCandidates:1}});
 assert.equal(p.rootReservations.length,1);assert.equal(p.status,'partial');assert.ok(p.findings.some(f=>f.code==='placement-budget-exceeded'));
});
