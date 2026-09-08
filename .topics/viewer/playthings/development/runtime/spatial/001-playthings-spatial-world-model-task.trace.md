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
  - Created At: 2026-09-08 15:48:58
  - Authors: Anchor; Sigma
  - Why: Define where artifacts belong and how recursive world space is constructed without requiring semantic Place/Floor/Room schemas.
  - Summary: Qualify the recursive spatial primitives, home-resolution rules, nested surfaces/structures, direct/common-zone content and level ordering needed for a coherent one-scale world.
  - Status: planned/design

---

# Playthings Spatial World Model

## Objective

['Root is the outermost world surface and fallback spatial home when no nearer qualified spatial context exists.', 'Use exact Tiles/Structure capability switches plus Parent/spatial context to project surfaces, structures and enclosed surfaces recursively.', 'Keep outer and inner world at the same tile/world scale and use the same construction/navigation engine.', 'Define how direct children of a container that are not inside a nested room/surface remain scoped to the parent common/entry zone instead of being assigned a fabricated room.', 'Define nested spatial-home resolution and what happens for Parentless, unresolved-Parent and non-spatial ancestors.', 'Resolve ordering of several sibling internal surfaces/levels without pretending a semantic floor number exists when the source does not provide one.']

## Scope

- ../001-1-playthings-runtime-design-invariants-decision.trace.md.
- ../companions/001-1-companion-capability-and-resolution-decision.trace.md.
- Future qualified Parent/identity/resource-origin projections from Core.

## Dependencies

- Truth table and context table classify every Tiles/Structure/Props presence combination without overlap.
- Nested container examples include building-like, room-like, multi-surface and arbitrary recursive cases.
- Direct/common-zone content has a deterministic home rule that does not invent a child Place.
- Sibling-surface ordering has an explicit deterministic fallback and clearly states when it is presentation rather than source semantics.

## Done Criteria

- Stress-test generic Topic tavern with two internal surfaces and nested rooms.
- Define space-demand inputs used later by world layout.
- Produce executable spatial fixtures before assembler implementation.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: Y_GoYwJj9zAhikINEZaebCj7PmXl8KdbR1lsE3Cz_w0

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:trbvEvOS8Xakafc8i0Y_z2NvlUR9vA65N5vL_R47lsY
