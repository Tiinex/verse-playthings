import {freeze,requireId,requireFinite} from '../shared/values.mjs';
import {sampleStoryPlan,planFrontierRoutes,sampleFrontierRoutes} from '../story/index.mjs';
import {findPath} from '../world/navigation.mjs';
import {createObservationPlan,sampleObservationPlan} from '../observation/index.mjs';

/** Artistic day/night from declared history and an explicit display timezone.
 * Not astronomical evidence, season simulation or a participant's actual location. */
export function daylightAt(historicalTimeMs,{utcOffsetMinutes=0,minimumLight=.3}={}) {
  requireFinite(historicalTimeMs,'historicalTimeMs');requireFinite(utcOffsetMinutes,'utcOffsetMinutes');
  requireFinite(minimumLight,'minimumLight',0);if(minimumLight>1)throw new RangeError('minimumLight must be <= 1');
  const dayMs=86_400_000,local=historicalTimeMs+utcOffsetMinutes*60_000;
  if(!Number.isFinite(local)) throw new RangeError('Display time overflow');
  const fraction=((local%dayMs)+dayMs)%dayMs/dayMs;
  const sunlight=(1-Math.cos(2*Math.PI*fraction))/2;
  return freeze({dayFraction:fraction,light:minimumLight+(1-minimumLight)*sunlight,astronomicalClaim:false});
}
const get=(values,id)=>values instanceof Map?values.get(id):Object.hasOwn(values,id)?values[id]:undefined;
const copyLocation=location=>location==null?null:{surfaceId:requireId(location.surfaceId,'surfaceId'),
  x:requireFinite(location.x,'x'),y:requireFinite(location.y,'y')};

/** Internal scene adapter API, not Core/App's future host contract.
 * World is an explicitly supplied, already-walkable fixture/snapshot. Dynamic topology
 * and source-to-asset resolution stay outside this plan. Full semantic history is never
 * derived from camera visits; visits only stage its visible depiction.
 */
export function createScenePlan(story,options={}) {
  if(story?.kind!=='playthings-story-plan') throw new TypeError('Use createStoryPlan first');
  if(!options.world) throw new TypeError('Explicit navigation world required');
  const rendererQualified=options.rendererQualified??false;
  if(typeof rendererQualified!=='boolean')throw new TypeError('rendererQualified must be boolean');
  const rendererMode=options.rendererMode??'caller-supplied';
  if(typeof rendererMode!=='string'||!rendererMode)throw new TypeError('rendererMode must be a nonempty string');
  const locations=Object.fromEntries(story.records.map(r=>[r.id,copyLocation(get(options.locations??{},r.id))]));
  const routes=Object.create(null),scenes=Object.create(null),findings=[],blocked=new Set(),presentationOrderByGroup=Object.create(null);
  for(const event of story.log) {
    const eventWorld=options.worldForEvent?options.worldForEvent(event):options.world;
    const eventLocations=options.locationsForEvent?options.locationsForEvent(event):locations;
    let route=planFrontierRoutes(event,eventLocations,eventWorld,options.movement);
    // A later event cannot restart walking from a frontier we failed to present.
    if(event.effects.some(e=>e.from&&blocked.has(e.from))) route=freeze({...route,ready:false,tracks:route.tracks.map(t=>({...t,status:'prior-presentation-blocked',durationMs:0,legs:[]})),durationMs:0});
    if(route.ready && (!get(eventLocations,event.id) || findPath(eventWorld,get(eventLocations,event.id),get(eventLocations,event.id)).status!=='found')) {
      route=freeze({...route,ready:false,durationMs:0,tracks:route.tracks.map(t=>({...t,status:'blocked-endpoint',durationMs:0,legs:[]}))});
    }
    if(!route.ready){blocked.add(event.id);findings.push({id:event.id,code:'scene.route-unavailable',reasons:route.tracks.length?route.tracks.filter(t=>t.status!=='ready').map(t=>t.status):['missing-or-hidden-location']});}
    routes[event.id]=route;scenes[event.id]={location:get(eventLocations,event.id)??null,presentationWorkMs:route.ready?route.durationMs:0};
    const key=`historical-group:${event.historicalTimeMs}`;
    (presentationOrderByGroup[key]??=[]).push(event.id);
  }
  const observation=createObservationPlan(story.records,{...options.playback,scenes,presentationOrderByGroup});
  return freeze({kind:'playthings-scene-plan',story,observation,routes,locations,findings,
    navigationIsCallerSupplied:true,rendererQualified,rendererMode});
}

