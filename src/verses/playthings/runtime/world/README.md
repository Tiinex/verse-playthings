# World mathematics and demand planning

The navigation module operates on explicit walkable surfaces and links. Its door/stair pathfinding is tested independently of generated pixels. `layout.mjs` provides seeded variation, capacity estimates and Root reservation packing; bounded searches report failures, not teleportation. A batch-wide candidate limit prevents many requests multiplying the per-request budget indefinitely.

## Recursive spatial demand

`planSpatialDemand(records, options)` takes already-projected identities, `parentId` (null means known parentless; omitted means unknown), `historicalTimeMs`, exact `capabilities` booleans and optional `displayArea`. The required `options.historicalTimeMs` filters current knowledge. It ignores filenames, folder depth, actor names and future records. Duplicate/reserved identities are rejected. Missing/future/cyclic/overdeep parentage is reported rather than silently placed at Root.

`classifySpatial({tiles,structure,props})` implements four base types: non-spatial, surface, structure, container. Props only modifies available object material. It does not spawn all prop rows or create occupied space automatically. These booleans must be qualified by the future adapter; this module does not discover companion files.

Non-spatial children belong to the nearest spatial ancestor's **common zone**, not a guessed room. Direct contents and horizontal child areas contribute to demand. Internal sibling Surfaces under a structure share a footprint envelope, but multiple such Surfaces require `options.surfaceOrder[containerId]` listing each direct Surface exactly once. This is an explicit **presentation ordering**, not a new artifact field, file naming rule or assertion of semantic floor numbers. When absent, planning returns `partial` and `spatial.surface-order-required`.

`rootReservations` packs top-level requests. `previousRootPlacements` plus `previousHistoricalTimeMs` can preserve old reservations. Future reservations are rejected for earlier playback, and growing footprints produce an explicit repacking finding. Same inputs, seed and reservation history reproduce the result; arbitrary different insertion histories need not produce the same packing.

## What this does not implement

This is capacity/ownership planning, not an optimal building architect. It does not yet carve the measured areas into rendered rooms/corridors, emit navigation from those rectangles, choose staircase alignments, resize settled buildings without conflict, prove every future interior reachable, or solve multi-agent collisions. `navigationCompiled` and `geometryQualified` remain false. The existing explicit navigation graph still supplies scene routes until the next assembly gate is implemented.
