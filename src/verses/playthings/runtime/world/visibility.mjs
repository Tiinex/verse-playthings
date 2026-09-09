import {freeze,requireFinite} from '../shared/values.mjs';
import {resourceDisclosureState} from '../story/visibility.mjs';
import {createNavigationWorld} from './navigation.mjs';
export const cellIdentity=cell=>JSON.stringify([cell.surfaceId,cell.x,cell.y]);
export const edgeIdentity=(a,b)=>JSON.stringify([cellIdentity(a),cellIdentity(b)].sort());

/** Filter topology BEFORE route planning and rendering. Ownership is emitted by
 * our assembler, never inferred by parsing link ids, surface ids or filenames.
 * The finite outer extent is a presentation reservation, not a future artifact.
 */
export function createWorldVisibilitySampler(presentation,records,{ledger=null,capabilities=null}={}) {
  if(!presentation?.world||!Array.isArray(records))throw new TypeError('Explicit world presentation and story required');
  const geometryById=new Map((presentation.geometry??[]).map(item=>[item.nodeId,item]));
  const receipts=new Map((capabilities?.receipts??[]).map(item=>[item.id,item]));
  let lastKey=null,lastValue=null;
  return historicalTimeMs=>{
    requireFinite(historicalTimeMs,'historicalTimeMs');
    const visible=new Set(records.filter(record=>record.historicalTimeMs<=historicalTimeMs).map(record=>record.id));
    const key=visible.size; // Fixed immutable records: increasing time yields nested prefixes.
    if(key===lastKey)return lastValue;
    const ownership=presentation.topologyOwnership;
    const checked=new Map(),checking=new Set();
    const roots=new Set(Object.entries(ownership?.surfaces??{}).filter(([,ids])=>Array.isArray(ids)&&ids.length===0).map(([id])=>id));
    const eligibleNode=id=>{
      if(roots.has(id))return true;
      if(checked.has(id))return checked.get(id);
      if(!visible.has(id)||checking.has(id))return false;
      checking.add(id);
      const geometry=geometryById.get(id),receipt=receipts.get(id);
      let allowed=!geometry||eligibleNode(geometry.parentSpatialId);
      for(const channel of ['tiles','structure']){
        const entry=receipt?.channels[channel];if(!entry?.active)continue;
        const resources=entry.resources??(entry.resource?[entry.resource]:[]);
        if(!resources.length||resources.some(resource=>['future','unresolved'].includes(resourceDisclosureState(resource,ledger,historicalTimeMs))))allowed=false;
      }
      checking.delete(id);checked.set(id,allowed);return allowed;
    };
    const eligible=ids=>Array.isArray(ids)&&ids.every(eligibleNode);
    // Shared obstacles exist once any qualified owner exists; links require all endpoints/owners.
    const obstacleVisible=ids=>Array.isArray(ids)&&ids.some(eligibleNode);
    const locations=Object.fromEntries(Object.entries(presentation.locations).filter(([id])=>visible.has(id)));
    if(presentation.mode==='root-scaffold')lastValue=freeze({...presentation,locations,geometry:[],visibleArtifactIds:[...visible]});
    else {
      if(!ownership)throw new TypeError('Spatial topology requires explicit presentation ownership');
      const surfaces=presentation.world.surfaces.filter(surface=>eligible(ownership.surfaces[surface.id]));
      const surfaceIds=new Set(surfaces.map(surface=>surface.id));
      const gated=surfaces.map(surface=>({...surface,blocked:surface.blocked.filter(cell=>obstacleVisible(ownership.blocked[cellIdentity({...cell,surfaceId:surface.id})]))}));
      const barriers=presentation.world.barriers.filter(barrier=>surfaceIds.has(barrier.from.surfaceId)&&obstacleVisible(ownership.barriers[edgeIdentity(barrier.from,barrier.to)]));
      const links=presentation.world.links.filter(link=>surfaceIds.has(link.from.surfaceId)&&surfaceIds.has(link.to.surfaceId)&&eligible(ownership.links[link.id]));
      const world=createNavigationWorld({surfaces:gated,barriers,links});
      lastValue=freeze({...presentation,world,locations:Object.fromEntries(Object.entries(locations).filter(([id,point])=>surfaceIds.has(point.surfaceId)&&eligibleNode(presentation.artifactHomes?.[id]??id))),
        geometry:presentation.geometry.filter(item=>eligibleNode(item.nodeId)),surfaceIds:[...surfaceIds],visibleArtifactIds:[...visible]});
    }
    lastKey=key;return lastValue;
  };
}
