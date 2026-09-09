import {freeze,requireFinite,requireInteger} from '../shared/values.mjs';
import {atlasSlot,COMPANION_CHANNELS} from './atlas.profile.mjs';
import {resourceDisclosureState} from '../story/visibility.mjs';

/** Host resolver owns specificity, provider precedence and collection append.
 * This layer only refuses unresolved or historically undisclosable winners.
 * It never tries a lower-priority candidate after a conflict or hidden winner.
 */
export function resolveVisualCompanions({record,channel,resolveCompanions,ledger,historicalTimeMs,maxResources=8}={}) {
  requireFinite(historicalTimeMs,'historicalTimeMs');requireInteger(maxResources,'maxResources',1);
  if(!COMPANION_CHANNELS.includes(channel))throw new TypeError('Unknown companion channel');
  if(!record?.workspaceId||!record?.path||typeof resolveCompanions!=='function')return freeze({status:'missing',resources:[],reason:'host-owner-unavailable'});
  if(ledger&&!ledger.events.some(event=>event.id===record.id&&event.historicalTimeMs<=historicalTimeMs))return freeze({status:'hidden',resources:[],reason:'artifact-not-yet-visible'});
  let resolved;
  try{resolved=resolveCompanions({namespace:'playthings',slot:channel,owner:{kind:'artifact',workspaceId:record.workspaceId,artifactPath:record.path}});}
  catch{return freeze({status:'blocked',resources:[],reason:'resolver-threw'});}
  if(resolved?.status!=='resolved')return freeze({status:['missing','ambiguous','blocked'].includes(resolved?.status)?resolved.status:'blocked',resources:[],reason:'resolver-not-resolved'});
  const resources=resolved.resources;
  if(!Array.isArray(resources)||!resources.length||resources.length>maxResources||resources.some(item=>item?.namespace!=='playthings'||item.slot!==channel||!item.providerId))return freeze({status:'blocked',resources:[],reason:'invalid-or-over-budget-resources'});
  if(resources.length>1&&resolved.query?.cardinality!=='multiple'&&!resources.every(item=>item.cardinality==='multiple'))return freeze({status:'ambiguous',resources:[],reason:'single-slot-has-multiple-winners'});
  const disclosure=resources.map(resource=>resourceDisclosureState(resource,ledger,historicalTimeMs));
  if(disclosure.some(state=>state==='future'||state==='unresolved'))return freeze({status:'hidden',resources:[],reason:'winner-not-historically-disclosable'});
  let detached;try{detached=structuredClone(resources);}catch{return freeze({status:'blocked',resources:[],reason:'resource-not-data'});}
  return freeze({status:'resolved',resources:detached,
    artworkTime:'current-presentation-skin',semanticAuthority:false});
}

/** Candidate atlas addressing only. Every state is presentation state. Work
 * animation needs explicit occurred input; unknown/planned/cancelled never wins.
 */
export function sampleCompanionFrame(layout,options={}) {
  const time=requireFinite(options.elapsedMs??0,'elapsedMs',0),item=requireInteger(options.item??0,'item');
  const animation=options.reducedMotion?0:Math.floor(time/140)%8;
  const progress=Math.max(0,Math.min(1,requireFinite(options.progress??1,'progress')));
  const direction=options.direction??'down';let slot=0;
  switch(layout?.channel) {
    case 'character': {
      const row=options.mode==='ghost'?5:options.phase==='walk'?({down:1,left:2,right:3,up:4}[direction]??1):0;
      slot=row?row*8+animation:({down:0,left:1,right:2,up:3}[direction]??0);break;
    }
    case 'verb':if(options.actionStatus!=='occurred')return freeze({status:'suppressed',reason:'occurrence-not-qualified'});slot=animation;break;
    case 'blueprint':slot=options.reducedMotion?7:Math.min(7,Math.floor(progress*8));break;
    case 'portrait':slot=options.mode==='ghost'?3:options.emphasis==='sharp'?1:0;break;
    case 'props':slot=options.slot??0;break;
    case 'tiles':slot=requireInteger(options.mask??0,'mask');if(slot>15)throw new RangeError('Tile mask out of range');break;
    case 'structure': {
      const part=options.part??'wall',mask=requireInteger(options.mask??0,'mask');if(mask>15)throw new RangeError('Structure mask out of range');
      if(part==='wall'||part==='roof')slot=(part==='roof'?16:0)+mask;
      else {const base={doorway:32,window:36,'stairs-up':40,'stairs-down':44}[part],offset=['north','east','south','west'].indexOf(direction);if(base===undefined||offset<0)throw new TypeError('Explicit structure part/direction required');slot=base+offset;}
      break;
    }
    default:throw new TypeError('Valid atlas layout required');
  }
  return freeze({status:'ready',...atlasSlot(layout,item,slot),semanticPixelsQualified:false});
}
