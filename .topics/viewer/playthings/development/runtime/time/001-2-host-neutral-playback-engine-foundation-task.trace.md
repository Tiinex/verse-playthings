# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:49:00
  - Trace: [Playthings Historical And Presentation Time](001-playthings-historical-and-presentation-time-task.trace.md)
  - Origin:
    - [relative](001-playthings-historical-and-presentation-time-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 17:01:00
  - Authors: Anchor; Sigma
  - Why: Turn the accepted elastic-playback laws into a small deterministic host-neutral engine before Core/App integration exists.
  - Summary: Implement and test historical/presentation time planning, simultaneous observation sets, bullet-time, sparse-history fast-forward, braking, pause and deterministic sampling from neutral event fixtures.
  - Status: active/implementation

---

# Host-Neutral Playthings Playback Engine Foundation

## Objective

- Implement pure ESM modules under `src/verses/playthings/runtime/time/` with no React, Site or Core imports.
- Accept neutral events shaped only by stable event identity and a qualified historical millisecond timestamp.
- Group equal historical timestamps into one observation set without claiming camera presentation order is historical causality.
- Slow historical time when dense events cannot fit a readable approach window; never accelerate actor/camera presentation merely to satisfy playback pace.
- Freeze historical time during observation while presentation time may continue.
- Make long inactive gaps enter explicit fast-forward and brake before the next historical anchor.
- Represent no-artifact state as live present time rather than inventing a historical beginning.
- Make deterministic sampling depend on presentation phase in addition to historical time.

## Scope

- Parent time Task and accepted Elastic Playback And Observation Decision.
- [Bounded implementation authorization](../001-4-bounded-host-neutral-foundation-implementation-authorization-decision.trace.md).
- Node-native executable fixtures/tests only; no package public API or host mount contract.

## Dependencies

- Existing runtime designer invariants remain authority.
- Pace multipliers, dwell values and curve constants are tuning defaults, not Tiinex semantic facts.
- The future Core adapter must be able to construct the neutral event shape without Playthings importing Core internals.

## Done Criteria

- Dense seconds-apart history visibly/simulatably slows rather than skips.
- Equal timestamps freeze at one observation set with deterministic presentation order explicitly marked non-historical.
- Month-scale gaps enter fast-forward and brake before the next anchor.
- Observation holds historical time while presentation advances.
- No event reaches observation/completion before its historical anchor.
- Pause stops presentation progression.
- Re-sampling the same plan and presentation phase is deterministic.
- No-artifact fixture follows live present time.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Historical And Presentation Time](001-playthings-historical-and-presentation-time-task.trace.md)
  - Value: I7CohXAJJy4pE2qnb9dNOx8cPCLxRG4iCeytAHORV6E

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:xFg0W7PpOf_8wOSRm__Y7-hbK5ovE4eR7z4LQ5Yf0H4
