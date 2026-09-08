# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:49:05
  - Trace: [Playthings Package Runtime Architecture](001-playthings-package-runtime-architecture-task.trace.md)
  - Origin:
    - [relative](001-playthings-package-runtime-architecture-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 18:47:54
  - Authors: Anchor; Sigma
  - Why: Make the tested headless source installable through an actual npm tarball without inventing a React/App host API.
  - Summary: Bounded local npm package boundary while Refactor Turn 1 is pending.
  - Status: completed/bounded-qualification

---

# Local npm Package Boundary

## Objective

Make the tested headless source installable through an actual npm tarball without inventing a React/App host API.

## Scope

- Add a private development package with explicit browser-safe and Node-only entrypoints.
- Keep mirrored source paths; do not copy Core/App or add a fake React export.
- Test npm pack plus offline install in a separate consumer directory without symlinks.
- Document current versus planned public surface for humans.

## Dependencies

- Latest supplied complete carrier 006-1-1-1-1, reported committed by Sigma; no unrequested GitHub checkout.
- Existing 87 passing headless runtime tests.
- Current accepted design invariants and bounded implementation authorization.
- Sigma explicitly authorized package/companion/world/scene work while waiting; this advances the headless subset only, not the unfinished host integration gate.

## Done Criteria

- New adversarial fixtures and previous regressions pass.
- Public boundaries and unsupported cases are documented; no false completion of the parent productization Task.
- All original source remains present; original images and read-only context workspaces remain byte-identical.
- Evidence records actual results and open gates before one complete Anchor-to-Sigma carrier is emitted.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Package Runtime Architecture](001-playthings-package-runtime-architecture-task.trace.md)
  - Value: VQoGZXwRLb_7QE9qopup9PhGw39mdH6lQZv1ACtAhgY

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:cH_EBqhFLVq_GaZPJVHOA0xE-VCYRkuXJek1vo6kTS4
