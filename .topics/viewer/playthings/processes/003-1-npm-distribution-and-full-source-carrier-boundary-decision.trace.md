# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 18:05:26
  - Trace: [Sigma Full-Source Handoff Delivery Contract](003-sigma-full-source-delivery-contract-decision.trace.md)
  - Origin:
    - [relative](003-sigma-full-source-delivery-contract-decision.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 19:05:46
  - Authors: Anchor; Sigma
  - Why: Prevent package files filtering from accidentally becoming destructive source snapshot filtering.
  - Summary: Small installable npm distribution is never a replacement for full Sigma source delivery.
  - Status: accepted/process

---

# npm Distribution Versus Full Source Carrier

## Decision

- The npm tarball may exclude tests, lineage, authoring sources and tooling; it is a runtime distribution, not source authority.
- Every delivery to Sigma remains a canonical Anchor-to-Sigma Tiinex Handoff with all non-ignored source files, including unchanged files and .topics provenance. No overlay, tarball-only or manually renamed alternate carrier.
- npm pack/install output, caches and node_modules are ignored build material, not new lineage attachments or runtime companions.
- Current package stays private and publication-blocked. React and Core/App dependencies are added only when their actual consumers and public contracts are qualified.
- Candidate atlas validation does not authorize graphical promotion. Explicit source mapping recipes are ordinary build-time instructions; do not add required per-artifact Playthings JSON/Markdown metadata.

## Basis

Sigma requested complete replacement-safe Handoffs, confirmed the previous package was committed, authorized package/companion/world/scene work while waiting, and explicitly declined a standalone demo.

## Qualification

Check source-baseline completeness separately from npm pack membership. Compare every original PNG byte-for-byte. Compare read-only workspaces byte-for-byte and mark only Playthings applicable. Actual archive roundtrip and Sigma route qualification remain mandatory.

## Interpretation Limits

- Not Yet Used As: public Core/App contract, React host or graphical acceptance evidence.
- Must Not Be Treated As: runtime product completion or authorization to replace read-only context repositories.

- Does Not Prove: rendered user acceptance, production readiness, final semantic tile mapping or qualified external host integration.

- Does Not Mean: the complete Playthings product, React integration, public API or final graphics are accepted.
- Must Not Be Used To Claim: permission to change read-only workspaces or substitute npm distribution for full source.

An installable private development tarball does not mean React-ready Viewer integration, public npm release, stable consumer API or accepted final artwork.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Sigma Full-Source Handoff Delivery Contract](003-sigma-full-source-delivery-contract-decision.trace.md)
  - Value: QNu7i5DlZhiR_gJnn2467PAM5uUBynVbBOztn3-_ubk

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:J7o6Zl615EoE0AXvDFqouiF1NRSSKjsDKivBpP9Wly0
