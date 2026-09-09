import test from 'node:test';import assert from 'node:assert/strict';
import {defineCompanionProvider,resolveCompanionResources,companionProviderFromWorkspace} from '@tiinex/core';
import {createTiinexApplicationRuntime} from '@tiinex/app';
import {qualifySpatialCapabilities} from '../src/verses/playthings/runtime/world/index.mjs';
import {resolveVisualCompanions} from '../src/verses/playthings/runtime/companions/index.mjs';
import {createAppVerseModel,sampleAppScene} from '../src/verses/playthings/app/index.mjs';
import {encodePng} from '../src/verses/playthings/node/index.mjs';
const owner={kind:'artifact',workspaceId:'w',artifactPath:'artifact.trace.md'};
const query={namespace:'playthings',slot:'portrait',owner,schemaLineage:['custom.leaf','custom.parent','tiinex.root.v1']};
const r=(id,kind='schema',subject='custom.leaf',extra={})=>({namespace:'playthings',slot:'portrait',id,key:id,path:`art/${id}.png`,owner:kind==='artifact'?owner:kind==='schema'?{kind,schemaId:subject}:{kind:'root'},...extra});
const provider=(id,layer,resources,extra={})=>defineCompanionProvider({id,layer,resources,...extra});
const resolve=providers=>resolveCompanionResources({providers,query});
test('specificity dominates even explicitly larger provider precedence',()=>{
 const result=resolve([provider('lower','core',[r('exact')]),provider('high','workspace',[r('generic','root')],{precedence:9999})]);
 assert.equal(result.status,'resolved');assert.equal(result.resources[0].id,'exact');
});
test('exact artifact outranks every schema in arbitrary provider order',()=>{
 const ps=[provider('artifact','core',[r('local','artifact')]),provider('schema','workspace',[r('schema')])];
 assert.equal(resolve(ps).resources[0].id,'local');assert.equal(resolve(ps.reverse()).resources[0].id,'local');
});
test('closest declared schema ancestor beats remote ancestor independent of repository',()=>{
 const result=resolve([provider('any-location','core',[r('near','schema','custom.parent')]),provider('workspace','workspace',[r('far','schema','tiinex.root.v1')])]);
 assert.equal(result.resources[0].id,'near');
});
test('default equal-specificity provider ranks descend workspace/site/verse/app/core',()=>{
 const layers=['workspace','site','verse','app','core'];
 for(let start=0;start<layers.length;start++){const ps=layers.slice(start).map(layer=>provider(layer,layer,[r(layer)]));assert.equal(resolve(ps.reverse()).resources[0].id,layers[start]);}
});
test('equally ranked conflicts fail closed under every iteration order',()=>{
 const a=provider('a','verse',[r('a')]),b=provider('b','verse',[r('b')]);
 for(const ps of [[a,b],[b,a]]){const result=resolve(ps);assert.equal(result.status,'ambiguous');assert.equal(result.resources.length,0);}
});
test('Core collection keys append while same key resolves by specificity then precedence',()=>{
 const prop=(id,key,kind='schema')=>r(id,kind,'custom.leaf',{slot:'props',cardinality:'multiple',key});
 const ps=[provider('defaults','verse',[prop('base','chair'),prop('other','lamp')]),provider('override','site',[prop('site-chair','chair')]),provider('local','core',[prop('exact-chair','chair','artifact')])];
 const result=resolveCompanionResources({providers:ps,query:{...query,slot:'props',cardinality:'multiple'}});
 assert.equal(result.status,'resolved');assert.deepEqual(new Set(result.resources.map(x=>x.id)),new Set(['exact-chair','other']));
 const projected=qualifySpatialCapabilities({records:[{id:'a',parentId:null,historicalTimeMs:0}],metadata:[{id:'a',workspaceId:'w',path:owner.artifactPath,schemaId:'custom.leaf'}],resolveCompanions:q=>q.slot==='props'?result:{status:'missing',resources:[]}});
 assert.equal(projected.status,'ready');assert.equal(projected.records[0].capabilities.props,true);
 assert.equal(projected.records[0].capabilities.tiles,false);assert.equal(projected.receipts[0].channels.props.resources.length,2);
});
test('ambiguous collection key empties the collection instead of partial pretty success',()=>{
 const props=id=>r(id,'schema','custom.leaf',{slot:'props',key:'same',cardinality:'multiple'});
 const result=resolveCompanionResources({providers:[provider('a','site',[props('a')]),provider('b','site',[props('b')])],query:{...query,slot:'props',cardinality:'multiple'}});
 assert.equal(result.status,'ambiguous');assert.deepEqual(result.resources,[]);
});
test('inherited-only props collections cannot activate capability',()=>{
 const result=resolveCompanionResources({providers:[provider('x','workspace',[r('a','root','',{slot:'props',cardinality:'multiple'}),r('b','schema','custom.parent',{slot:'props',cardinality:'multiple'})])],query:{...query,slot:'props',cardinality:'multiple'}});
 const projected=qualifySpatialCapabilities({records:[{id:'a',parentId:null,historicalTimeMs:0}],metadata:[{id:'a',workspaceId:'w',path:owner.artifactPath,schemaId:'custom.leaf'}],resolveCompanions:q=>q.slot==='props'?result:{status:'missing',resources:[]}});
 assert.equal(projected.records[0].capabilities.props,false);
});
test('duplicate indistinguishable registration is deterministic in resolver but host byte ambiguity remains explicit',async()=>{
 const p=provider('same','verse',[r('a')]);assert.equal(resolve([p,p]).resources.length,1);
 const app=createTiinexApplicationRuntime({workspaces:[],companionProviders:[p,p]});
 await assert.rejects(()=>app.readCompanion(p.resources[0]),/ambiguous/);
});
const md=(schema,time='2026-09-08 10:00:00')=>`# Continuity Context\n\n- Envelope Schema: tiinex.root.v1\n- Current\n  - Current Schema: ${schema}\n  - Created At: ${time}\n  - Authors: Anchor\n\n---\n\n# Fixture\n`;
const png=encodePng({width:128,height:16,data:new Uint8Array(128*16*4).fill(255)});
const workspace={id:'w',records:[{path:owner.artifactPath,markdown:md('custom.leaf')}],assets:[]};
const declarations=[{id:'custom.leaf',parentSchemaId:'custom.parent',basis:'fixture-qualified-declaration'},{id:'custom.parent',parentSchemaId:'tiinex.root.v1',basis:'fixture-qualified-declaration'},{id:'tiinex.root.v1',parentSchemaId:null,basis:'fixture-qualified-declaration'}];
test('external schema ancestry and companions work through real App, not Playthings repo paths',async()=>{
 const p=provider('external-schema','workspace',[r('schema-art')]);
 const app=createTiinexApplicationRuntime({workspaces:[workspace],schemaDeclarations:declarations,companionProviders:[p],resourceReaders:{'external-schema':async()=>({bytes:png,mediaType:'image/png'})}});
 const result=app.resolveCompanions({namespace:'playthings',slot:'portrait',owner});assert.equal(result.resources[0].providerId,'external-schema');
 assert.deepEqual(app.schemaAncestry('custom.leaf').lineage,['custom.leaf','custom.parent','tiinex.root.v1']);
 assert.equal((await app.readCompanion(result.resources[0])).bytes.byteLength,png.byteLength);
 const model=createAppVerseModel({applicationData:app.getSnapshot(),getPlaythingsStoryRecords:app.getPlaythingsStoryRecords,resolveCompanions:app.resolveCompanions});
 assert.deepEqual(sampleAppScene(model,model.presentationDurationMs).snapshot.knowledge.schemaIds,[]);
});
test('workspace-local artifact override is withdrawn cleanly when the asset disappears',()=>{
 const app=createTiinexApplicationRuntime({workspaces:[{...workspace,assets:[{path:'artifact.playthings.portrait.png',bytes:png,type:'image/png'}]}],schemaDeclarations:declarations,companionProviders:[provider('defaults','verse',[r('default')])]});
 assert.equal(app.resolveCompanions({namespace:'playthings',slot:'portrait',owner}).resources[0].owner.kind,'artifact');
 app.setWorkspaces([workspace]);assert.equal(app.resolveCompanions({namespace:'playthings',slot:'portrait',owner}).resources[0].id,'default');
});
test('replacement digest causes actual host rejection of stale selection and wrong bytes',async()=>{
 const asset=digest=>({path:'artifact.playthings.portrait.png',bytes:png,type:'image/png',sha256:digest});
 const app=createTiinexApplicationRuntime({workspaces:[{...workspace,assets:[asset('a'.repeat(64))]}]});const selection=app.resolveCompanions({namespace:'playthings',slot:'portrait',owner}).resources[0];
 await assert.rejects(()=>app.readCompanion(selection),/integrity mismatch/);
 app.setWorkspaces([{...workspace,assets:[asset('b'.repeat(64))]}]);await assert.rejects(()=>app.readCompanion(selection),/stale/);
});
test('schema filename by itself never fabricates schema-definition ownership in current host',()=>{
 const result=companionProviderFromWorkspace({id:'schema-workspace',records:[{path:'custom.leaf.schema.md'}],assets:[{path:'custom.leaf.playthings.portrait.png'}]});
 assert.equal(result.provider.resources.length,0); // Known Turn-2 discovery boundary, NOT dynamic schema support acceptance.
});
test('visual adapter consumes Core conflict without bypassing to shadowed defaults',()=>{
 const result=resolve([provider('a','site',[r('a')]),provider('b','site',[r('b')]),provider('fallback','core',[r('c','root')])]);
 const view=resolveVisualCompanions({record:{id:'a',workspaceId:'w',path:owner.artifactPath},channel:'portrait',historicalTimeMs:0,resolveCompanions:()=>result});
 assert.equal(view.status,'ambiguous');assert.deepEqual(view.resources,[]);
});
