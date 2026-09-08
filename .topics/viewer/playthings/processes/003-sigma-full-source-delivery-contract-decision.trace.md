# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:44:00
  - Trace: [Playthings Standalone Workspace And Companion Provider Revision](002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
  - Origin:
    - [relative](002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 18:05:26
  - Authors: Anchor; Sigma
  - Why: Preserve Sigma's explicit replacement-safe delivery requirement after the prior time-foundation overlay was manually committed.
  - Summary: Deliver one canonical Anchor-to-Sigma Handoff carrying the complete writable Playthings snapshot and clearly read-only dependency workspaces.
  - Status: accepted/process

---

# Sigma Full-Source Handoff Delivery Contract

## Decision

- State: accepted.
- Every source delivery to Sigma uses a Tiinex-manufactured Handoff package with From Anchor and To Sigma. No overlay, patch-only source ZIP, manually assembled carrier or mixed alternative transport is the normal delivery.
- The exact Tooling `humanOutput.primary.filename` and `normalInlineRouting.content` are emitted. The qualified Workspace title supplies the requested `tiinex-site-playthings` prefix; do not rename the resulting carrier manually.
- The writable Playthings payload is a complete source snapshot based on the latest explicitly supplied full source or Handoff, including unchanged source, graphics and lineage. Missing non-ignored paths may be interpreted as deletions by Sigma's replacement tool; therefore an incomplete workspace must block delivery.
- Before manufacture, compare all uploaded baseline paths against the outgoing source. Report every deliberate deletion. This slice authorizes no baseline source deletion.
- Preserve the repository's `.gitignore`. Do not ship ignored caches, build outputs, packages, credentials or local environment material. The receiving tool must preserve its destination-ignored files even if a payload contains a matching path. `.git` is outside source replacement.
- A conflict between destination state and the declared source baseline must be reviewed, not resolved by silently overwriting unrelated human edits.
- Business, Docs and Site may be carried as complete **read-only context**. Completeness does not authorize replacing these repositories. Only Playthings is an apply target for the current lane; Refactor Anchor owns host reconciliation.
- No clone/pull is used as an unrequested substitute for the user-supplied source. GitHub audit, when explicitly requested, remains distinct from the writable baseline.

## Basis

Sigma stated that the upcoming merge tool replaces non-ignored files and requested only full-source Sigma Handoffs. The current source input is `playthings.zip`, SHA-256 `bcddec7c37f709c09fbb92772f3b030d4587670c254a54f8a9c93b2b8cb262f0`. The prior overlay is historical delivery, not a permitted template for the next one.

## Qualification Gate

Package manufacture, archive roundtrip, selected route cold-start, exact decoded Playthings file-set comparison, unchanged dependency-workspace comparison, artifact integrity audit, relative-link checks and executable tests must all pass before delivery. Passing these does not prove the future VS Code merge tool is implemented or tested here.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Standalone Workspace And Companion Provider Revision](002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
  - Value: Uqpf9_oc3vWNebkw6IPSR7k30_Twd1xxdt0X-P8Uaso

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:QNu7i5DlZhiR_gJnn2467PAM5uUBynVbBOztn3-_ubk
