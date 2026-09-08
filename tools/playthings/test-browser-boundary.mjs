#!/usr/bin/env node
// Executed with --experimental-vm-modules by the package qualification script.
// This is a browser-like module graph test, not an actual browser/UI acceptance test.
import {SourceTextModule,createContext} from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const context=createContext({TextEncoder,TextDecoder,structuredClone}); // deliberately no process, Buffer, DOM or require
const cache=new Map();
async function load(filename) {
  if(!cache.has(filename)) cache.set(filename,(async()=>{
    assert.ok(filename.startsWith(path.join(root,'src/verses/playthings')+path.sep));
    return new SourceTextModule(await fs.readFile(filename,'utf8'),{context,identifier:filename,
      importModuleDynamically(){throw new Error('Dynamic host import not allowed in browser-boundary fixture');}});
  })());
  return cache.get(filename);
}
const main=await load(path.join(root,'src/verses/playthings/index.mjs'));
await main.link((specifier,ref)=>{
  assert.ok(specifier.startsWith('.'),`Unexpected host dependency: ${specifier}`);
  return load(path.resolve(path.dirname(ref.identifier),specifier));
});
await main.evaluate();
const api=main.namespace;
assert.equal(api.companions.validateAtlas({channel:'tiles',width:256,height:64}).status,'valid');
assert.equal(api.world.classifySpatial({tiles:true,structure:true}).baseType,'container');
assert.equal(api.scene.daylightAt(0).light,.3);
assert.equal(api.story.createStoryPlan([]).kind,'playthings-story-plan');
const graph=api.world.createNavigationWorld({surfaces:[{id:'s',width:2,height:1}]});
const plan=api.scene.createScenePlan(api.story.createStoryPlan([{id:'p',parentId:null,historicalTimeMs:0,authors:['A']}]),{world:graph,locations:{p:{surfaceId:'s',x:0,y:0}},playback:{endHistoricalMs:0}});
assert.equal(api.scene.createSceneStore(plan).getSnapshot().actors.length,1);
console.log(JSON.stringify({status:'pass',modules:cache.size,hostGlobalsProvided:false,browserRendered:false}));
