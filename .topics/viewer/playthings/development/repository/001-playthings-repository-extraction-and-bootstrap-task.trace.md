# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 01:50:00
  - Trace: [Playthings Refined Runtime Rebase — Anchor To Anchor](../001-3-anchor-to-anchor-playthings-refined-runtime-rebase-handoff.trace.md)
  - Origin:
    - [relative](../001-3-anchor-to-anchor-playthings-refined-runtime-rebase-handoff.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 13:20:00
  - Authors: Anchor; Sigma
  - Why: Split Playthings source ownership out of the Site Playthings branch before runtime implementation while preserving a clean, portable, full-workspace continuation point.
  - Summary: Bootstrap Tiinex/playthings as a minimal mirrored Workspace and transfer future Playthings authority there.
  - Status: active/local

---

# Playthings Repository Extraction And Bootstrap

## Objective

Create a new local `Tiinex/playthings` Workspace that initially contains only repository identity/legal files, Playthings lineage, and still-relevant Playthings tooling; preserve the committed Site Playthings branch as a frozen source baseline rather than future Playthings authority; and manufacture a full Tiinex Handoff package carrying Playthings, Site, Docs, and Business.

## Scope

- Migrate `.topics/viewer/playthings/` into the new Playthings Workspace without rewriting historical lineage merely because repository ownership changed.
- Carry `tools/playthings/` because graphics production and asset-lifecycle tooling remains relevant.
- Bootstrap only `README.md`, `LICENSE`, `NOTICE`, `.topics/`, and Playthings tooling; do not start runtime implementation or create npm/package configuration yet.
- Preserve the current committed Site Playthings source checkpoint as the exact Site baseline this extraction was designed from.
- Record the Refactor Anchor package-boundary feedback before freezing runtime import decisions.
- Produce one normal Tiinex Handoff transport with complete Playthings, Site, Docs, and Business Workspaces.

## Dependencies

- [Playthings Refined Runtime Rebase Handoff](../001-3-anchor-to-anchor-playthings-refined-runtime-rebase-handoff.trace.md).
- [Playthings Visual Production And Asset Lifecycle](../../processes/001-playthings-visual-production-and-asset-lifecycle-process.trace.md).
- Sigma-reviewed Site Playthings source checkpoint `tiinex-site-playthings-full-source-2026-09-08-r4.zip`, SHA-256 `402f5addd7c333d8f0cb622646b985f649b2aa998e14750816553a0bed033ae9`.
- Refactor Anchor feedback carried as `001-1-refactor-anchor-package-boundary-input-01.md`.
- Complete Docs and Business Workspace snapshots from the preceding qualified Handoff checkpoint.

## Constraints

- Do not import Site internals into future Playthings runtime design.
- Do not invent Playthings-specific semantic artifacts merely to describe world state.
- Do not hard-code companion discovery to Site's physical `src/schemas` path.
- Do not begin runtime implementation until the current designer/planning phase is accepted.
- Do not rewrite historical artifacts that truthfully describe Playthings while it still lived in Site.

## Done Criteria

- `Tiinex/playthings` local Workspace exists and audits cleanly.
- Existing Playthings lineage and relevant tooling are present in the new Workspace.
- Repository boundary and Core/Site integration constraints are recorded as current authority.
- Site is explicitly treated as a frozen baseline for this split, not future Playthings source ownership.
- A complete multi-workspace Tiinex Handoff package qualifies and cold-starts through its normal human transport surface.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Refined Runtime Rebase — Anchor To Anchor](../001-3-anchor-to-anchor-playthings-refined-runtime-rebase-handoff.trace.md)
  - Value: V7KP8WXOIYaBPfnWERqtUR1J4KX-2K4MQ91iTShvRAQ

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:-0DaXw40HAIydajw2XlN534LPtIdfNEFX2Cai69bAGc
