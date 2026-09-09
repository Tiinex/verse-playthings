# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 15:03:22
  - Trace: [001-turn-2-verse-playthings-integration-frontier.trace.md](../001-turn-2-verse-playthings-integration-frontier.trace.md)
  - Origin:
    - [relative](../001-turn-2-verse-playthings-integration-frontier.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 15:03:24
  - Authors: Anchor
  - Why: Playthings must not solve missing host capabilities by importing or owning Site internals.
  - Summary: Integrate Playthings through generic App/Site Verse-host contracts.
  - Status: ready/local

---

# Verse Playthings host-boundary integration

## Objective

Reconcile Playthings host requirements with the current generic App/Site Verse contract instead of relying on private host behavior.

## Done Criteria

- legacy host chrome/inertness, focus/scroll restoration, emergency exit and Verse switching are owned by the correct generic host boundary.
- Playthings-specific presentation remains inside the Verse package.
- multi-workspace presentation does not redefine Workspace, Verse or Parent semantics.
- missing upstream capabilities return a scoped blocker/change proposal rather than expanding Playthings authority.

## Scope

Playthings side of the App/Site host boundary.

## Dependencies

- Parent Verse Playthings Turn-2 task.
- `docs/TURN-2-HOST-BOUNDARY.md`.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-turn-2-verse-playthings-integration-frontier.trace.md](../001-turn-2-verse-playthings-integration-frontier.trace.md)
  - Value: KdYVzxYQ8TVCFsGmJSaCMruWmd38PPE42fsuLfC4WbA

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: -thSRuQMQpoj2oSohOL-5VaJk3wzkVL_0R1Qde8jMIo