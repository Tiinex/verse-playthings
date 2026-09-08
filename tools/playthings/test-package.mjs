#!/usr/bin/env node
/** Test the actual distribution boundary, not a source path or workspace symlink.
 * All npm operations are offline and lifecycle scripts are disabled. Never publishes.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const scratch=await fs.mkdtemp(path.join(os.tmpdir(),'playthings-package-'));
const npm=process.platform==='win32'?'npm.cmd':'npm';
const env={...process.env,npm_config_cache:path.join(scratch,'cache'),npm_config_offline:'true',npm_config_audit:'false',npm_config_fund:'false',npm_config_update_notifier:'false'};
function run(command,args,cwd){const result=spawnSync(command,args,{cwd,env,encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024,shell:process.platform==='win32'&&command===npm});if(result.error||result.status!==0)throw new Error(result.error?.message??`${command} failed (${result.status}): ${result.stdout}\n${result.stderr}`);return result.stdout;}
try {
 const pkg=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));
 assert.equal(pkg.name,'@tiinex/playthings');assert.equal(pkg.private,false);assert.equal(pkg.type,'module');
 assert.equal(pkg.publishConfig?.access,'public');assert.equal(pkg.publishConfig?.registry,'https://registry.npmjs.org/');
 assert.equal(pkg.repository?.url,'git+https://github.com/Tiinex/playthings.git');
 assert.equal(pkg.exports['./react'],'./src/verses/playthings/react/index.mjs');
 assert.equal(pkg.exports['./app'],'./src/verses/playthings/app/index.mjs');
 assert.ok(!pkg.dependencies,'Headless runtime has no production dependencies');
 assert.equal(pkg.peerDependencies.react,'19.2.7');
 assert.equal(pkg.peerDependenciesMeta.react.optional,true);
 const browser=JSON.parse(run(process.execPath,['--experimental-vm-modules','tools/playthings/test-browser-boundary.mjs'],root));
 const packed=JSON.parse(run(npm,['pack','--json','--offline','--ignore-scripts','--pack-destination',scratch],root))[0];
 const tar=path.join(scratch,packed.filename);
 assert.ok(packed.files.length>0);
 for(const file of packed.files) {
  assert.ok(!/^\.topics\/|^tools\/|^test\/|^node_modules\/|^reference\//.test(file.path),`Source-only material leaked into npm tarball: ${file.path}`);
  assert.ok(!/\.tgz$|\.zip$/.test(file.path));
 }
 for(const required of ['package.json','LICENSE','NOTICE','README.md',...Object.values(pkg.exports).flatMap(v=>typeof v==='string'?[v]:Object.values(v)).map(v=>v.replace(/^\.\//,''))]) assert.ok(packed.files.some(f=>f.path===required),`Missing packed export/document ${required}`);
 const consumer=path.join(scratch,'consumer');await fs.mkdir(consumer);
 await fs.writeFile(path.join(consumer,'package.json'),JSON.stringify({name:'playthings-offline-consumer',version:'0.0.0',private:true,type:'module'}));
 run(npm,['install',tar,'--offline','--ignore-scripts','--no-audit','--no-fund','--package-lock=false','--legacy-peer-deps'],consumer);
 const installed=path.join(consumer,'node_modules/@tiinex/playthings');
 assert.equal((await fs.lstat(installed)).isSymbolicLink(),false);
 assert.equal(await fs.realpath(installed),installed);
 const program=`
 import assert from 'node:assert/strict';
 import * as engine from '@tiinex/playthings';
 import {createStoryPlan} from '@tiinex/playthings/story';
 import {createNavigationWorld} from '@tiinex/playthings/world';
 import {createScenePlan,createSceneStore} from '@tiinex/playthings/scene';
 import {validateAtlas,compileAtlas} from '@tiinex/playthings/companions';
 import {encodePng,decodePng} from '@tiinex/playthings/node';
 assert.deepEqual(Object.keys(engine).sort(),['companions','observation','scene','story','time','world']);
 const story=createStoryPlan([{id:'root-artifact',parentId:null,historicalTimeMs:0,authors:['A']}]);
 const world=createNavigationWorld({surfaces:[{id:'root',width:4,height:4}]});
 const plan=createScenePlan(story,{world,locations:{'root-artifact':{surfaceId:'root',x:1,y:1}},playback:{endHistoricalMs:0}});
 const store=createSceneStore(plan); assert.equal(store.getSnapshot(),store.getSnapshot());
 assert.equal(store.getSnapshot().actors.length,1);
 const source={width:1,height:1,data:new Uint8Array([19,20,21,255])};
 const compiled=compileAtlas(source,{channel:'props',width:8,height:1,cells:Array.from({length:8},()=>({source:{x:0,y:0,width:1,height:1}}))});
 assert.deepEqual(decodePng(encodePng(compiled)).data,compiled.data);
 assert.equal(validateAtlas({channel:'structure',width:256,height:192}).status,'valid');
 await assert.rejects(()=>import('@tiinex/playthings/src/verses/playthings/runtime/shared/values.mjs'),{code:'ERR_PACKAGE_PATH_NOT_EXPORTED'});
 const adapter=await import('@tiinex/playthings/app'); assert.equal(adapter.createPlaythingsVerse().id,'playthings');
 await assert.rejects(()=>import('@tiinex/playthings/react'),{code:'ERR_MODULE_NOT_FOUND'}); // React is intentionally absent from this headless consumer
 console.log('Installed-package consumer PASS');
 `;
 await fs.writeFile(path.join(consumer,'consumer.mjs'),program);
 const consumerResult=run(process.execPath,['consumer.mjs'],consumer).trim();
 console.log(JSON.stringify({status:'pass',node:process.version,npm:run(npm,['--version'],consumer).trim(),
   package:pkg.name,version:pkg.version,packedFiles:packed.files.length,packedBytes:packed.size,unpackedBytes:packed.unpackedSize,
   browserModuleCount:browser.modules,consumer:consumerResult,symlink:false,network:false,published:false,
   packContainsLineage:false,files:packed.files.map(f=>f.path)},null,2));
}finally{await fs.rm(scratch,{recursive:true,force:true});}
