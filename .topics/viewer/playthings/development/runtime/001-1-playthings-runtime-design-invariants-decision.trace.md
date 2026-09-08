# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Runtime Productization](001-playthings-runtime-productization-task.trace.md)
  - Origin:
    - [relative](001-playthings-runtime-productization-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 15:48:52
  - Authors: Anchor; Sigma
  - Why: Lock the high-confidence laws that every later Playthings designer and implementation Task must preserve.
  - Summary: Playthings projects qualified Tiinex truth through deterministic presentation; presentation may vary, semantic claims may not.
  - Status: accepted/design

---

# Playthings Runtime Design Invariants

## Decision

- State: accepted.
- Decision: the following invariants govern the Playthings runtime plan unless a later explicit Decision supersedes a specific item.

1. Playthings is a projection, not semantic authority. It may invent stable placement, decor, camera choreography and ambient motion; it must not invent authorship, success, responsibility, relationships, occurrence, acceptance or lineage.
2. Artifact Parent Lineage is the primary origin/branch model. Filename/path lineage may locate source material but does not determine story causality or spatial ownership merely because files move together.
3. Artifact-declared historical timestamps govern artifact introduction/replay when qualified. Host filesystem mtime/ctime never silently overrides the artifact's declared time. Schema-qualified occurrence time may separately govern a depicted Event and must not be conflated with artifact introduction.
4. Historical time and presentation time are separate. Historical time may slow or freeze while camera, navigation and animation continue so playback does not skip meaningful transitions.
5. Siblings prove branching, not simultaneous execution. Multiple presences may depict multiple active story frontiers without claiming multiple real people or concurrent work unless the source supports that claim.
6. Explicit schema-qualified actor semantics such as Participants or Handoff From/To outrank Authors when deciding who a scene depicts. Authors may depict contribution, but do not automatically prove responsibility or task execution.
7. A formal Handoff is visually distinct from an author/participant change without Handoff. The latter is informal continuation/succession and must not be shown as an explicit transfer ceremony.
8. A new sibling from an older common ancestor leaves an echo at the previous frontier; the active presence backtracks to the common ancestor, marks a fork there and continues the new branch. This movement is present-time narrative navigation, not historical time travel.
9. Identity/character-specific resources are timeline-gated. Before an identity or visual subject is qualified as known at the playhead, use a compatible fallback rather than retroactively revealing later knowledge.
10. Root and nested spaces use one world engine, one scale model and the same navigation/rendering primitives. There is no separate miniature outer map.
11. Spatial capability comes from exact resource presence, not ancestor/Root fallback artwork. Inherited artwork can style a capability that is already active; it cannot silently turn every artifact into a room, surface or prop collection.
12. Stable pseudorandomness may vary non-semantic presentation but must reproduce from stable qualified inputs and should minimize unrelated world movement when new material is added.
13. Pathfinding is foundational. Doors/passages and stairs/vertical links are traversable world topology rather than decorative teleport effects.
14. User world moddability must work through ordinary artifacts plus local/default PNG companions. Playthings does not require Floor, Room or Place schemas merely to make a spatial projection possible.
15. Fullscreen Playthings is an App/Site host state requested through an explicit host boundary. Root Gate may present exit/Verse-switch/create affordances and animate them, but cannot confer transition/write authority itself.
16. The old Site experiment is evidence and observation material only. Useful algorithms may be re-learned; its architecture is not a migration constraint.

## Basis

These rules consolidate the accepted conversation direction, the semantic/event designer pass, the standalone repository boundary and the Refactor Anchor Core/App ownership sync. They intentionally separate what the source says from how Playthings makes it legible.

## Consequences

- Domain Tasks can be implemented independently without redefining the product's semantic safety boundary.
- Tests must label arbitrary presentation order and pseudo-random layout as such rather than treating them as causal truth.
- Any future proposal that needs hidden Playthings metadata or a new semantic schema must first show why ordinary Tiinex material plus resource capabilities cannot represent the need.

## Open Boundary

Exact Core/App export names, provider APIs, asset append mechanics, multiple-level ordering and final performance budgets remain outside this Decision until qualified evidence exists.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](001-playthings-runtime-productization-task.trace.md)
  - Value: Y_GoYwJj9zAhikINEZaebCj7PmXl8KdbR1lsE3Cz_w0

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:lzJJ9-zoMNyEF3FP0Pa1uq6YukELacismWMZQdKa6xM
