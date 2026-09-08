# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/089427470f04336dfcc100c4dcf6289d51bf0291/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 13:40:00
  - Trace: [Playthings Standalone Tooling Workspace Compatibility Evidence](../development/repository/002-2-1-playthings-standalone-tooling-workspace-compatibility-evidence.trace.md)
  - Origin:
    - [relative](../development/repository/002-2-1-playthings-standalone-tooling-workspace-compatibility-evidence.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:44:00
  - Authors: Anchor; Sigma
  - Why: Revise the Playthings production process for standalone repository ownership so asset tooling, default companion storage, and Handoff emission no longer assume Site is the Playthings workspace.
  - Summary: Standalone Playthings Workspace and provider-oriented companion storage supplement the existing visual-production process without changing lineage-local provenance rules.
  - Status: accepted/local

---

# Playthings Standalone Workspace And Companion Provider Revision

## Decision

This revision supplements [Playthings Visual Production And Asset Lifecycle](001-playthings-visual-production-and-asset-lifecycle-process.trace.md) and [Playthings Co-Event Asset Dimension And Handoff Emission Revision](001-1-playthings-coevent-asset-dimension-and-handoff-emission-revision.trace.md) after repository extraction.

### Workspace ownership

- New active Playthings lineage and Playthings production tooling live in the standalone `Tiinex/playthings` Workspace.
- Historical artifacts may truthfully describe their former Site location; repository relocation alone does not rewrite their semantic history.
- Relative references that become invalid solely because of the split may be retargeted to explicit cross-workspace references and resealed transitively, with migration Evidence.

### Asset placement remains unchanged

- An asset that already exists in a Workspace is referenced in place; lineage does not duplicate it merely for locality.
- A genuinely new non-final asset created by a lineage event belongs beside that event and shares its exact numeric event dimension.
- A final default Playthings runtime graphic uses the `.playthings.` PNG namespace at the mirrored `src/schemas/...` path in the standalone Playthings repository.

### Mirrored path is not schema authority

Standalone Playthings does not need to copy a `.schema.md` file merely to store a default companion at its mirrored schema path.

The mirrored path is a provider/lookup convention only. Qualified artifact/schema identity and ancestry remain Tiinex/Core authority. Runtime companion discovery must therefore be provider-oriented rather than hard-coded to Site's filesystem.

Artifact-local companions remain owned by the user Workspace in which the artifact lives.

### Tooling root behavior

`tools/playthings/playthings-assets.mjs` must recognize the standalone Playthings Workspace entrypoint and may retain legacy Site Workspace compatibility for historical/maintenance use.

Standalone audit must still reject repository-root `reference/` staging and validate lineage-local co-event dimensions. It must not require a physical schema sibling solely because default companion bytes use a mirrored schema path.

### Handoff emission

The existing Tooling-owned human emission rule remains mandatory. Desired human filename prefixes must come from qualified Workspace/package identity presented to Tooling; do not manually rename an already-manufactured carrier.

For this repository line, the human carrier identity is presented as `Tiinex Site Playthings`, yielding the requested `tiinex-site-playthings-...handoff-package.zip` prefix through normal Tooling projection.

## Consequences

- The new repository can remain minimal during designer mode while still carrying all Playthings production provenance and tooling.
- Default companions can later be added without duplicating schema authority into Playthings.
- Site/Core integration can evolve independently until the qualified Core consumer contract exists.
- No runtime implementation or companion-capability expansion is implied by this process revision.

## Interpretation Limits

- Does Not Mean: the current six-channel graphics contract is permanently final; designer-mode companion capability work may revise it through a later explicit Decision.
- Does Not Mean: filesystem path becomes Tiinex semantic authority.
- Must Not Be Used To Claim: npm packaging, React integration, or runtime provider resolution is already implemented.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Standalone Tooling Workspace Compatibility Evidence](../development/repository/002-2-1-playthings-standalone-tooling-workspace-compatibility-evidence.trace.md)
  - Value: Ai-97bWWml18YktYthI-AqkGDASHYJLU96-H0lDyO-A

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:DT5NzSEeQOsEO67yJ9Jr5jncEWRBn29MFnYLfQyix78
