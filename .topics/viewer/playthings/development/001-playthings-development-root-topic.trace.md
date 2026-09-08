# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 01:31:00
  - Trace: [Playthings Runtime Productization Epic](https://github.com/Tiinex/business/blob/0b90dc2f244a8a8881928d4aa0e2fb7568227389/.topics/initiatives/playthings/001-playthings-runtime-productization-epic.trace.md)
  - Origin:
    - [git + browse](https://github.com/Tiinex/business/blob/0b90dc2f244a8a8881928d4aa0e2fb7568227389/.topics/initiatives/playthings/001-playthings-runtime-productization-epic.trace.md)
- Current
  - Current Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 01:31:00
  - Authors: Anchor; Sigma
  - Why: Establish one durable standalone Playthings development root beneath the Business Playthings Runtime Productization Epic after reducing the older Site/Viewer-root experimental lineage.
  - Summary: Standalone Playthings development root for designer, companion, runtime, graphics-adjacent, and package productization work.
  - Status: active/local

---

# Playthings Development Root

## Purpose

All new Playthings development lineage belongs under `.topics/viewer/playthings/` rather than directly under `.topics/viewer/`.

This root owns current Playthings development provenance while graphics source lineage and production-process lineage remain in their dedicated sibling folders. Business initiative continuity is carried by the Playthings Project and Runtime Productization Epic rather than by Site repository ownership.

## Active Structure

```text
.topics/viewer/playthings/
├─ development/
├─ graphics/
└─ processes/
```

The old Viewer-root iteration history has been reduced into a compact Evidence under `development/`; it is not re-copied into an archive folder.

## Boundary

This Topic organizes Playthings development provenance only. Final schema-bound runtime companions will live in the mirrored `src/schemas/...` provider hierarchy when promoted. Runtime implementation is intentionally absent until the accepted planning gates authorize it; Site remains an external read-only host baseline for this development lane.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization Epic](https://github.com/Tiinex/business/blob/0b90dc2f244a8a8881928d4aa0e2fb7568227389/.topics/initiatives/playthings/001-playthings-runtime-productization-epic.trace.md)
  - Value: sJcu87wImZn2yW6VqhhfKHM7m02m5xGBdYMl3Rc1NwI

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:IVm3d17l__q2YY0dO99o9Zo0JyXbglzONNbWF4Kou9M
