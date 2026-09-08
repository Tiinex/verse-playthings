# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [001-playthings-runtime-productization-task.trace.md](001-playthings-runtime-productization-task.trace.md)
  - Origin:
    - [relative](001-playthings-runtime-productization-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 20:41:55
  - Authors: Anchor
  - Why: Continue the supplied current source with explicit compatibility, release and qualification boundaries.
  - Summary: Public App adapter and master publication continuation
  - Status: active/local

---

# Public App adapter and master publication continuation

## Objective

Connect the existing headless Playthings runtime to the now-supplied App public host, preserve its semantic/design invariants, and continue through real browser qualification toward the planned world renderer.

## Done Criteria

- The ./app descriptor and ./react entrypoint exist and are consumed by Site through npm, with React supplied as a peer.
- The adapter uses Core/App-provided records and existing createStoryPlan/sampleStoryPlan; it does not parse Tiinex artifacts or invent world metadata.
- Data, empty/missing history and artifact-local PNG reads are covered by installed-package tests.
- Real pinned React/Vite build, rendered browser behaviour and manual product acceptance remain explicit gates.
- master-only release uses the single Core implementation, with owner-configured npm Trusted Publishing.

## Scope

The new history/portrait view is a bounded integration scaffold, not completion of the spatial/camera/actor/world plan. All existing 139 headless runtime tests remain. Site configuration changes are made by the Refactor workstream for this integration; a successor Playthings Anchor must keep Site/Core/App read-only except via an explicit coordinated Handoff.

## Dependencies

- [Refactor parity task](business::.topics/initiatives/001-3-6-3-playthings-parity-master-publishing-task.trace.md).
- [Public integration contract](../../../../../docs/APP-INTEGRATION.md).
- [Existing runtime design invariants](001-1-playthings-runtime-design-invariants-decision.trace.md).
- [Prior npm-readiness handoff](001-7-anchor-to-sigma-npm-release-readiness-handoff.trace.md) as historical context; the new master-only policy supersedes its GitHub Release trigger.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-playthings-runtime-productization-task.trace.md](001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: gM6l4-XVM3TTDafINxZDB-MYK-Ty9FvQwGRE6AdPQ7k