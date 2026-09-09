import test from 'node:test';import assert from 'node:assert/strict';
import {createCompanionResourceStore,resolveVisualCompanions,sampleCompanionFrame,validateAtlas} from '../../../../../src/verses/playthings/runtime/companions/index.mjs';
import {encodePng} from '../../../../../src/verses/playthings/node/index.mjs';
import {createVisibilityLedger} from '../../../../../src/verses/playthings/runtime/story/visibility.mjs';
const resource={id:'asset',namespace:'playthings',slot:'portrait',providerId:'workspace:w',path:'asset.png',owner:{kind:'artifact',workspaceId:'w',artifactPath:'a'}};
const bytes=encodePng({width:8,height:1,data:new Uint8Array(32).fill(255)});
const ready=()=>({bytes,mediaType:'image/png'});
const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {resolve,promise};};
const store=(extra={})=>createCompanionResourceStore({readCompanion:async()=>ready(),createObjectURL:()=>`blob:fixture`,revokeObjectURL:()=>{},...extra});
test('shared reads, lease lifetime and URL revocation',async()=>{let reads=0,revokes=0;const s=store({readCompanion:async()=>{reads++;return ready();},revokeObjectURL:()=>revokes++});const a=s.acquire(resource,'portrait'),b=s.acquire(resource,'portrait');assert.equal((await a.promise).status,'ready');assert.equal((await b.promise).url,'blob:fixture');assert.equal(reads,1);a.release();assert.equal(revokes,0);b.release();s.dispose();assert.equal(revokes,1);assert.equal(s.stats().retainedBytes,0);});
test('aborted stale readers cannot publish a URL after snapshot disposal',async()=>{const pending=defer();let urls=0;const s=store({readCompanion:()=>pending.promise,createObjectURL:()=>{urls++;return 'blob:stale';}});const lease=s.acquire(resource,'portrait');s.dispose();pending.resolve(ready());assert.equal((await lease.promise).status,'cancelled');await new Promise(r=>setTimeout(r,0));assert.equal(urls,0);});
test('bounded concurrency queues and cancelled queued leases are never loaded',async()=>{const pending=defer();let reads=0;const s=store({maxConcurrent:1,readCompanion:()=>{reads++;return pending.promise;}});const a=s.acquire(resource,'portrait');const b=s.acquire({...resource,id:'other'},'portrait');b.release();assert.equal((await b.promise).status,'cancelled');pending.resolve(ready());await a.promise;assert.equal(reads,1);s.dispose();});
test('full active entry budget reports degradation rather than evicting in-use URLs',async()=>{const s=store({maxEntries:1});const a=s.acquire(resource,'portrait');await a.promise;const b=s.acquire({...resource,id:'other'},'portrait');assert.equal((await b.promise).status,'budget');s.dispose();});
test('memory budget accounts decoded RGBA pixels',async()=>{const s=store({maxBytes:bytes.byteLength+31});const a=s.acquire(resource,'portrait');assert.equal((await a.promise).status,'unavailable');assert.match((await a.promise).reason,/memory-budget/);s.dispose();});
test('bad MIME, PNG CRC and atlas strip geometry all fail closed',async()=>{
 for(const response of [{bytes,mediaType:'image/svg+xml'},{bytes:Uint8Array.of(1,2,3),mediaType:'image/png'},{bytes:encodePng({width:1,height:1,data:new Uint8Array(4)}),mediaType:'image/png'}]){
  const s=store({readCompanion:async()=>response});assert.equal((await s.acquire(resource,'portrait').promise).status,'unavailable');s.dispose();
 }
});
test('store validates slot and does not mutate/freeze resolver objects',async()=>{const s=store();assert.throws(()=>s.acquire({...resource,slot:'tiles'},'portrait'));await s.acquire(resource,'portrait').promise;assert.equal(Object.isFrozen(resource.owner),false);s.dispose();});
test('resource revision identity changes do not reuse prior bytes',async()=>{let reads=0;const s=store({readCompanion:async()=>{reads++;return ready();}});const a=s.acquire(resource,'portrait');await a.promise;a.release();await s.acquire({...resource,sha256:'new'},'portrait').promise;assert.equal(reads,2);s.dispose();});
const record={id:'a',workspaceId:'w',path:'a'};
test('ambiguity never falls back to a pretty lower-ranked resource',()=>{let calls=0;const r=resolveVisualCompanions({record,channel:'portrait',historicalTimeMs:0,resolveCompanions:()=>{calls++;return {status:'ambiguous',resources:[],candidates:[resource]};}});assert.equal(r.status,'ambiguous');assert.equal(r.resources.length,0);assert.equal(calls,1);});
test('collection winners remain host ordered and distinct, without a local resolver',()=>{const rs=[{...resource,key:'a',cardinality:'multiple'},{...resource,id:'b',key:'b',cardinality:'multiple'}];const r=resolveVisualCompanions({record,channel:'portrait',historicalTimeMs:0,resolveCompanions:()=>({status:'resolved',resources:rs})});assert.deepEqual(r.resources.map(x=>x.id),['asset','b']);});
test('single slot multiple winners are rejected',()=>{const r=resolveVisualCompanions({record,channel:'portrait',historicalTimeMs:0,resolveCompanions:()=>({status:'resolved',resources:[resource,{...resource,id:'b'}]})});assert.equal(r.status,'ambiguous');});
test('future artifact does not even query the resolver',()=>{let calls=0;const ledger=createVisibilityLedger({records:[{id:'a',historicalTimeMs:10}],metadata:[record]});const r=resolveVisualCompanions({record,channel:'portrait',historicalTimeMs:0,ledger,resolveCompanions:()=>{calls++;return {status:'resolved',resources:[resource]};}});assert.equal(r.status,'hidden');assert.equal(calls,0);});
for(const channel of ['character','verb','blueprint','portrait','tiles','structure','props'])test(`candidate ${channel} frame has bounded exact crop`,()=>{
 const sizes={character:[1024,1536],tiles:[256,64],structure:[256,192],verb:[64,20],blueprint:[64,8],portrait:[64,8],props:[64,16]};const [width,height]=sizes[channel];const layout=validateAtlas({channel,width,height});const frame=sampleCompanionFrame(layout,{actionStatus:'occurred',elapsedMs:777});assert.equal(frame.status,'ready');assert.ok(frame.x+frame.width<=width&&frame.y+frame.height<=height);assert.equal(frame.semanticPixelsQualified,false);
});
test('verb is suppressed for unknown/planned/cancelled occurrence',()=>{const layout=validateAtlas({channel:'verb',width:64,height:20});for(const actionStatus of ['unknown','planned','cancelled'])assert.equal(sampleCompanionFrame(layout,{actionStatus}).status,'suppressed');});
test('portrait crops one cell rather than compressing the eight-frame sheet',()=>{const f=sampleCompanionFrame(validateAtlas({channel:'portrait',width:512,height:64}),{mode:'ghost'});assert.equal(f.width,64);assert.equal(f.x,192);assert.equal(f.role,'dormant');});
test('reduced motion gives a stable walking frame across elapsed times',()=>{const l=validateAtlas({channel:'character',width:1024,height:1536});assert.deepEqual(sampleCompanionFrame(l,{phase:'walk',reducedMotion:true,elapsedMs:0}),sampleCompanionFrame(l,{phase:'walk',reducedMotion:true,elapsedMs:5000}));});
test('detached nested provider source data cannot freeze caller-owned inputs',()=>{
 const nested={transport:{name:'example'}},res={...resource,source:nested};
 const result=resolveVisualCompanions({record,channel:'portrait',historicalTimeMs:0,resolveCompanions:()=>({status:'resolved',resources:[res]})});
 assert.equal(result.status,'resolved');assert.equal(Object.isFrozen(nested.transport),false);assert.notEqual(result.resources[0].source,nested);
});
test('ambiguous Workspace owner identity cannot disclose arbitrary first metadata match',()=>{
 const ledger=createVisibilityLedger({records:[{id:'early',historicalTimeMs:0},{id:'late',historicalTimeMs:100}],metadata:[{id:'early',workspaceId:'w',path:'a'},{id:'late',workspaceId:'w',path:'a'}]});
 const result=resolveVisualCompanions({record:{id:'early',workspaceId:'w',path:'a'},channel:'portrait',historicalTimeMs:0,ledger,resolveCompanions:()=>({status:'resolved',resources:[resource]})});
 assert.equal(result.status,'hidden');
});
test('rapidly cancelled queued leases do not retain an unbounded queue behind a slow reader',async()=>{
 const pending=defer(),s=store({maxConcurrent:1,readCompanion:()=>pending.promise}),first=s.acquire(resource,'portrait');
 for(let i=0;i<1000;i++){const lease=s.acquire({...resource,id:`queued-${i}`},'portrait');lease.release();}
 assert.equal(s.stats().queuedSlots,0);assert.equal(s.stats().entries,1);
 pending.resolve(ready());await first.promise;first.release();s.dispose();
});
