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
  - Created At: 2026-09-08 15:49:02
  - Authors: Anchor; Sigma
  - Why: Turn qualified spatial capabilities into a stable living world that scales without hand-authored coordinates or graph-as-world geometry.
  - Summary: Design and implement deterministic layout, world growth, tile/structure compilation, navigation topology, multi-surface links and pathfinding after spatial/companion contracts are accepted.
  - Status: planned/design

---

# Playthings Deterministic World Generation

## Objective

['Use stable seeded pseudorandomness for layout/decor while preserving semantic relationships and minimizing unrelated repositioning when new material arrives.', 'Compute dynamic space demand from child spatial nodes, direct/common-zone content, props, likely simultaneous presences and navigation clearances.', 'Build outer and nested worlds through the same tile/structure primitives and coordinate scale.', 'Compile authored graphics deterministically into runtime Tiles/Structure slots; do not infer NESW topology from arbitrary generated slot order.', 'Represent walls, openings, physical door Props, roofs/cutaway surfaces, stairs and vertical links as pathfinding topology.', 'Provide pathfinding across rooms/surfaces/levels and deterministic fallback behavior when a requested route is temporarily blocked.']

## Scope

- ../001-1-playthings-runtime-design-invariants-decision.trace.md.
- ../companions/001-playthings-companion-capability-contract-task.trace.md.
- ../spatial/001-playthings-spatial-world-model-task.trace.md.
- ../time/001-playthings-historical-and-presentation-time-task.trace.md for lead-in/observation constraints.

## Dependencies

- Same qualified input and seed identity produce the same layout/topology.
- Adding one distant artifact does not unnecessarily reshuffle unrelated settled world regions.
- Generic Topic tavern can create a structure, two internal surfaces, five nested structures, door/stair connectivity and walkable routes without custom coordinates.
- Pathfinding and topology tests cover door state, stairs, multiple floors and nested containers.
- Runtime Tiles/Structure products are mechanically qualified outputs of deterministic compilation.

## Done Criteria

- Select layout algorithm and stability strategy after spatial fixtures exist.
- Design/benchmark worker-friendly preparation if large histories justify it.
- Build navigation/topology fixtures before renderer integration.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: Y_GoYwJj9zAhikINEZaebCj7PmXl8KdbR1lsE3Cz_w0

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:6GvTj6AVEVMCqUZpersOh4iCIrZWoBH1w4B6h12RYc0
