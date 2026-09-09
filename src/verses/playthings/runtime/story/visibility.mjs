import {compareIds,freeze,requireFinite,requireId} from '../shared/values.mjs';

/** Playthings-only disclosure ledger. Bindings must be supplied by a qualified
 * host projection; these arguments are NOT new Tiinex fields or a Core API.
 * A schema reference on a normal artifact never introduces that schema.
 */
export function createVisibilityLedger({records,metadata=[],introductions=[]}={}) {
  if(!Array.isArray(records)||!Array.isArray(metadata)||!Array.isArray(introductions))throw new TypeError('Visibility inputs must be arrays');
  const owners=new Map(),events=new Map(),subjects=new Map(),findings=[];
  for(const record of metadata) {
    const id=requireId(record?.id);
    if(owners.has(id))throw new TypeError('Duplicate visibility metadata identity');
    owners.set(id,record);
  }
  for(const record of records) {
    const id=requireId(record?.id),time=requireFinite(record.historicalTimeMs,'historicalTimeMs');
    if(events.has(id))throw new TypeError('Duplicate visibility story identity');
    const owner=owners.get(id);
    // No filename suffix, schema id or runtime registry membership is consulted.
    if(!owner?.workspaceId||!owner?.path){findings.push({code:'visibility.workspace-owner-unavailable',id});continue;}
    events.set(id,{id,historicalTimeMs:time,workspaceId:owner.workspaceId,artifactPath:owner.path});
  }
  for(const binding of introductions) {
    if(binding?.state!=='qualified'||!['schema','identity'].includes(binding?.kind)||typeof binding?.subjectId!=='string'||!binding.subjectId.trim()) {
      findings.push({code:'visibility.introduction-unqualified'});continue;
    }
    const key=JSON.stringify([binding.kind,binding.subjectId]),event=events.get(binding.artifactId);
    const current=subjects.get(key);
    if(!event){subjects.set(key,{kind:binding.kind,subjectId:binding.subjectId,state:'unresolved'});findings.push({code:'visibility.introduction-not-in-story',id:binding.artifactId});continue;}
    if(current&&(current.state!=='qualified'||current.artifactId!==event.id)) {
      subjects.set(key,{kind:binding.kind,subjectId:binding.subjectId,state:'ambiguous'});
      findings.push({code:'visibility.introduction-ambiguous',id:binding.subjectId});continue;
    }
    subjects.set(key,{kind:binding.kind,subjectId:binding.subjectId,state:'qualified',artifactId:event.id,historicalTimeMs:event.historicalTimeMs});
  }
  return freeze({kind:'playthings-visibility-ledger',events:[...events.values()].sort((a,b)=>a.historicalTimeMs-b.historicalTimeMs||compareIds(a.id,b.id)),
    introductions:[...subjects.values()].sort((a,b)=>compareIds(JSON.stringify([a.kind,a.subjectId]),JSON.stringify([b.kind,b.subjectId]))),findings,
    boundary:'Runtime discovery is not story disclosure. Only explicit host-qualified subject bindings to loaded Workspace story artifacts may introduce schemas or identities.'});
}
export function sampleVisibilityLedger(ledger,historicalTimeMs) {
  if(ledger?.kind!=='playthings-visibility-ledger')throw new TypeError('Use createVisibilityLedger first');
  requireFinite(historicalTimeMs,'historicalTimeMs');
  const known=ledger.introductions.filter(item=>item.state==='qualified'&&item.historicalTimeMs<=historicalTimeMs);
  return freeze({historicalTimeMs,artifactIds:ledger.events.filter(item=>item.historicalTimeMs<=historicalTimeMs).map(item=>item.id),
    schemaIds:known.filter(item=>item.kind==='schema').map(item=>item.subjectId),identityIds:known.filter(item=>item.kind==='identity').map(item=>item.subjectId)});
}
/** Fail closed only for a subject explicitly bound to story introduction. An
 * unbound runtime schema may still supply CURRENT styling; it is not presented
 * as historically known. Core remains the sole resource winner selector. */
export function resourceDisclosureState(resource,ledger,historicalTimeMs) {
  requireFinite(historicalTimeMs,'historicalTimeMs');
  if(!ledger)return 'unbound-current-styling';
  if(resource?.owner?.kind==='artifact') {
    const owner=resource.owner;
    const matches=ledger.events.filter(item=>item.workspaceId===owner.workspaceId&&item.artifactPath===owner.artifactPath);
    const event=matches.length===1?matches[0]:null;
    return !event?'unresolved':event.historicalTimeMs<=historicalTimeMs?'visible':'future';
  }
  if(resource?.owner?.kind==='schema') {
    const binding=ledger.introductions.find(item=>item.kind==='schema'&&item.subjectId===resource.owner.schemaId);
    return !binding?'unbound-current-styling':binding.state!=='qualified'?'unresolved':binding.historicalTimeMs<=historicalTimeMs?'visible':'future';
  }
  return resource?.owner?.kind==='root'?'unbound-current-styling':'unresolved';
}
