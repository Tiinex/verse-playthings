import {requireFinite} from '../shared/values.mjs';
import {advanceObservationState} from '../observation/index.mjs';
import {sampleScenePlan} from './scene.plan.mjs';

/** Manually driven external store. No timers, DOM, React imports or guessed App contract.
 * getSnapshot is cached until a successful command changes presentation/selection.
 * getServerSnapshot stays at the constructor snapshot for explicit host hydration.
 * All commands are synchronous; reentrant writes during notification are rejected.
 */
export function createSceneStore(plan,options={}) {
  const lighting=options.lighting?Object.freeze({...options.lighting}):undefined;
  const maxFrameDeltaMs=requireFinite(options.maxFrameDeltaMs??100,'maxFrameDeltaMs',Number.EPSILON);
  let time=requireFinite(options.presentationTimeMs??0,'presentationTimeMs',0),paused=options.paused??false;
  if(typeof paused!=='boolean')throw new TypeError('paused must be boolean');
  let selected=options.selectedFrontierId??null,disposed=false,notifying=false;
  if(selected!==null&&!plan.story.records.some(r=>r.id===selected))throw new RangeError('Unknown frontier selection');
  let snapshot=build();const initialSnapshot=snapshot,listeners=new Set();
  function build(){return Object.freeze({...sampleScenePlan(plan,time,{selectedFrontierId:selected,lighting}),paused});}
  function guard(){if(disposed)throw new Error('Scene store is disposed');if(notifying)throw new Error('Reentrant scene writes are not supported');}
  function change(action) {
    guard();const before=[time,paused,selected];action();
    if(before[0]===time&&before[1]===paused&&before[2]===selected)return snapshot;
    snapshot=build();notifying=true;const errors=[];
    try{for(const entry of [...listeners]){try{entry.listener();}catch(e){errors.push(e);}}}finally{notifying=false;}
    if(errors.length)throw new AggregateError(errors,'Scene state committed; subscriber notification failed');
    return snapshot;
  }
  return Object.freeze({
    getSnapshot:()=>snapshot,
    getServerSnapshot:()=>initialSnapshot,
    subscribe(listener){guard();if(typeof listener!=='function')throw new TypeError('Listener must be a function');const entry={listener};listeners.add(entry);return ()=>listeners.delete(entry);},
    tick(elapsedMs){return change(()=>{time=advanceObservationState(plan.observation,{presentationTimeMs:time,paused,maxFrameDeltaMs},elapsedMs).presentationTimeMs;});},
    seek(presentationTimeMs){return change(()=>{time=requireFinite(presentationTimeMs,'presentationTimeMs',0);});},
    setPaused(value){return change(()=>{if(typeof value!=='boolean')throw new TypeError('paused must be boolean');paused=value;});},
    select(frontierId){return change(()=>{if(frontierId!==null&&!plan.story.records.some(r=>r.id===frontierId&&r.historicalTimeMs<=snapshot.clock.historicalTimeMs))throw new RangeError('Unknown frontier selection');selected=frontierId;});},
    dispose(){guard();disposed=true;listeners.clear();},
  });
}
