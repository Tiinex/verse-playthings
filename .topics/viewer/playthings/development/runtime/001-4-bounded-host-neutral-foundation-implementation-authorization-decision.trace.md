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
  - Created At: 2026-09-08 17:00:00
  - Authors: Anchor; Sigma
  - Why: Permit bounded implementation of Playthings-owned deterministic runtime mechanics while Refactor Anchor finishes the Core/App consumer surface, without cementing provisional integration contracts.
  - Summary: Authorize host-neutral time, semantic-fixture, world-math, pathfinding and graphics-compiler foundations while keeping Core/App/Site integration deferred.
  - Status: accepted/implementation-gate

---

# Bounded Host-Neutral Foundation Implementation Authorization

## Decision

- State: accepted.
- Playthings may now implement deterministic domain mechanics that consume a small Playthings-owned neutral projection and do not import Site internals, private Core/App paths, React host contracts or provisional companion-provider APIs.
- Initial authorized surfaces are historical/presentation time, observation scheduling, semantic fixtures, deterministic world mathematics, pathfinding and graphics/runtime compilation/validation.
- The neutral projection is an internal test/adapter boundary only. It must remain replaceable by a thin adapter from the future qualified `@tiinex/core` consumer contract.
- Site remains read-only. No Site integration, Verse mounting, fullscreen host wiring or physical schema companion promotion is authorized by this Decision.
- React/package public exports and dependency ranges remain gated on the Refactor Anchor consumer contract.

## Basis

Sigma explicitly authorized starting the independent Playthings machine while remaining flexible when Refactor Anchor returns with Turn 1. The accepted runtime plan already separates host-neutral deterministic mechanics from later integration work.

## Consequences

- Implementation descendants must carry executable fixtures/tests and distinguish tuning defaults from semantic invariants.
- A later Core/App response may change adapter and package boundaries without forcing rewrites of deterministic Playthings mechanics.
- Any implementation that discovers a semantic ambiguity must stop at the affected boundary and return to the relevant designer Task rather than silently inventing Core semantics.

## Interpretation Limits

- Does Not Mean: the designer plan is globally complete, Core/App integration is known, Site may be mutated, or the npm package public API is stable.
- Must Not Be Used To Claim: production readiness, host integration or acceptance of untested world/presentation behavior.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:qM3fX-ik-CBYWxy22fj4kZn3BQBkDa2_OIHSUkDFtBY
