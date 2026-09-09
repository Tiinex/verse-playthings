import {compareIds,freeze,requireFinite,requireId} from '../shared/values.mjs';
import {variation} from './layout.mjs';
import {classifySpatial,planSpatialDemand} from './demand.mjs';
import {assembleSpatialWorld} from './assembly.mjs';

export const SPATIAL_COMPANION_CHANNELS=Object.freeze(['tiles','structure','props']);

const metadataLookup=(metadata)=>{
  if(metadata instanceof Map)return id=>metadata.get(id);
  if(Array.isArray(metadata)){const map=new Map(metadata.map(record=>[record?.id,record]));return id=>map.get(id);}
  if(metadata&&typeof metadata==='object')return id=>Object.hasOwn(metadata,id)?metadata[id]:undefined;
  throw new TypeError('metadata must be a Map, record array or id-keyed object');
};
const exactBasis=(resource,meta)=>{
  const owner=resource?.owner;
  if(owner?.kind==='artifact'&&owner.workspaceId===meta.workspaceId&&owner.artifactPath===meta.path)return 'exact-artifact';
  if(owner?.kind==='schema'&&meta.schemaId&&owner.schemaId===meta.schemaId)return 'exact-schema';
  return 'inherited-or-fallback';
};
const finding=(severity,code,id,channel,details={})=>freeze({severity,code,id,channel,details});

/**
 * Qualify only capability activation from an already-authoritative companion resolver.
 * Resolution logic remains owned by Core/App. Playthings only distinguishes exact
 * artifact/exact-schema winners from inherited/root artwork as required by its accepted
 * capability Decision. Resource pixels are not read or semantically classified here.
 */
export function qualifySpatialCapabilities({records,metadata,resolveCompanions}={}) {
  if(!Array.isArray(records))throw new TypeError('records must be an array');
  if(typeof resolveCompanions!=='function')throw new TypeError('resolveCompanions must be a function');
  const getMeta=metadataLookup(metadata),findings=[],qualified=[],receipts=[];
  for(const record of records) {
    const id=requireId(record?.id),historicalTimeMs=requireFinite(record?.historicalTimeMs,'historicalTimeMs');
    const meta=getMeta(id);
    if(!meta||typeof meta!=='object'||!meta.workspaceId||!meta.path){
      findings.push(finding('error','spatial-capability.owner-unavailable',id,null,{boundary:'Exact artifact/schema capability cannot be qualified without App owner metadata.'}));
      continue;
    }
    const capabilities={tiles:false,structure:false,props:false},channels={};
    for(const channel of SPATIAL_COMPANION_CHANNELS) {
      let resolution;
      try {
        resolution=resolveCompanions({namespace:'playthings',slot:channel,owner:{kind:'artifact',workspaceId:meta.workspaceId,artifactPath:meta.path,schemaId:meta.schemaId||''}});
      } catch(error) {
        findings.push(finding('error','spatial-capability.resolver-threw',id,channel,{message:String(error?.message||error)}));
        channels[channel]=freeze({status:'blocked',active:false,basis:'resolver-error'});
        continue;
      }
      const status=String(resolution?.status||'');
      const resources=Array.isArray(resolution?.resources)?resolution.resources:[];
      if(status==='missing') {
        channels[channel]=freeze({status,active:false,basis:'absent'});
        continue;
      }
      const collection=channel==='props'&&(resolution?.query?.cardinality==='multiple'||resources.every(item=>item?.cardinality==='multiple'));
      if(status!=='resolved'||resources.length<1||resources.length>8||(!collection&&resources.length!==1)) {
        findings.push(finding('error',`spatial-capability.${status||'invalid'}`,id,channel,{resourceCount:resources.length}));
        channels[channel]=freeze({status:status||'invalid',active:false,basis:'unresolved'});
        continue;
      }
      if(resources.some(resource=>resource?.namespace!=='playthings'||resource.slot!==channel||!resource.providerId)) {
        findings.push(finding('error','spatial-capability.resource-mismatch',id,channel));
        channels[channel]=freeze({status:'blocked',active:false,basis:'invalid-resource'});
        continue;
      }
      const bases=resources.map(resource=>exactBasis(resource,meta)),active=bases.some(basis=>basis!=='inherited-or-fallback');
      const copies=resources.map((resource,i)=>({id:resource.id||'',key:resource.key||'',path:resource.path||'',url:resource.url||'',
        providerId:resource.providerId||'',sha256:resource.sha256||'',mediaType:resource.mediaType||'',
        owner:resource.owner?{...resource.owner}:null,basis:bases[i]}));
      capabilities[channel]=active;
      const basis=resources.length===1?bases[0]:active?'exact-collection':'inherited-or-fallback';
      channels[channel]=freeze({status:'resolved',active,basis,resource:copies.length===1?copies[0]:null,resources:copies});
      if(!active)findings.push(finding('info','spatial-capability.fallback-does-not-activate',id,channel));
    }
    const projected={id,historicalTimeMs,capabilities:freeze(capabilities)};
    if(record.parentId!==undefined)projected.parentId=record.parentId;
    if(record.displayArea!==undefined)projected.displayArea=record.displayArea;
    qualified.push(freeze(projected));receipts.push(freeze({id,channels:freeze(channels)}));
  }
  qualified.sort((a,b)=>a.historicalTimeMs-b.historicalTimeMs||compareIds(a.id,b.id));
  receipts.sort((a,b)=>compareIds(a.id,b.id));
  return freeze({kind:'playthings-spatial-capability-projection',records:qualified,receipts,findings,
    status:findings.some(item=>item.severity==='error')?'blocked':'ready',
    exactActivationOnly:true,semanticPixelsQualified:false,
    boundary:'Exact artifact/exact-schema companion presence may activate tiles/structure/props. Ancestor/Root fallback artwork never activates spatial capability.'});
}

