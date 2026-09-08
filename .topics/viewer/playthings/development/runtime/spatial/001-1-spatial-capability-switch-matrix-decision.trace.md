# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Spatial World Model](001-playthings-spatial-world-model-task.trace.md)
  - Origin:
    - [relative](001-playthings-spatial-world-model-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 15:48:59
  - Authors: Anchor; Sigma
  - Why: Lock an overlap-free spatial switch that generic artifacts can opt into using PNG companions alone.
  - Summary: Tiles and Structure form four exclusive spatial base types; Props is an independent modifier; Parent spatial context determines building-like versus room-like projection.
  - Status: accepted/design

---

# Spatial Capability Switch Matrix

## Decision

- State: accepted.
- Root is the special outer world surface and is not inferred from the ordinary switch.
- For an ordinary artifact, the exact active `tiles` and `structure` capabilities form exactly four mutually exclusive base projections:
  - Tiles false, Structure false: non-spatial artifact.
  - Tiles true, Structure false: walkable Surface.
  - Tiles false, Structure true: Structure/enclosure on the nearest containing Surface.
  - Tiles true, Structure true: Enclosed Surface/Container with its own walkable interior.
- `props` is independent of the base switch. It adds a persistent-object collection to whichever base projection is active, including a non-spatial artifact whose Props are placed in its resolved spatial home.
- Parent/spatial context changes presentation, not the base capability truth: a first-level Structure/Container on Root is building-like; a Structure on an internal Surface is room/partition-like; a Surface inside a Structure/Container is level/internal-surface-like; nested Containers remain recursively valid.
- A Parentless ordinary spatial artifact resolves against Root as its containing world context when loaded into the Verse, without claiming that Root was an explicit source Parent.
- Direct artifacts scoped to a container/surface but not to a nested spatial child remain in that parent's common/entry area if they require physical depiction. They are not assigned to an invented room.

## Basis

The switch makes moddability possible without hidden metadata, transparent-slot encoding or new Floor/Room schemas. The same exact companions can support a house, tavern, room, cave, ship or other recursive enclosure because Playthings does not need to assert those semantic labels.

## Consequences

- Spatial classifier can be a deterministic boolean switch plus context resolver.
- Layout/renderer may use building-like/room-like language internally as presentation classes but must not expose them as source facts when unqualified.
- Several sibling Surfaces can represent several internal levels visually, but semantic level numbering/order remains a separate unresolved spatial-layout rule.

## Interpretation Limits

This Decision does not say that a Structure is semantically a building or a nested Container is semantically a room. It only defines how Playthings is allowed to project exact spatial capabilities.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Spatial World Model](001-playthings-spatial-world-model-task.trace.md)
  - Value: trbvEvOS8Xakafc8i0Y_z2NvlUR9vA65N5vL_R47lsY

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:m9CO1g3uRpbZa8rpguNpZl3MhsyvCGttOqZ0JpFpLV8
