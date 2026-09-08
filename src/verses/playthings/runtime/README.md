# Headless Playthings foundation

## Boundary

The experimental npm entrypoints now expose these **Playthings-owned fixture/adapter APIs**. They are not the future Core/App consumer contract and not an alternative Tiinex schema. No code imports React, Core, App or Site. Do not add raw Markdown parsing, display-name identity guessing, file-path ancestry or filesystem timestamps here. A later Core adapter must supply qualified identities, explicit Parent relations, actor projections and declared historical times.

`story` consumes neutral records: `id`, explicit `parentId` (null = known parentless; omitted = unknown), numeric `historicalTimeMs`, authors, and optional already-qualified participant or Handoff endpoint arrays. `actionStatus` is supplied by the adapter, not guessed from a schema name. Explicit participant arrays, including empty arrays, suppress Authors fallback. Handoff endpoints describe a declaration, never recipient acceptance. Unknown/planned/cancelled actions remain artifact introductions, not completed work.

`time` creates a plan from caller-supplied millisecond anchors. Supply `nowHistoricalMs` explicitly for reproducible planning. The old `advancePlaybackState` is a low-level time accumulator; UI playback should use the observation director's guarded advance function. Random-access sampling/seek may intentionally skip presentation, but ordinary playback must not.

`observation` budgets camera travel, presentation work and dwell. Equal-time events are semantically available together, while camera visits occur in a deterministic presentation order. Work shown during an observation hold depicts that anchor; it does not change source timestamps. Preparation budgets can stretch the approach before an anchor. The first event can hold at its own anchor without fabricating an earlier history. Fine-grained animation-frame synchronization remains a renderer/actor integration gate.

`world` accepts an explicit walkability graph. Door links replace real cardinal edges, stairs connect distinct supplied surfaces, and failed or budget-exhausted routes never teleport. Cross-surface camera/movement samples expose an explicit transition, not interpolation through a nonexistent plane. Dynamic obstacle updates require a new world and replanning; multi-agent collision avoidance is not implemented.

## Determinism and safety

- Code-point identity ordering is independent of machine locale. Input enumeration is not causal authority.
- Story sampling uses only records visible at the historical playhead. Selecting an echo alters emphasis, not history.
- Siblings do not prove simultaneous real-world work. Equal-time siblings may remain sharp together. A later reactivation tones the prior sequential same-identity frontier.
- Multiple equally plausible frontier sources are reported. Choosing the currently sharp/recent frontier and then stable identity is a presentation policy, not evidence of responsibility or a real actor's journey.
- Inputs are copied where retained; public snapshots are frozen. Navigation indexes live in a private WeakMap.
- Camera time and actor traversal consume presentation milliseconds. Historical acceleration never multiplies walking speed.
- The guarded observation tick caps wall-time deltas at 100 ms by default and stops at visit boundaries. Excess elapsed time from tab suspension is deliberately discarded, not caught up as an invisible backlog. This does not certify browser frame presentation; a real host/render acknowledgement gate is still required.
- Incremental packing preserves previous reservations. Replay requires the same insertion batches and reservation state, not merely an unordered final set. Growth conflicts are surfaced instead of silently moving buildings.

## Provisional tuning, not new semantics

Pace ratios, dwell times, camera speed, fork dwell, movement cost/speed, footprint aspect ratio and circulation allowance are explicit tuning options. They have not been visually accepted. A graph cost is a declared traversal-distance proxy; no meter/second measurement of the source world is asserted.

The layout module is a collection of primitives, **not** the final nested building assembler. It does not choose sibling floor order, infer rooms, read PNG masks, or assign geography from filenames. NESW masks come from topology; generated image slot order is not assumed correct.

## Candidate package/companion/scene continuation

See the local READMEs in `companions`, `world` and `scene` for the newly qualified candidate atlas mechanics, recursive demand and staged scene/store. A private npm package now exposes these modules; actual tarball installation is tested. No production-ready React/API or graphical acceptance is implied.

## Next boundary

The next joint milestone requires Refactor Anchor Turn 1: qualified Core projections and companion provenance, App Verse lifecycle and resource composition, plus the exact public package contracts. React mount, fullscreen, Root Gate switching/creation, actual asset providers, schema companion promotion, full building packing and browser-rendered visual acceptance remain pending.

Run `node tools/playthings/test-runtime.mjs`. All fixtures run without npm installation. Node 22.16.0 is the tested environment; this is not yet a published engine-support policy.
