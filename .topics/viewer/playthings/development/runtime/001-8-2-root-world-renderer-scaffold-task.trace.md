# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 20:41:55
  - Trace: [001-8-app-adapter-and-master-publish-task.trace.md](001-8-app-adapter-and-master-publish-task.trace.md)
  - Origin:
    - [relative](001-8-app-adapter-and-master-publish-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 21:42:47
  - Authors: Anchor
  - Why: Continue renderer development without fabricating spatial semantics while external browser qualification is unavailable.
  - Summary: Bounded Root-only presentation renderer over the existing scene/navigation engine
  - Status: ready/local

---

# Root-only App renderer scaffold

## Objective

Exercise the existing qualified story, navigation, observation and scene engines through the public App/React adapter without waiting for the still-unqualified spatial companion/world compiler. The scaffold must remain visibly presentation-only and must not create Tiinex semantic authority.

## Done Criteria

- App can derive a deterministic Root-only navigation surface and locations from already-projected story records, then sample the existing scene plan by presentation time.
- Adding later history cannot move an already admitted record; presentation collisions and renderer budget omissions are explicit rather than semantically resolved.
- React can render the existing scene camera, actors and historically visible records in an SVG world window while retaining the existing portrait/frontier view.
- The scaffold reports that spatial capabilities are not applied and geometry is not qualified; exact tiles / structure / props companions remain outside this child task.
- Existing runtime/package/release/App-adapter qualification remains green in a local installation against the carried Core/App source snapshots.
- Dependency-equipped React/Vite/rendered-browser qualification remains an explicit external gate and is not replaced by fake dependencies.

## Scope

This is a bounded implementation child of the public App adapter continuation. It does not compile spatial companions, infer rooms/buildings from Tiinex lineage, certify graphics, complete fullscreen/Root Gate product behavior, publish npm, or modify the carried Core/App/Site Workspaces. Refactor Anchor retains refactoring Turn 2.

## Dependencies

- [Controlling App adapter continuation](001-8-app-adapter-and-master-publish-task.trace.md).
- [Runtime design invariants](001-1-playthings-runtime-design-invariants-decision.trace.md).
- [Recursive spatial demand planning](world/001-2-recursive-spatial-demand-task.trace.md).
- [Presentation and fullscreen plan](presentation/001-playthings-presentation-and-fullscreen-task.trace.md).

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-8-app-adapter-and-master-publish-task.trace.md](001-8-app-adapter-and-master-publish-task.trace.md)
  - Value: gM6l4-XVM3TTDafINxZDB-MYK-Ty9FvQwGRE6AdPQ7k

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: upV-x4xn07jKr256BBJy9K_iaK8cKiK34cZr4-vqx7w