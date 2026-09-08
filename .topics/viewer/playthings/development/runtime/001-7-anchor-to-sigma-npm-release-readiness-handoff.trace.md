# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 19:53:00
  - Trace: [npm Release And Trusted Publishing Readiness Evidence](architecture/001-2-1-npm-release-and-trusted-publishing-readiness-evidence.trace.md)
  - Origin:
    - [relative](architecture/001-2-1-npm-release-and-trusted-publishing-readiness-evidence.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 20:08:00
  - Authors: Anchor; Sigma
  - Why: Let Sigma land the complete release-readiness source and perform the account-level npm/GitHub bootstrap without receiving overlays or partial source.
  - Summary: Return complete replacement-safe Playthings source with guarded npm release automation and exact human setup frontier.
  - Status: ready/review

---

# npm Release Readiness — Anchor To Sigma

## Handoff Parties

- Purpose: review and optionally land complete Playthings release-readiness source, then perform account-level bootstrap/setup when desired
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Sigma
- To Kind: role
- To Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)

## Transfers

- complete-playthings-source
  - Transfer Kind: work-and-responsibility
  - Description: apply the complete Playthings Workspace snapshot; do not treat it as an overlay
  - Controlling Artifact: [Full source delivery contract](../../processes/003-sigma-full-source-delivery-contract-decision.trace.md)
  - Boundary: only Playthings is an apply target; retain destination .git and gitignored local files according to Sigma tooling

- npm-bootstrap-and-trust-setup
  - Transfer Kind: work
  - Description: follow RELEASING.md to create/verify the GitHub npm Environment, perform the one-time prerelease npm bootstrap, configure npm Trusted Publisher, then use the VS Code release task for normal releases
  - Controlling Artifact: [Release readiness evidence](architecture/001-2-1-npm-release-and-trusted-publishing-readiness-evidence.trace.md)
  - Boundary: Anchor performed no npm/GitHub account mutation and holds no publish credential

## Required Context

- master-plan
  - Material: bounded Playthings productization scope
  - Material Reference: [Master productization Task](001-playthings-runtime-productization-task.trace.md)
  - Purpose: larger product work remains open
  - Availability: available

- package-architecture
  - Material: package architecture and pending React/Core/App boundary
  - Material Reference: [Package architecture Task](architecture/001-playthings-package-runtime-architecture-task.trace.md)
  - Purpose: prevent release tooling from being mistaken for completed integration
  - Availability: available

- release-task
  - Material: exact release policy and remote-action limits
  - Material Reference: [Release readiness Task](architecture/001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
  - Purpose: release process authority
  - Availability: available

- release-evidence
  - Material: executable qualification and explicit limits
  - Material Reference: [Release readiness Evidence](architecture/001-2-1-npm-release-and-trusted-publishing-readiness-evidence.trace.md)
  - Purpose: technical qualification
  - Availability: available

- release-instructions
  - Material: human account setup and normal release procedure
  - Material Reference: [RELEASING.md](../../../../../RELEASING.md)
  - Purpose: Sigma setup and operation
  - Availability: available

- full-source-delivery
  - Material: replacement-safe source delivery invariant
  - Material Reference: [Full source delivery contract](../../processes/003-sigma-full-source-delivery-contract-decision.trace.md)
  - Purpose: complete source and apply-target boundary
  - Availability: available

## Reference Context

- writable-playthings
  - Material: complete Playthings Workspace
  - Material Reference: [Playthings Workspace](../../../../.workspaces/tiinex-playthings.workspace.md)
  - Purpose: sole apply target
  - Availability: available

- external-refactor
  - Material: latest supplied Refactor ownership boundary
  - Material Reference: [Core App Site sync](../repository/001-1-1-core-app-site-unblock-sync-topic.trace.md)
  - Purpose: pending public contracts and dependency ownership
  - Availability: available

## Retained Responsibilities

- engineering
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: reconcile bootstrap/release findings and actual Refactor Turn 1 when available
  - Boundary: no hidden npm credential or account authority is transferred to Anchor

- account-authority
  - Retained By: Sigma
  - Retained By Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)
  - Responsibility: npm/GitHub account authority, 2FA and final decision to publish any version
  - Boundary: tooling prepares and verifies but does not bypass human publishing authority

## Exclusions And Dependencies

- refactor-turn-1
  - Kind: unresolved-dependency
  - Description: real Core/App consumers, React adapter, companion provider integration and fullscreen remain pending
  - Responsible Party Or Role: Refactor Anchor

- registry-bootstrap
  - Kind: excluded-scope
  - Description: actual prerelease publish, npm Trusted Publisher configuration and first OIDC publish are external human/account actions and are not performed in this carrier
  - Responsible Party Or Role: Sigma

- frozen-context
  - Kind: excluded-scope
  - Description: Business, Docs and Site are complete read-only snapshots from the prior carrier, not updates to apply
  - Responsible Party Or Role: Sigma; Anchor

## Completion Expectation

- Signal Kind: return
- Signal Meaning: Sigma lands or rejects the complete source; when desired, reports bootstrap/trusted-publisher outcome or sends a later Tiinex Handoff back to Anchor
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Interpretation Limits

- Does Not Mean: delivery, landing, bootstrap publication, Trusted Publisher configuration, OIDC success, recipient acceptance, package production readiness, React/Viewer readiness, or completion of the parent productization Task.
- Must Not Be Used To Claim: npm/GitHub account authority, that Business/Docs/Site are apply targets, that a public release has occurred, or that package publication would constitute visual/product acceptance.
- Transport Limits: only Playthings is applicable; Business, Docs and Site are carried as read-only recovery context.

## Source Boundary

Input source was the complete Sigma-supplied `playthings(2).zip`, SHA-256 `efc53e9ad90c2776b11d0003f5b13ded57ddab9428b392f0f17aa43f3ad1de6e`. This turn introduces release infrastructure but deliberately performs no GitHub clone/fetch as a source reconstruction step and no remote write. The outgoing carrier must contain the complete Playthings Workspace, not only changed files. Business, Docs and Site remain read-only carried context from the prior qualified carrier.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [npm Release And Trusted Publishing Readiness Evidence](architecture/001-2-1-npm-release-and-trusted-publishing-readiness-evidence.trace.md)
  - Value: Bv9q-LE1Q0s3GP135br5ScVXbD2iCK0I18aTk5oKSRs

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:jJI9tS4ZXWNWRuSCqlDGKeIpIADZnpJ5BisGfWN50KE
