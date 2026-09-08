# World mathematics and demand planning

The navigation module operates on explicit walkable surfaces and links. Its door/stair pathfinding is tested independently of generated pixels. `layout.mjs` provides seeded variation, capacity estimates, Root reservation packing and bounded contained packing; bounded searches report failures, not teleportation. A batch-wide candidate limit prevents many requests multiplying the per-request budget indefinitely.

## Exact spatial capability projection

`qualifySpatialCapabilities(records, applicationData, resolveCompanions, options)` asks the host resolver for Playthings `tiles`, `structure` and `props`. Playthings does **not** reimplement Core/App specificity. A capability activates only when the winning resource is artifact-exact or a schema default for that artifact's exact schema. Ancestor-schema, Root and other fallback artwork may style an already-active capability but cannot create spatial authority. Ambiguous, blocked, missing-owner and resolver-error cases fail closed and remain findings.

No companion pixels are read to infer topology. `createPresentationSurfaceOrder` can provide deterministic ordering for direct sibling Surfaces, but that ordering is explicitly presentation-only and does not assert floor numbers or new Tiinex semantics.

`createCompanionSpatialWorld(...)` is the high-level bounded chain:

`Core/App resolver result → exact capability projection → presentation surface order → spatial demand → rectangular geometry/navigation candidate`

## Recursive spatial demand

`planSpatialDemand(records, options)` takes already-projected identities, `parentId` (null means known parentless; omitted means unknown), `historicalTimeMs`, exact `capabilities` booleans and optional `displayArea`. The required `options.historicalTimeMs` filters current knowledge. It ignores filenames, folder depth, actor names and future records. Duplicate/reserved identities are rejected. Missing/future/cyclic/overdeep parentage is reported rather than silently placed at Root.

`classifySpatial({tiles,structure,props})` implements four base types: non-spatial, surface, structure, container. Props only modifies available object material. It does not spawn all prop rows or create occupied space automatically.

Non-spatial children belong to the nearest spatial ancestor's **common zone**, not a guessed room. Direct contents and horizontal child areas contribute to demand. Internal sibling Surfaces under a structure share a footprint envelope, but multiple such Surfaces require `options.surfaceOrder[containerId]` listing each direct Surface exactly once. This is an explicit **presentation ordering**, not a new artifact field, file naming rule or assertion of semantic floor numbers. When absent, planning returns `partial` and `spatial.surface-order-required`.

`rootReservations` packs top-level requests. `previousRootPlacements` plus `previousHistoricalTimeMs` can preserve old reservations. Future reservations are rejected for earlier playback, and growing footprints produce an explicit repacking finding. Contained packing is insertion-ordered and minimum-edge anchored so increasing presentation bounds does not itself reshuffle an earlier settled rectangle.

## Qualified rectangular world candidate

`assembleSpatialWorld(demand, options)` compiles a **ready** demand into deterministic rectangular presentation geometry and validates the result with the existing navigation engine.

- Root remains the explicit outer walkable surface.
- Surface/container capabilities create their own walkable surfaces.
- Structure-only nodes remain enclosures on their containing surface.
- Enclosure boundaries become real navigation barriers.
- Generated doors are traversable topology, not decoration; disabling a door can make a route unreachable.
- Containers block their outer footprint except the threshold and connect to a distinct interior through a passage.
- Explicit internal Surface order creates a deterministic stair chain without semantic floor numbering.
- Minimum circulation gaps and bounded surface growth are presentation mechanics; failures remain explicit findings.

A successful candidate reports `navigationCompiled: true`. It reports `geometryQualified: true` only when exact capability provenance was supplied. It always reports `semanticPixelsQualified: false`: geometry/topology comes from qualified switches and presentation rules, never from interpreting structure/tiles pixels.

The candidate is now exposed to the App model as `spatialCandidate`, but the React renderer still uses the Root-only scaffold below. Candidate compilation is therefore not renderer cutover.

## Root-only renderer scaffold

`createRootWorldScaffold(story, options)` remains the deliberately bounded presentation bridge for the current App/React renderer. It hashes each already-projected record identity to a stable walkable point on one synthetic Root surface and feeds those points to the existing navigation engine. Placement does not use Parent lineage, chronology, schema kind, filenames or actors as spatial truth. Appending history therefore cannot reshuffle older positions. Hash collisions remain stacked and produce an explicit finding instead of inventing semantic separation; records beyond the configured presentation budget remain in the semantic story but are not physically depicted.

The scaffold reports `spatialCapabilitiesApplied: false` and `geometryQualified: false`. It is intentionally distinct from the qualified spatial candidate.

## What remains open

This is a bounded deterministic rectangular assembler, not an optimal building architect. The active renderer still needs a qualified multi-surface presentation/camera cutover. Stateful continuity must carry prior placement reservations when demand footprints themselves grow; otherwise repacking is surfaced rather than silently relocated. Structure/tiles pixels remain styling inputs only, final atlas semantics are not certified, and the implementation does not solve arbitrary staircase alignment, multi-agent collisions or human visual acceptance.
