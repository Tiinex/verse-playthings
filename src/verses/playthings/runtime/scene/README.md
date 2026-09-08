# Headless scene projection

A scene is the layer between headless story/time/navigation and the future renderer. It does not mount React, create DOM, start timers, parse artifacts, fetch assets or decide a Core/App host API.

## Plan and sample

`createScenePlan(storyPlan, {world,locations,movement?,playback?})` plans routes and camera/work/dwell budgets. The caller supplies a qualified navigation snapshot and locations. Dynamic/historical topology is not inferred here. Parent dependencies order equal-time **visits**; all same-time facts are available together regardless of visit order.

`sampleScenePlan(plan, presentationTimeMs, options?)` returns immutable:

- `clock` and authoritative `semantic` availability;
- staged `actors`, stable `renderId`, identity/default appearance and active/ghost emphasis;
- `camera` or an explicit cross-surface camera transition;
- current observation phase, pending/blocked depictions and completed visits;
- simple history-clock daylight with an explicit display UTC offset.

Availability is not visual completion. At a new-branch anchor, the old ghost can remain at the previous leaf while the moving actor backtracks and forks. The actor does not appear at its final destination merely because its source event is already known. Blocked traversal retains the previously depictable position and marks the event; later dependent travel cannot restart from a destination that was never reached. This is a presentation limitation, not a claim that the source event did not happen.

Daylight is an artistic continuous cycle, not astronomy or weather evidence. It freezes with historical time during bullet-time while camera/actors use presentation time. Real renderer brightness smoothing/accessibility remain future work.

## External store, ready for a later UI adapter

`createSceneStore(plan, options?)` exposes `getSnapshot`, `getServerSnapshot`, `subscribe`, `tick`, `seek`, `setPaused`, `select` and `dispose`.

Snapshots keep object identity until state changes. Subscriptions return independent unsubscription functions. Paused ticks do not advance. Normal ticks use the guarded observation director and discard excessive tab-suspension time; explicit seek can skip presentation intentionally. Callbacks run synchronously after commit; all callbacks are attempted, and failures raise AggregateError. Reentrant writes during notification are rejected.

The constructor snapshot is retained as `getServerSnapshot`; a future host must reproduce/serialize matching initial data for hydration. This is compatible in shape with React's [external-store contract](https://react.dev/reference/react/useSyncExternalStore), **not a tested React mount or SSR integration**. We export no fake `/react` endpoint and add no peer version range until an actual React adapter is qualified.

The scene only stages known routes/identity; it does not yet select full character/verb atlas frames, place persistent Props from source semantics, auto-build structures, perform fullscreen actions or render a playable Verse. No standalone demo is included.
