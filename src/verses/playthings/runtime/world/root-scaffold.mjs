import {compareIds,freeze,requireId,requireInteger} from '../shared/values.mjs';
import {variation} from './layout.mjs';
import {createNavigationWorld} from './navigation.mjs';

/**
 * Bounded Root-only presentation scaffold for records that do not yet have a
 * qualified spatial-capability/world compilation. Artifact coordinates are
 * stable presentation choices only: they do not encode Parent, chronology,
 * schema meaning, responsibility or physical source truth.
 *
 * The fixed surface size is deliberate. A future record cannot resize the
 * surface and thereby move an older record. Hash collisions may stack records
 * on one cell; stacking is preferable to fabricating a semantic distinction.
 */
export function createRootWorldScaffold(story,options={}) {
  if(story?.kind!=='playthings-story-plan') throw new TypeError('Use createStoryPlan first');
  const surfaceId=requireId(options.surfaceId??'@playthings:root','surfaceId');
  const size=requireInteger(options.size??31,'size',3);
  const capacity=size*size;
  if(!Number.isSafeInteger(capacity)) throw new RangeError('Root scaffold capacity overflow');
  const maxRecords=requireInteger(options.maxRecords??Math.min(256,capacity),'maxRecords',1);
  if(maxRecords>capacity) throw new RangeError('maxRecords cannot exceed Root scaffold cell capacity');
  const seed=requireId(options.seed??'playthings-root-world','seed');
  const ordered=[...story.records].sort((a,b)=>a.historicalTimeMs-b.historicalTimeMs||compareIds(a.id,b.id));
  const admitted=ordered.slice(0,maxRecords),entries=[],cellOwners=new Map(),findings=[];
  for(const record of admitted) {
    const x=Math.min(size-1,Math.floor(variation(seed,record.id,'root-x')*size));
    const y=Math.min(size-1,Math.floor(variation(seed,record.id,'root-y')*size));
    const cell=`${x},${y}`,owners=cellOwners.get(cell)??[];
    owners.push(record.id);cellOwners.set(cell,owners);
    entries.push([record.id,freeze({surfaceId,x,y})]);
  }
  const collisions=[...cellOwners.entries()].filter(([,owners])=>owners.length>1);
  if(collisions.length) findings.push(freeze({code:'root-scaffold.presentation-collision',severity:'info',
    cellCount:collisions.length,recordCount:collisions.reduce((sum,[,owners])=>sum+owners.length,0),
    boundary:'Shared cells are presentation collisions only; no record is merged semantically.'}));
  if(ordered.length>admitted.length) findings.push(freeze({code:'root-scaffold.record-budget',severity:'warning',
    admitted:admitted.length,omitted:ordered.length-admitted.length,
    boundary:'Omitted records remain semantic story data but have no physical depiction in this bounded scaffold.'}));
  const world=createNavigationWorld({surfaces:[{id:surfaceId,width:size,height:size}]});
  return freeze({kind:'playthings-root-world-scaffold',world,locations:Object.fromEntries(entries),findings,
    surfaceId,size,maxRecords,admittedRecordIds:admitted.map(r=>r.id),
    spatialCapabilitiesApplied:false,geometryQualified:false,
    boundary:'Root-only deterministic presentation scaffold. It is not the spatial companion/world compiler and creates no Tiinex semantic authority.'});
}
