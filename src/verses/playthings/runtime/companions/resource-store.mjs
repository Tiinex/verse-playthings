import {requireInteger} from '../shared/values.mjs';
import {inspectPng} from './png.inspect.mjs';
import {validateAtlas,COMPANION_CHANNELS} from './atlas.profile.mjs';

/** One store per immutable host snapshot/resource revision. It shares leases,
 * limits reads/memory and revokes URLs; it NEVER selects a resource winner.
 * Metadata without bytes or a valid atlas remains a visible degraded state.
 */
export function createCompanionResourceStore(options={}) {
  if(typeof options.readCompanion!=='function')throw new TypeError('Host readCompanion is required');
  const createURL=options.createObjectURL??(blob=>URL.createObjectURL(blob));
  const revokeURL=options.revokeObjectURL??(url=>URL.revokeObjectURL(url));
  const maxEntries=requireInteger(options.maxEntries??48,'maxEntries',1);
  const maxBytes=requireInteger(options.maxBytes??32*1024*1024,'maxBytes',1);
  const maxResourceBytes=requireInteger(options.maxResourceBytes??8*1024*1024,'maxResourceBytes',1);
  const maxPixels=requireInteger(options.maxPixels??4_194_304,'maxPixels',1);
  const concurrency=requireInteger(options.maxConcurrent??4,'maxConcurrent',1);
  const entries=new Map(),queue=[];let disposed=false,active=0,bytesHeld=0,sequence=0;
  const result=(status,reason)=>Object.freeze({status,reason,url:'',layout:null});
  function remove(entry) {
    if(entries.get(entry.key)!==entry)return;
    entries.delete(entry.key);entry.controller.abort();
    const queuedIndex=queue.indexOf(entry);if(queuedIndex!==-1)queue.splice(queuedIndex,1);
    if(entry.url)revokeURL(entry.url);
    bytesHeld-=entry.bytes;entry.bytes=0;entry.url='';
    if(!entry.settled){entry.settled=true;entry.resolve(result('cancelled','resource-released'));}
  }
  function prune(requiredBytes=0,requiredEntries=0) {
    for(const entry of [...entries.values()].filter(item=>item.refs===0).sort((a,b)=>a.lastUsed-b.lastUsed)) {
      if(entries.size+requiredEntries<=maxEntries&&bytesHeld+requiredBytes<=maxBytes)break;
      remove(entry);
    }
    return entries.size+requiredEntries<=maxEntries&&bytesHeld+requiredBytes<=maxBytes;
  }
  async function load(entry) {
    active++;
    try {
      const response=await options.readCompanion(entry.resource,{signal:entry.controller.signal,maxBytes:maxResourceBytes});
      entry.controller.signal.throwIfAborted();
      if(disposed||entries.get(entry.key)!==entry)throw new Error('stale-resource');
      if(response?.mediaType!=='image/png')throw new TypeError('companion-not-png');
      const header=inspectPng(response.bytes,{maxBytes:maxResourceBytes,maxPixels});
      const layout=validateAtlas({channel:entry.channel,width:header.width,height:header.height},{maxPixels});
      if(layout.status!=='valid')throw new TypeError('companion-atlas-geometry');
      // Account decoded RGBA memory, not merely small compressed PNG bytes.
      const retainedBytes=response.bytes.byteLength+header.width*header.height*4;
      if(!prune(retainedBytes,0))throw new RangeError('companion-store-memory-budget');
      entry.bytes=retainedBytes;bytesHeld+=retainedBytes;
      const blob=new Blob([response.bytes],{type:'image/png'});
      if(options.decodeImage)await options.decodeImage(blob,{signal:entry.controller.signal});
      entry.controller.signal.throwIfAborted();
      if(disposed||entries.get(entry.key)!==entry)throw new Error('stale-resource');
      entry.url=createURL(blob);entry.settled=true;entry.status='ready';
      entry.resolve(Object.freeze({status:'ready',url:entry.url,layout,containerIntegrity:'verified',
        pixelsDecoded:Boolean(options.decodeImage),semanticPixelsQualified:false}));
    } catch(error) {
      entry.status=entry.controller.signal.aborted?'cancelled':'unavailable';
      if(entry.bytes){bytesHeld-=entry.bytes;entry.bytes=0;}
      if(!entry.settled){entry.settled=true;entry.resolve(result(entry.controller.signal.aborted?'cancelled':'unavailable',String(error?.message||error)));}
    } finally {active--;pump();}
  }
  function pump() {
    while(!disposed&&active<concurrency&&queue.length){const entry=queue.shift();if(!entry.settled&&entries.get(entry.key)===entry&&entry.refs>0)void load(entry);}
  }
  return Object.freeze({
    acquire(resource,channel) {
      if(disposed)throw new Error('Companion store is disposed');
      if(!COMPANION_CHANNELS.includes(channel)||resource?.namespace!=='playthings'||resource?.slot!==channel||!resource?.providerId)throw new TypeError('Exact resolved Playthings resource required');
      const key=JSON.stringify([channel,resource.providerId,resource.id,resource.path,resource.url,resource.sha256,resource.owner]);
      let entry=entries.get(key);
      if(!entry) {
        if(!prune(0,1))return Object.freeze({promise:Promise.resolve(result('budget','companion-store-entry-budget')),release(){}});
        let resolve;const promise=new Promise(yes=>{resolve=yes;});
        // Caller-owned objects are neither frozen nor retained by reference.
        entry={key,channel,resource:structuredClone(resource),status:'loading',promise,resolve,controller:new AbortController(),refs:0,bytes:0,url:'',settled:false,lastUsed:0};
        entries.set(key,entry);queue.push(entry);
      }
      entry.refs++;entry.lastUsed=++sequence;let released=false;pump();
      return Object.freeze({promise:entry.promise,release(){if(released)return;released=true;entry.refs--;entry.lastUsed=++sequence;if(entry.refs===0&&!entry.settled)remove(entry);prune();}});
    },
    stats:()=>Object.freeze({entries:entries.size,activeReads:active,queuedReads:queue.filter(entry=>!entry.settled).length,queuedSlots:queue.length,retainedBytes:bytesHeld,unavailableEntries:[...entries.values()].filter(entry=>entry.status==='unavailable').length,disposed}),
    dispose(){if(disposed)return;disposed=true;for(const entry of [...entries.values()])remove(entry);queue.length=0;},
  });
}
