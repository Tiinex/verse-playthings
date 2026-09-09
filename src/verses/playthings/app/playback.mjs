import {requireFinite} from '../runtime/shared/values.mjs';
import {advanceObservationState} from '../runtime/observation/index.mjs';
import {samplePlaybackPlan} from '../runtime/time/index.mjs';
export function advanceExperienceCursor(model,current,elapsedMs,{paused=false,hidden=false}={}) {
  requireFinite(current,'current',0);requireFinite(elapsedMs,'elapsedMs',0);
  if(!model?.scene)return 0;
  return Math.min(model.presentationDurationMs,advanceObservationState(model.scene.observation,
    {presentationTimeMs:Math.min(current,model.presentationDurationMs),paused:paused||hidden,maxFrameDeltaMs:100},elapsedMs).presentationTimeMs);
}
export function cursorAtHistoricalTime(model,historicalTimeMs) {
  requireFinite(historicalTimeMs,'historicalTimeMs');if(!model?.scene)return 0;
  let lo=0,hi=model.presentationDurationMs;
  for(let i=0;i<56;i++){const mid=(lo+hi)/2;if(samplePlaybackPlan(model.scene.observation.playback,mid).historicalTimeMs<historicalTimeMs)lo=mid;else hi=mid;}
  return hi;
}
/** Rebase observation position, not its old millisecond offset. A snapshot
 * replacement is not permission to jump to latest or silently resume playback. */
export function rebaseExperienceCursor(previous,next,current) {
  if(!next?.scene)return 0;
  if(!previous?.scene)return next.presentationDurationMs;
  requireFinite(current,'current',0);
  const oldTime=Math.min(current,previous.presentationDurationMs);
  const oldPhase=previous.scene.observation.phases.find(phase=>phase.startMs<=oldTime&&oldTime<phase.endMs)
    ??(oldTime===previous.presentationDurationMs?previous.scene.observation.phases.at(-1):null);
  if(oldPhase){const match=next.scene.observation.phases.find(phase=>phase.eventId===oldPhase.eventId&&phase.kind===oldPhase.kind);if(match)return match.startMs+(match.endMs-match.startMs)*Math.min(1,(oldTime-oldPhase.startMs)/(oldPhase.endMs-oldPhase.startMs));}
  const historicalTime=samplePlaybackPlan(previous.scene.observation.playback,oldTime).historicalTimeMs;
  return cursorAtHistoricalTime(next,historicalTime);
}
export function stepExperienceMoment(model,current,direction) {
  if(![-1,1].includes(direction))throw new TypeError('Direction must be -1 or 1');
  if(!model?.scene)return 0;
  const time=samplePlaybackPlan(model.scene.observation.playback,current).historicalTimeMs;
  const target=direction<0?[...model.times].reverse().find(value=>value<time):model.times.find(value=>value>time);
  return target===undefined?(direction<0?0:model.presentationDurationMs):cursorAtHistoricalTime(model,target);
}
