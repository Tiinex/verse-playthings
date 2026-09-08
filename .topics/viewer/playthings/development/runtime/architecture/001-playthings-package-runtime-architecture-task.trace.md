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
  - Created At: 2026-09-08 15:49:05
  - Authors: Anchor; Sigma
  - Why: Create a clean npm/React package boundary that can also mirror Site source hierarchy without letting package layout become domain semantics.
  - Summary: Lock and implement standalone package/module boundaries after the Refactor Anchor supplies qualified Core/App consumer contracts.
  - Status: planned/design

---

# Playthings Package Runtime Architecture

## Objective

['Target standalone Tiinex/playthings ownership and React-compatible public entrypoint(s); React/ReactDOM remain peer dependencies supplied by the host.', 'Consume public `@tiinex/core` projections/resource resolver and `@tiinex/app` Verse-host contracts only; no Site internals or private Core/App paths.', 'Keep mirrored `src/schemas/...` as a default companion provider convention, not schema authority or a requirement that schema Markdown be copied into Playthings.', 'Allow artifact-local workspace companions and package defaults to compose through registered providers.', 'Keep world/story/runtime modules host-neutral where practical so npm package versus copied-source placement does not alter behavior.', 'Evaluate worker/background preparation boundaries using measured scale needs rather than copying the old experiment wholesale.']

## Scope

- ../../repository/001-1-1-core-app-site-unblock-sync-topic.trace.md.
- Refactor Anchor Playthings-unblock consumer contract and locally packable package artifacts when delivered.
- ../companions/001-playthings-companion-capability-contract-task.trace.md.
- Accepted domain state/projection contracts from preceding Tasks.

## Dependencies

- Package installs/tests through the intended node_modules/tarball boundary without relative source imports.
- Public React entrypoint mounts through App host contract and receives qualified Core projections/providers.
- No duplicate React runtime, copied Core/App implementation or Site-private import exists.
- Same fixture behavior is demonstrated when package resources are resolved from mirrored defaults and workspace-local providers.

## Done Criteria

- Wait for actual Core/App consumer contract.
- Define public package exports and dependency ranges from qualified evidence.
- Add package scaffold only after designer gate approval.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:VQoGZXwRLb_7QE9qopup9PhGw39mdH6lQZv1ACtAhgY
