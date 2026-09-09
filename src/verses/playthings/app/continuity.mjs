import {freeze} from '../runtime/shared/values.mjs';
import {findPath} from '../runtime/world/navigation.mjs';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const index=items=>new Map(items.map(item=>[item.id,item]));
const get=(obj,id)=>Object.hasOwn(obj,id)?obj[id]:undefined;

/** Preserve only compatible presentation state. Never keep removed/changed
 * semantic records or withdrawn capabilities to create apparent continuity.
 * Growth that cannot safely fit is HELD, not silently shuffled or teleported.
 * Explicit user rebuild may start a fresh layout; source truth is unchanged.
 */
export function reconcilePresentationWorld(previous,next,story,metadata,capabilities) {
  if(!previous?.presentationWorld)return {presentation:next,status:'initial',pendingIds:[]};
  const previousRecords=previous.story.records,newRecords=index(story.records);
  const compatible=previousRecords.every(record=>same(record,newRecords.get(record.id))&&
    ['workspaceId','path','schemaId'].every(key=>get(previous.metadata,record.id)?.[key]===get(metadata,record.id)?.[key]));
  if(!compatible)return {presentation:next,status:'reset-source-changed',pendingIds:[]};
  const prior=previous.presentationWorld;
  if(prior.mode==='root-scaffold'&&next.mode==='root-scaffold') {
    const max=Object.keys(next.locations).length,locations=Object.assign(Object.create(null),prior.locations);
    let count=Object.keys(locations).length;
    if(count>max||!same(prior.world.surfaces,next.world.surfaces))return {presentation:next,status:'reset-presentation-budget',pendingIds:[]};
    for(const [id,point] of Object.entries(next.locations))if(count<max&&!Object.hasOwn(locations,id)){locations[id]=point;count++;}
    return {presentation:freeze({...next,locations}),status:'preserved',pendingIds:story.records.filter(record=>!Object.hasOwn(locations,record.id)).map(record=>record.id)};
  }
  if(prior.mode!=='qualified-spatial')return {presentation:next,status:'reset-renderer-changed',pendingIds:[]};
  const oldCaps=previous.spatialCandidate?.capabilities,newCaps=capabilities;
  const newReceipt=new Map((newCaps?.receipts??[]).map(receipt=>[receipt.id,receipt]));
  if(!oldCaps||!newCaps||oldCaps.receipts.some(receipt=>!same(receipt,newReceipt.get(receipt.id))))return {presentation:next,status:'reset-companions-changed',pendingIds:[]};
  const geometries=new Map(next.geometry.map(item=>[item.nodeId,item]));
  const stable=next.mode==='qualified-spatial'&&prior.geometry.every(item=>same(item,geometries.get(item.nodeId)))&&
    Object.values(prior.locations).every(point=>findPath(next.world,point,point).status==='found')&&
    prior.world.links.every(link=>next.world.links.some(candidate=>same(candidate,link)));
  if(stable)return {presentation:freeze({...next,locations:{...next.locations,...prior.locations}}),status:'preserved',pendingIds:[]};
  // Retain exact old geometry only while all semantic inputs/capabilities remain
  // valid. Newly arrived material stays in the truthful story/shelf/inspector.
  const pendingIds=story.records.filter(record=>!Object.hasOwn(prior.locations,record.id)).map(record=>record.id);
  return {presentation:prior,status:'held-growth-conflict',pendingIds};
}
