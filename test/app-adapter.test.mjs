import test from 'node:test';import assert from 'node:assert/strict';
import {createTiinexApplicationRuntime} from '@tiinex/app';
import {defineCompanionProvider} from '@tiinex/core';
import {createAppVerseModel,sampleAppVerse,createPlaythingsVerse} from '../src/verses/playthings/app/index.mjs';
import {encodePng} from '../src/verses/playthings/node/index.mjs';
import {inspectPng} from '../src/verses/playthings/runtime/companions/png.inspect.mjs';
const md=(schema,parent='')=>`# Continuity Context\n\n- Envelope Schema: tiinex.root.v1\n${parent?'- Parent\n  - Parent Schema: tiinex.task.v1\n  - Trace: '+parent+'\n':''}- Current\n  - Current Schema: ${schema}\n  - Created At: 2026-09-08 10:00:00\n  - Authors: Anchor\n  - Summary: Test\n\n---\n\n# Test\n`;
const bytes=encodePng({width:1,height:1,data:new Uint8Array([100,120,140,255])});
const world={id:'w',records:[{path:'.topics/root.trace.md',markdown:md('tiinex.task.v1')},{path:'.topics/.relations/child.trace.md',markdown:md('tiinex.relation.v1','../root.trace.md')}],assets:[
 {path:'.topics/.relations/child.playthings.portrait.png',bytes,type:'image/png'},
 {path:'.topics/root.playthings.structure.png',bytes,type:'image/png'},
 {path:'.topics/.relations/child.playthings.tiles.png',bytes,type:'image/png'}
]};
test('real installed App/Core records feed existing story engine without Site imports',()=>{const runtime=createTiinexApplicationRuntime({workspaces:[world]});const m=createAppVerseModel({applicationData:runtime.getSnapshot(),getPlaythingsStoryRecords:runtime.getPlaythingsStoryRecords});assert.equal(m.story.records.length,2);assert.equal(m.story.records.find(r=>r.id.endsWith('child.trace.md')).parentId,'w::.topics/root.trace.md');assert.equal(sampleAppVerse(m,0).snapshot.visibleEventIds.length,2);});
test('empty or missing history is not invented',()=>{const r=createTiinexApplicationRuntime({workspaces:[]});const m=createAppVerseModel({applicationData:r.getSnapshot(),getPlaythingsStoryRecords:r.getPlaythingsStoryRecords});assert.equal(sampleAppVerse(m,0).state,'empty');assert.throws(()=>createAppVerseModel({}),/contract/);});
test('duplicate ids and forged cross-snapshot records fail closed',()=>{const r=createTiinexApplicationRuntime({workspaces:[world]});assert.throws(()=>createAppVerseModel({applicationData:r.getSnapshot(),getPlaythingsStoryRecords:()=>[{id:'forged'}]}),/snapshot-mismatch/);assert.throws(()=>createAppVerseModel({applicationData:r.getSnapshot(),getPlaythingsStoryRecords:()=>Array(10001).fill({})}),/budget/);});
test('artifact-local Relation portrait uses real bytes and Playthings PNG inspection',async()=>{const r=createTiinexApplicationRuntime({workspaces:[world]});const resolution=r.resolveCompanions({namespace:'playthings',slot:'portrait',owner:{kind:'artifact',workspaceId:'w',artifactPath:world.records[1].path}});assert.equal(resolution.status,'resolved');const value=await r.readCompanion(resolution.resources[0]);assert.equal(inspectPng(value.bytes).width,1);r.setWorkspaces([]);await assert.rejects(()=>r.readCompanion(resolution.resources[0]));});
test('package descriptor declares immersive presentation without importing Site/App internals',()=>{const v=createPlaythingsVerse();assert.equal(v.id,'playthings');assert.equal(typeof v.load,'function');assert.equal(v.fullscreen,true);assert.ok(v.capabilities.includes('immersive-presentation'));});
test('workspace updates preserve story model distinction from source truth',()=>{const r=createTiinexApplicationRuntime({workspaces:[world]});const before=r.getSnapshot();r.setWorkspaces([]);assert.equal(before.records.length,2);assert.equal(r.getSnapshot().records.length,0);});

const schemaDefaultProvider=defineCompanionProvider({id:'dynamic-schema-provider',layer:'workspace',resources:[
 {namespace:'playthings',slot:'tiles',owner:{kind:'schema',schemaId:'tiinex.relation.v1'},path:'qualified-schema-assets/relation.playthings.tiles.png'}
]});
test('Playthings accepts an exact schema companion from a dynamically supplied provider without repository assumptions',()=>{
 const dynamicWorld={...world,assets:world.assets.filter(asset=>!asset.path.endsWith('child.playthings.tiles.png'))};
 const r=createTiinexApplicationRuntime({workspaces:[dynamicWorld],companionProviders:[schemaDefaultProvider]});
 const m=createAppVerseModel({applicationData:r.getSnapshot(),getPlaythingsStoryRecords:r.getPlaythingsStoryRecords,resolveCompanions:r.resolveCompanions});
 const child=m.spatialCandidate.capabilities.receipts.find(item=>item.id.endsWith('child.trace.md'));
 assert.equal(child.channels.tiles.active,true);assert.equal(child.channels.tiles.basis,'exact-schema');assert.equal(child.channels.tiles.resource.providerId,'dynamic-schema-provider');
 assert.equal(m.presentationWorld.mode,'qualified-spatial');
});
test('real Core companion specificity activates qualified spatial presentation while preserving Root fallback',()=>{const r=createTiinexApplicationRuntime({workspaces:[world]});const m=createAppVerseModel({applicationData:r.getSnapshot(),getPlaythingsStoryRecords:r.getPlaythingsStoryRecords,resolveCompanions:r.resolveCompanions});assert.equal(m.spatialCandidate.status,'ready');assert.equal(m.spatialCandidate.spatialWorld.geometryQualified,true);assert.ok(m.spatialCandidate.spatialWorld.world.links.some(l=>l.kind==='stairs'));assert.equal(m.rootWorld.kind,'playthings-root-world-scaffold');assert.equal(m.presentationWorld.mode,'qualified-spatial');assert.equal(m.scene.rendererQualified,true);assert.equal(m.scene.rendererMode,'qualified-spatial');});
