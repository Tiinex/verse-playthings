# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 13:05:17
  - Trace: [Playthings Designer Review Frontier](../design/001-playthings-designer-review-topic.trace.md)
  - Origin:
    - [relative](../design/001-playthings-designer-review-topic.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Authors: Anchor; Sigma
  - Why: Convert the accepted Playthings designer direction into one recoverable productization plan before runtime implementation begins.
  - Summary: Design, qualify, implement, integrate, and scale the standalone Playthings Verse without fabricating Tiinex semantics or coupling to Site internals.
  - Status: active/planning

---

# Playthings Runtime Productization

## Objective

Deliver a standalone React-compatible Playthings Verse that projects ordinary Tiinex artifacts, lineage, qualified relations, time, and PNG companions into a deterministic navigable world, while keeping Site read-only during Playthings development and delaying concrete Core/App imports until their public consumer contract is delivered.

## Scope

- Treat the old Site Playthings runtime as observation material only; no migration compatibility is required.
- Finish designer qualification before implementation. Planning artifacts may be created now; runtime/package source must wait until the relevant design gates are accepted.
- Keep user world semantics in ordinary Tiinex material. Do not invent Playthings-specific world artifacts, hidden manifests, Floor/Room schemas, or per-artifact Playthings metadata.
- Keep the user-facing Playthings resource surface PNG-only. Current candidate channels are Character, Verb, Blueprint, Portrait, Tiles, Structure, and Props.
- Build Playthings in its standalone Workspace. Site remains read-only; future Site/App integration is an explicit external host boundary.
- Consume host-neutral Core projections and the App Verse host once their qualified public contracts exist; never import Site internals or speculative Core/App internal paths.
- Preserve artifact-local moddability and mirrored schema-default companion sources without making physical file paths semantic authority.
- Use directories below this Task to keep each development domain bounded and independently readable.

## Dependencies

- [Playthings Designer Review Frontier](../design/001-playthings-designer-review-topic.trace.md).
- [Semantic Event Model Review](../design/semantics/001-semantic-event-model-review-topic.trace.md) and its scenario material.
- [Core / App / Site Unblock Planning Sync](../repository/001-1-1-core-app-site-unblock-sync-topic.trace.md); actual Core/App consumer exports remain pending.
- [Playthings Repository Extraction And Bootstrap](../repository/001-playthings-repository-extraction-and-bootstrap-task.trace.md).
- Existing Playthings graphics source lineage and visual-production process under `graphics/` and `processes/`.
- Sigma review/approval at designer gates before implementation work begins.

## Planned Domain Tasks

1. `experience/001...` — user experience, fullscreen, Root Gate, controls, observation and ambient life.
2. `semantics/001...` — truthful story projection, branches, actors, handoffs and historical frontiers.
3. `companions/001...` — PNG channel/capability contract and qualified resource resolution requirements.
4. `spatial/001...` — Root world, recursive surfaces/structures, common zones and spatial-home rules.
5. `time/001...` — historical versus presentation time, dense-event slow/freeze and idle-gap acceleration.
6. `world/001...` — deterministic pseudo-random layout, dynamic footprints, navigation, tiles, doors, stairs and roofs.
7. `actors/001...` — identity discovery, presences, ghosts, author/participant depiction, actions and safe ambient behavior.
8. `presentation/001...` — rendering, camera, day/night, cutaway, inspector and in-world controls.
9. `architecture/001...` — standalone package/module boundaries after Core/App consumer contracts are real.
10. `integration/001...` — end-to-end Root and generic-Topic moddability vertical slices.
11. `cutover/001...` — package/host integration readiness and explicit handoff to the App/Site owner.
12. `rollout/001...` — schema defaults, workspace-local mods, scale/performance and broader qualification.

These are planning branches, not claims that implementation has begun. Deeper child Tasks are created only when their domain actually starts and the work packet is known.

## Design Gates Before Implementation

- Experience/time behavior is explicit enough that two implementers would depict the same historical situation materially the same way.
- Semantic rules distinguish source fact, presentation inference, unknown state, formal Handoff, informal succession, branch creation, discovery and replay.
- Companion activation and fallback cannot accidentally classify every Root-fallback artifact as spatial.
- Spatial model can represent outer world, structures, internal surfaces, nested containers and direct/common-zone content without extra Playthings metadata.
- Time model handles dense and simultaneous events without skipping them, accelerating actors beyond normal presentation speed, or fabricating camera order as historical order.
- Core/App public consumer contracts expose enough qualified origin/ancestry/relation/provider information to implement without private imports.

## Carrier Milestone Estimate

From the current Major 006 planning/bootstrap frontier, expect approximately four to six additional carrier majors to reach first qualified scale-out. This is a planning estimate, not a quota: likely boundaries are design lock/API reconciliation, runtime foundation, world/actor/presentation integration, accepted vertical slice/package qualification, host integration readiness, and first scale-out. Merge timing with Core/App may shift or combine these boundaries.

## Done Criteria

- Designer Decisions and Tasks below this plan are accepted or explicitly superseded with no unresolved high-risk ambiguity hidden in implementation.
- Standalone Playthings package has a qualified public runtime/React surface and installs through the intended package boundary rather than source-path shortcuts.
- Companion resolution uses the qualified Core/provider boundary and only Playthings PNG channels; exact capability activation is distinguishable from inherited/fallback artwork.
- Historical/event projection, elastic playback, deterministic world generation, pathfinding, recursive spatial layout, actors/presences, ghosts, actions, camera, day/night and fullscreen presentation are qualified.
- Root vertical slice and generic Topic tavern/moddability fixture both pass end-to-end without introducing Playthings-specific world schemas or manifests.
- Integration package and host contract are handed to the App/Site owner; Site mutation is not silently performed by this Workspace.
- Initial scale-out demonstrates inheritance/defaults/local overrides and acceptable performance on materially larger histories.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Designer Review Frontier](../design/001-playthings-designer-review-topic.trace.md)
  - Value: uXL7QmzU2kj8snSKtW6UJ54dYRyVdvmUicN4wBReNek

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:Y_GoYwJj9zAhikINEZaebCj7PmXl8KdbR1lsE3Cz_w0