/** Presentation-only ordering for direct Surface children of a Structure/Container. */
export function createPresentationSurfaceOrder(records,{seed='playthings-surface-order'}={}) {
  if(!Array.isArray(records))throw new TypeError('records must be an array');
  requireId(seed,'seed');
  const byId=new Map(records.map(record=>[requireId(record.id),record]));
  const groups=new Map();
  for(const child of records) {
    if(child.parentId===undefined||child.parentId===null)continue;
    const parent=byId.get(child.parentId);if(!parent)continue;
    if(classifySpatial(parent.capabilities).structure!==true||classifySpatial(child.capabilities).baseType!=='surface')continue;
    const list=groups.get(parent.id)||[];list.push(child.id);groups.set(parent.id,list);
  }
  const entries=[...groups.entries()].map(([parentId,ids])=>[parentId,ids.sort((a,b)=>byId.get(a).historicalTimeMs-byId.get(b).historicalTimeMs||variation(seed,a,'surface-order')-variation(seed,b,'surface-order')||compareIds(a,b))]);
  entries.sort(([a],[b])=>compareIds(a,b));
  return freeze({kind:'playthings-presentation-surface-order',surfaceOrder:Object.fromEntries(entries),levelNumberingIsSemantic:false,
    boundary:'Stable presentation order only; it does not assert floor numbers, chronology, hierarchy beyond the supplied Parent/capability projection, or source semantics.'});
}

/** Bridge exact companion qualification into the existing recursive demand planner. */
export function planCompanionSpatialDemand(input,options={}) {
  const capabilities=qualifySpatialCapabilities(input);
  if(capabilities.status!=='ready')return freeze({kind:'playthings-companion-spatial-demand',status:'blocked',capabilities,demand:null,findings:capabilities.findings});
  const order=options.surfaceOrder===undefined?createPresentationSurfaceOrder(capabilities.records,{seed:options.seed??'playthings-world'}):
    freeze({kind:'playthings-presentation-surface-order',surfaceOrder:options.surfaceOrder,levelNumberingIsSemantic:false,boundary:'Caller-supplied presentation order.'});
  const demand=planSpatialDemand(capabilities.records,{...options,surfaceOrder:order.surfaceOrder});
  return freeze({kind:'playthings-companion-spatial-demand',status:demand.status,capabilities,surfaceOrder:order,demand,findings:[...capabilities.findings,...demand.findings],
    boundary:'Companion resolution is qualified before demand planning; no filename, fallback resource or pixel content creates spatial truth.'});
}

/** Exact companion resolution -> demand -> deterministic topology/geometry. */
export function createCompanionSpatialWorld(input,options={}) {
  const planned=planCompanionSpatialDemand(input,options);
  if(!planned.demand)return freeze({kind:'playthings-companion-spatial-world',status:'blocked',capabilities:planned.capabilities,surfaceOrder:planned.surfaceOrder??null,demand:null,spatialWorld:null,findings:planned.findings,
    boundary:'Capability qualification failed before spatial geometry was attempted.'});
  const spatialWorld=assembleSpatialWorld(planned.demand,{...options,capabilitiesQualified:true});
  return freeze({kind:'playthings-companion-spatial-world',status:spatialWorld.status,capabilities:planned.capabilities,surfaceOrder:planned.surfaceOrder,demand:planned.demand,spatialWorld,
    findings:[...planned.capabilities.findings,...spatialWorld.findings],
    boundary:'Core/App companion resolution remains authoritative for resource selection; Playthings compiles only exact capability activation into presentation geometry/topology.'});
}
