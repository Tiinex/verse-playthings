# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/089427470f04336dfcc100c4dcf6289d51bf0291/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 13:31:00
  - Trace: [Playthings Repository Bootstrap Evidence](001-2-playthings-repository-bootstrap-evidence.trace.md)
  - Origin:
    - [relative](001-2-playthings-repository-bootstrap-evidence.trace.md)
- Current
  - Current Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/089427470f04336dfcc100c4dcf6289d51bf0291/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 13:40:00
  - Authors: Anchor; Sigma
  - Why: Record and correct the Playthings asset tooling assumption that its Workspace root must be a Site Workspace, which became invalid immediately after the standalone repository extraction.
  - Summary: Playthings asset tooling now recognizes standalone Playthings Workspaces and mirrored default-companion paths without requiring copied schema authority.
  - Status: accepted/local

---

# Playthings Standalone Tooling Workspace Compatibility Evidence

## Preserved Material

- Material Description: `tools/playthings/playthings-assets.mjs` before/after standalone Workspace compatibility correction and its resulting audit output.
- Material Kind: tooling correction evidence.
- Material Reference: `tools/playthings/playthings-assets.mjs` in the current Playthings Workspace.
- Represented Subject: standalone repository root discovery and final default-companion path handling.

## Preservation Act

- Preservation Method: execute the migrated asset audit from the standalone Playthings Workspace, preserve the observed fail-closed error, update only Workspace/path assumptions, then re-run syntax and asset audits.
- Preservation Time Or State: after repository extraction and before final full-workspace Handoff manufacture.
- Actor: Anchor.
- Capture Conditions: no graphics or lineage source bytes were modified by the tooling audit itself.

## Provenance

- Known Source: migrated `tools/playthings/playthings-assets.mjs` from the accepted Site checkpoint.
- Preservation Basis: the first standalone invocation returned `site-workspace-root-not-found`, directly proving that the migrated tool still encoded a Site-only repository assumption.
- Provenance Limits: future companion types and runtime capability semantics remain designer-phase decisions and were not expanded by this correction.

## Fidelity And Loss

- Fidelity Notes: asset placement rules, co-event dimension checks, and `reference/` rejection remain intact.
- Known Losses: none in retained tooling capability; Site-only error wording/root detection was intentionally replaced.
- Transformation: Workspace root detection now accepts `tiinex-playthings.workspace.md` before legacy `tiinex-site.workspace.md`; standalone promotion may target a mirrored `src/schemas/.../*.schema.md` path convention even when the schema file itself is not copied into Playthings; standalone audit does not require a physical schema sibling solely to store a default companion.
- Uncertainty: actual runtime/provider registration API is not implemented yet.

## Custody Or Storage Boundary

- Storage Or Custody State: durable Playthings tooling source.
- Reuse Boundary: use from either standalone Playthings or legacy Site Workspaces; do not infer schema semantic authority from mirrored paths.
- Retention: durable.
- Permission Boundary: local source correction only; no npm/Git publication implied.

## Supported Claim Or Question

- Supported Claim Or Question: whether Playthings production tooling can operate from the standalone repository without reintroducing Site as its implicit workspace root or forcing schema-authority duplication.
- Evidence Role: tooling portability qualification.
- Target Artifact: `tools/playthings/playthings-assets.mjs`.
- Review Context: repository split bootstrap.

## Evidence Material

- Material: corrected `tools/playthings/playthings-assets.mjs` and standalone audit result.
- Material Kind: JavaScript tooling source plus local execution result.
- Description: standalone asset audit returns `status: clean`, `errors: 0`, `findings: 0`; `node --check` succeeds.
- Attachment Reference: none; corrected tool is carried directly in the Playthings Workspace.

Observed pre-correction error: `site-workspace-root-not-found`.

Observed post-correction rules retain existing-asset reference-in-place and lineage-local non-final placement while expressing final default products as mirrored `src/schemas` `.playthings.` PNGs whose schema authority may be external.

## Preservation And Fidelity

- Preservation State: corrected tooling source carried in-place in the standalone Workspace.
- Fidelity Notes: graphics bytes and Tiinex lineage artifacts were not transformed by this tooling correction.
- Known Losses: Site-specific root error naming/assumption only.
- Transformation: JavaScript source correction plus validation run.
- Representation Limits: this qualifies tooling repository portability, not future runtime companion resolution implementation.
- Storage Boundary: `tools/playthings/` in the standalone Playthings Workspace.

## Interpretation Limits

- Does Not Prove: final companion capability matrix, runtime provider API, npm packaging, or Core consumer API.
- Not Yet Used As: runtime acceptance evidence.
- Must Not Be Treated As: permission to create schema copies merely to satisfy a mirrored companion path.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Repository Bootstrap Evidence](001-2-playthings-repository-bootstrap-evidence.trace.md)
  - Value: mtnc_Am9V3bvE3hFNM3afsEFM7PtCJknXQfy3ThOHVU

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:fIiw70ClYSIow7nQosJGV8wNBerAMKZRAek9WnnvNmw
