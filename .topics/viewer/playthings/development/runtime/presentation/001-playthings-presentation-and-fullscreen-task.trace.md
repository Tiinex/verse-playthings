# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Origin:
    - [relative](../001-playthings-runtime-productization-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:49:04
  - Authors: Anchor; Sigma
  - Why: Turn the qualified world/story state into a legible game-like Verse without reintroducing graph-first clutter or host coupling.
  - Summary: Implement renderer, camera, layers, fullscreen controls, Root Gate interaction, day/night, cutaway, ghosts and inspection only after experience/world/actor contracts are accepted.
  - Status: planned/design

---

# Playthings Presentation And Fullscreen

## Objective

['Render one-scale outer/nested world with Characters, Props, Tiles, Structures and story presentation resources.', 'Use smooth camera travel and observation dwell; freeze/slow historical time when necessary rather than teleporting focus or skipping distant simultaneous events.', 'Support roof/occluder fade/cutaway based on active internal surface while preserving building exterior presentation from outside.', 'Apply day/night lighting and environmental ambient motion without changing semantic state.', 'Visually distinguish active presences, ghosts, selected ghosts, branch/fork markers, formal handoffs and ordinary contribution continuation.', 'True fullscreen hides the normal host header through App host state. Root Gate offers Playthings-styled exit/Verse switch and may zoom before requesting a host transition.', 'Inspector/focus surfaces reveal source artifact/story context and allow navigation back to the original material without requiring permanent lineage roads everywhere.']

## Scope

- ../experience/001-playthings-experience-contract-task.trace.md.
- ../time/001-playthings-historical-and-presentation-time-task.trace.md.
- ../world/001-playthings-deterministic-world-generation-task.trace.md.
- ../actors/001-playthings-identity-presence-and-action-task.trace.md.
- Future App Verse-host/fullscreen/switch contract.

## Dependencies

- Root and tavern fixtures remain understandable at normal and accelerated playback without text-first interpretation.
- Camera never skips required observations or makes its route appear to be historical causality.
- Fullscreen enter/exit and Root Gate switch requests use only the public host boundary.
- Mobile/responsive/performance budgets are measured with representative histories before acceptance.

## Done Criteria

- Prototype renderer only after state fixtures exist.
- Tune ghost/active contrast and camera dwell with user review.
- Measure browser performance and decide whether worker/offscreen preparation is warranted.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:M55QU_9fBIIriIuWmFZPdZp2SIA48SeBUanpIDJDX0w