export function sampleScenePlan(plan,presentationTimeMs,options={}) {
  if(plan?.kind!=='playthings-scene-plan') throw new TypeError('Use createScenePlan first');
  requireFinite(presentationTimeMs,'presentationTimeMs',0);
  const observation=sampleObservationPlan(plan.observation,presentationTimeMs),time=observation.clock.historicalTimeMs;
  const semantic=sampleStoryPlan(plan.story,time,options);
  const shown=new Set(plan.observation.phases.filter(p=>p.kind==='dwell'&&p.startMs<=presentationTimeMs&&plan.routes[p.eventId].ready).map(p=>p.eventId));
  for(const event of plan.story.log) if(event.historicalTimeMs<plan.observation.playback.startHistoricalMs&&plan.routes[event.id].ready) shown.add(event.id);
  // This separate staged log does not modify semantic.visibleEventIds or source truth.
  const staged=sampleStoryPlan({...plan.story,log:plan.story.log.filter(e=>shown.has(e.id))},time,options);
  const actors=staged.frontiers.flatMap(f=>f.actors.map(a=>({
    renderId:JSON.stringify([f.artifactId,a.identityId]),artifactId:f.artifactId,identityId:a.identityId,
    mode:a.mode,emphasis:a.emphasis,appearance:a.appearance,phase:'idle',position:plan.locations[f.artifactId],transition:null,
  })));
  const phase=observation.phase;
  const active=phase?.kind==='presentation-work'?plan.story.log.find(e=>e.id===phase.eventId):null;
  if(active) {
    for(const change of active.ghostChanges) for(const actor of actors) if(actor.artifactId===change.artifactId&&actor.identityId===change.actorId) {
      actor.mode='ghost';actor.emphasis=options.selectedFrontierId===actor.artifactId?'sharp':'toned';
    }
    const route=plan.routes[active.id],samples=sampleFrontierRoutes(route,presentationTimeMs-phase.startMs);
    for(const sample of samples) {
      const effect=active.effects.find(e=>e.actorId===sample.actorId);
      for(let i=actors.length-1;i>=0;i--) if(actors[i].identityId===sample.actorId&&actors[i].artifactId===effect.from&&actors[i].mode!=='ghost'&&!effect.keepConcurrentFrontierSharp) actors.splice(i,1);
      const appearance=plan.story.identities.some(i=>i.id===sample.actorId&&i.discoveredAtMs<=time)?'identity':'default';
      const direction=sample.phase==='walk'&&sample.from?.surfaceId===sample.to?.surfaceId
        ?sample.to.x>sample.from.x?'right':sample.to.x<sample.from.x?'left':sample.to.y<sample.from.y?'up':'down':'down';
      actors.push({direction,renderId:JSON.stringify([active.id,sample.actorId]),artifactId:active.id,identityId:sample.actorId,
        mode:'active',emphasis:'sharp',appearance,phase:sample.phase,position:sample.position??null,
        transition:sample.position==null&&sample.from&&sample.to?{from:sample.from,to:sample.to,progress:sample.progress}:null});
    }
  }
  actors.sort((a,b)=>a.renderId<b.renderId?-1:a.renderId>b.renderId?1:0);
  const visibleSet=new Set(semantic.visibleEventIds);
  const blockedIds=plan.findings.filter(f=>visibleSet.has(f.id)).map(f=>f.id);
  const blockedSet=new Set(blockedIds);
  const pending=semantic.visibleEventIds.filter(id=>!shown.has(id)&&id!==active?.id&&!blockedSet.has(id));
  return freeze({kind:'playthings-scene-snapshot',clock:observation.clock,camera:observation.camera,
    cameraTransition:phase?.kind==='surface-transition'?{from:phase.from,to:phase.to,progress:(presentationTimeMs-phase.startMs)/(phase.endMs-phase.startMs)}:null,
    observationPhase:phase?{kind:phase.kind,eventId:phase.eventId,progress:(presentationTimeMs-phase.startMs)/(phase.endMs-phase.startMs)}:null,
    semantic,actors,pendingDepictionIds:pending,blockedDepictionIds:blockedIds,completedVisitIds:observation.completedVisits,
    lighting:daylightAt(time,options.lighting),selection:options.selectedFrontierId??null,
    depictionIsHistory:false});
}
