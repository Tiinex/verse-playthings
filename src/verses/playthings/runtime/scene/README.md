# Headless scene projection

A scene is the layer between headless story/time/navigation and the renderer. It does not mount React, create DOM, start timers, parse artifacts, fetch assets or decide a Core/App host API.

## Plan and sample

`createScenePlan(storyPlan, {world,locations,rendererQualified?,rendererMode?,worldForEvent?,locationsForEvent?,movement?,playback?})` plans routes and camera/work/dwell budgets. The caller supplies a qualified navigation snapshot and locations. Dynamic/historical topology is not inferred here; the optional event-specific callbacks supply explicitly filtered topology and locations before route planning. Parent dependencies order equal-time **visits**; all same-time facts are available together regardless of visit order.

`sampleScenePlan(plan, presentationTimeMs, options?)` returns immutable:

- `clock` and authoritative `semantic` availability;
- staged `actors`, stable `renderId`, identity/default appearance and active/ghost emphasis;
- `camera` or an explicit cross-surface camera transition;
- current observation phase, pending/blocked depictions and completed visits;
- simple history-clock daylight with an explicit display UTC offset.

Availability is not visual completion. At a new-branch anchor, the old ghost can remain at the previous leaf while the moving actor backtracks and forks. The actor does not appear at its final destination merely because its source event is already known. Blocked traversal retains the previously depictable position and marks the event; later dependent travel cannot restart from a destination that was never reached. This is a presentation limitation, not a claim that the source event did not happen.

Daylight is an artistic continuous cycle, not astronomy or weather evidence. It freezes with historical time during bullet-time while camera/actors use presentation time. The candidate React layer offers reduced visual motion. Final visual/assistive-technology acceptance remains open.

## External store, ready for a later UI adapter

`createSceneStore(plan, options?)` exposes `getSnapshot`, `getServerSnapshot`, `subscribe`, `tick`, `seek`, `setPaused`, `select` and `dispose`.

Snapshots keep object identity until state changes. Subscriptions return independent unsubscription functions. Paused ticks do not advance. Normal ticks use the guarded observation director and discard excessive tab-suspension time; explicit seek can skip presentation intentionally. Callbacks run synchronously after commit; all callbacks are attempted, and failures raise AggregateError. Reentrant writes during notification are rejected.

The constructor snapshot is retained as `getServerSnapshot`; a host would need matching initial data for hydration. This manually driven store is separate from the current state-driven React adapter. Neither the external-store shape nor its headless tests constitute a React mount or SSR qualification.

## Candidate React adapter

The public `/react` entrypoint now exists and uses the optional pinned host peer. It consumes historical scene snapshots with PNG frame sampling, a bounded viewport, Root Gate and a read-only shelf/inspector. `app/playback.mjs` reuses guarded observation advancement; normal ticks cannot skip unseen phase boundaries or replay a suspended-tab backlog.

The public scene sampler includes walking direction only from explicit same-surface movement steps. Identity appearance still needs a qualified introduction; a party name is never matched to a future portrait. A record without an available location is explicitly physically undepicted even with zero actors. This does not remove its semantic availability.

See repository `docs/EXPERIENCE-CANDIDATE-1.md` for actual qualification scope. Native browser primitive tests are not React/host lifecycle, fullscreen/footer, final atlas or human acceptance.
