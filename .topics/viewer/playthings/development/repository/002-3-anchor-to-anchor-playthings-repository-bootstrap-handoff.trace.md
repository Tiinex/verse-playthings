# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:44:00
  - Trace: [Playthings Standalone Workspace And Companion Provider Revision](../../processes/002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
  - Origin:
    - [relative](../../processes/002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 13:46:00
  - Authors: Anchor; Sigma
  - Why: Transfer future Playthings ownership to the standalone Playthings Workspace while carrying the exact Site baseline and complete Docs/Business context needed to continue designer planning without depending on unstable Core implementation details.
  - Summary: Full-workspace Anchor-to-Anchor continuation from the standalone Tiinex/playthings bootstrap boundary.
  - Status: ready/local

---

# Playthings Repository Bootstrap — Anchor To Anchor

## Handoff Parties

- Purpose: continue Playthings designer/planning work from the new standalone Playthings Workspace, using Site only as the frozen source/host baseline and waiting to cement runtime imports until Core publishes a qualified consumer contract
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Anchor
- To Kind: role
- To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Transfers

- standalone-playthings-workspace
  - Transfer Kind: work-and-responsibility
  - Description: treat the carried Playthings Workspace as future Playthings source/lineage authority; it contains the migrated Playthings lineage, current production tooling, repository identity/legal files, and no runtime implementation yet
  - Controlling Artifact: [Playthings Repository Extraction And Bootstrap](002-playthings-repository-extraction-and-bootstrap-task.trace.md)
  - Boundary: do not move active Playthings development back into the carried Site Workspace merely because historical artifacts originated there

- package-boundary
  - Transfer Kind: work-and-responsibility
  - Description: maintain the accepted Core/Site/Playthings ownership split and provider-oriented companion lookup boundary while designer planning continues
  - Controlling Artifact: [Playthings Core / Site Package Boundary](002-1-playthings-core-site-package-boundary-decision.trace.md)
  - Boundary: no Site-internal runtime imports and no unstable Core-internal imports

- designer-frontier
  - Transfer Kind: work-and-responsibility
  - Description: continue discussing and stress-testing the Playthings experience, timeline, actor/presence, spatial companion-capability, pseudorandom world, pathfinding, fullscreen, and Root-Gate interaction model before materializing the runtime master Task/subtasks
  - Controlling Artifact: [Playthings Repository Bootstrap Evidence](002-2-playthings-repository-bootstrap-evidence.trace.md)
  - Boundary: current conversation-level design ideas are not automatically final companion/runtime contracts until Sigma approves the consolidated plan

## Required Context

- playthings-workspace
  - Material: standalone Tiinex Playthings Workspace entrypoint
  - Material Reference: [Tiinex Site Playthings Workspace](../../../../.workspaces/tiinex-playthings.workspace.md)
  - Purpose: current Playthings source/workspace authority and repository boundary
  - Availability: available

- repository-bootstrap-task
  - Material: repository extraction/bootstrap Task
  - Material Reference: [Playthings Repository Extraction And Bootstrap](002-playthings-repository-extraction-and-bootstrap-task.trace.md)
  - Purpose: scope, constraints, and done criteria for the source split
  - Availability: available

- package-boundary-decision
  - Material: accepted Core/Site/Playthings boundary Decision
  - Material Reference: [Playthings Core / Site Package Boundary](002-1-playthings-core-site-package-boundary-decision.trace.md)
  - Purpose: package ownership, provider boundary, and deferred runtime import authority
  - Availability: available

- bootstrap-evidence
  - Material: exact local repository bootstrap evidence
  - Material Reference: [Playthings Repository Bootstrap Evidence](002-2-playthings-repository-bootstrap-evidence.trace.md)
  - Purpose: source provenance, fidelity, and minimal-workspace state
  - Availability: available

- visual-production-process
  - Material: current standalone Playthings Workspace and companion-provider process revision
  - Material Reference: [Playthings Standalone Workspace And Companion Provider Revision](../../processes/002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
  - Purpose: current repository ownership, asset placement, mirrored default-companion, tooling-root, and Handoff-emission rules
  - Availability: available

- graphics-contract
  - Material: current named Playthings companion graphics contract lineage
  - Material Reference: [Playthings Named Sheet Companion Contract](../../graphics/001-playthings-named-sheet-companion-contract-decision.trace.md)
  - Purpose: existing graphics authority to be revised only through explicit later design decisions
  - Availability: available

- site-workspace
  - Material: complete frozen Site Workspace source baseline used for repository extraction
  - Material Reference: [Tiinex Site Workspace](site::.topics/.workspaces/tiinex-site.workspace.md)
  - Purpose: host/source baseline and historical origin; not future Playthings source ownership
  - Availability: available

- docs-workspace
  - Material: complete Tiinex Docs Workspace
  - Material Reference: [Tiinex Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: schema and Tiinex artifact-contract authority
  - Availability: available

- business-workspace
  - Material: complete Tiinex Business Workspace
  - Material Reference: [Tiinex Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: Anchor/Sigma roles and coordination/process context
  - Availability: available

## Retained Responsibilities

- remote-repository-bootstrap
  - Retained By: Sigma
  - Responsibility: create/review/commit/push the remote `Tiinex/playthings` repository when desired
  - Boundary: local bootstrap and Handoff manufacture do not imply remote Git mutation

- core-consumer-contract
  - Retained By: Refactor Anchor
  - Responsibility: finish Core extraction and later provide the stable public consumer surface Playthings should import
  - Boundary: Playthings planning may proceed, but implementation must not guess unstable export paths

- runtime-plan-approval
  - Retained By: Sigma; Anchor
  - Responsibility: consolidate and approve the designer-mode runtime plan before creating the master runtime Task/subtask tree
  - Boundary: no planning artifact explosion before the experience/spatial/timeline model is considered solid

## Exclusions And Dependencies

- no-site-internal-dependency
  - Kind: excluded-scope
  - Description: Playthings runtime must not depend on Site internals or `TiinexApp`
  - Responsible Party Or Role: Anchor

- no-runtime-bootstrap-yet
  - Kind: excluded-scope
  - Description: do not add package manifests, React runtime source, mirrored schema companions, or implementation scaffolding merely to make the new repo look active before planning is accepted
  - Responsible Party Or Role: Anchor

- no-path-semantic-authority
  - Kind: excluded-scope
  - Description: mirrored repository paths and companion source locations are lookup/provider conventions, not Tiinex semantic authority
  - Responsible Party Or Role: Anchor

## Completion Expectation

- Signal Kind: none
- Signal Meaning: no completion-facing signal is required; the next Anchor continues the designer/planning phase from the standalone Playthings Workspace
- Return To: Sigma
- Return To Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)

## Reference Context

- refactor-anchor-source
  - Material: exact informal Refactor Anchor reply used to qualify the package boundary
  - Material Reference: [Refactor Anchor package-boundary input](002-1-refactor-anchor-package-boundary-input-01.md)
  - Purpose: full wording behind the accepted package-boundary synthesis
  - Availability: available

## Interpretation Limits

- Does Not Mean: the Core consumer API, npm export names, final companion matrix, runtime plan, or fullscreen host contract has already been implemented.
- Must Not Be Used To Claim: remote repository publication, Site/Core merge completion, or runtime acceptance.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Standalone Workspace And Companion Provider Revision](../../processes/002-playthings-standalone-workspace-and-companion-provider-revision.trace.md)
  - Value: DT5NzSEeQOsEO67yJ9Jr5jncEWRBn29MFnYLfQyix78

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:py-9LefD7CdZcYkdwNnrbr8yrYxkLVyDap9Cxdi7T6k
