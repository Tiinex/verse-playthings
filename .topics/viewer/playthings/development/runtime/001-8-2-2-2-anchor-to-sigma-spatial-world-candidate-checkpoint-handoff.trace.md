# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 22:34:16
  - Trace: [001-8-2-2-qualified-spatial-world-candidate-task.trace.md](001-8-2-2-qualified-spatial-world-candidate-task.trace.md)
  - Origin:
    - [relative](001-8-2-2-qualified-spatial-world-candidate-task.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 22:36:01
  - Authors: Anchor
  - Why: Give Sigma a replacement-safe commit/push checkpoint without conflating source landing with the independently running npm publication flow.
  - Summary: Complete Playthings spatial-world candidate checkpoint for commit and push only; npm/browser gates remain separate
  - Status: ready/local

---

# Spatial-world candidate checkpoint — Anchor to Sigma

## Handoff Parties

- Purpose: land the complete Playthings checkpoint containing qualified exact-companion spatial projection and a bounded multi-surface world candidate while preserving the Root renderer boundary.
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Sigma
- To Kind: role
- To Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)

## Transfers

- complete-playthings-checkpoint
  - Transfer Kind: work
  - Description: apply the complete carried Playthings Workspace as the replacement-safe source checkpoint, then commit and push the Playthings repository.
  - Controlling Artifact: [Qualified spatial-world candidate Evidence](001-8-2-2-1-qualified-spatial-world-candidate-evidence.trace.md)
  - Boundary: Playthings is the only apply target. Preserve destination `.git` and normal gitignored local state according to Sigma tooling; do not treat sibling Workspace snapshots as patches.

- commit-and-push-signal
  - Transfer Kind: work
  - Description: COMMIT + PUSH the landed Playthings checkpoint and return the resulting repository/commit observation when convenient.
  - Controlling Artifact: [Qualified spatial-world candidate Task](001-8-2-2-qualified-spatial-world-candidate-task.trace.md)
  - Boundary: this Handoff does not request npm publish, Trusted Publisher changes, GitHub release creation or browser acceptance execution.

## Required Context

- candidate-evidence
  - Material: exact local qualification, source bindings and open gates.
  - Material Reference: [Qualified spatial-world candidate Evidence](001-8-2-2-1-qualified-spatial-world-candidate-evidence.trace.md)
  - Purpose: preserve what passed and what remains unclaimed.
  - Availability: available

- playthings-workspace
  - Material: complete current Playthings source, tests, docs and lineage.
  - Material Reference: [Playthings Workspace](playthings::.topics/.workspaces/tiinex-playthings.workspace.md)
  - Purpose: sole writable/apply target for this transfer.
  - Availability: available

- business-workspace
  - Material: roles and organizational context.
  - Material Reference: [Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: role/authority recovery context.
  - Availability: available

- docs-workspace
  - Material: canonical schema/tooling context.
  - Material Reference: [Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: schema recovery context.
  - Availability: available

- core-workspace
  - Material: carried Core source snapshot.
  - Material Reference: [Core Workspace](core::.topics/.workspaces/tiinex-core.workspace.md)
  - Purpose: read-only recovery and qualification context only.
  - Availability: available

- app-workspace
  - Material: carried App source snapshot.
  - Material Reference: [App Workspace](app::.topics/.workspaces/tiinex-app.workspace.md)
  - Purpose: read-only recovery and qualification context only.
  - Availability: available

- site-workspace
  - Material: carried Site source snapshot.
  - Material Reference: [Site Workspace](site::.topics/.workspaces/tiinex-site.workspace.md)
  - Purpose: read-only recovery and qualification context only.
  - Availability: available

## Reference Context

- renderer-boundary
  - Material: `README.md`, `docs/APP-INTEGRATION.md` and `src/verses/playthings/runtime/world/README.md`.
  - Purpose: active React renderer is still the Root scaffold; `spatialCandidate` is separate qualified geometry/navigation and `semanticPixelsQualified` remains false.
  - Availability: available

## Retained Responsibilities

- playthings-engineering
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: continue candidate → active multi-surface renderer/camera work after the source checkpoint is landed.
  - Boundary: Anchor does not take Sigma npm/GitHub account authority.

- publication-flow
  - Retained By: Sigma
  - Retained By Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)
  - Responsibility: continue the independently running npm publication flow and return actual publication evidence separately.
  - Boundary: this checkpoint makes no registry/OIDC claim and does not alter that flow.

- refactor-turn-2
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: the separate Refactor Anchor retains Core/App/Site refactoring Turn 2.
  - Boundary: Playthings delivery does not transfer or mutate the refactor lane.

## Exclusions And Dependencies

- npm-publication
  - Kind: excluded-scope
  - Description: no npm publish, dist-tag operation, Trusted Publisher setup, GitHub Release creation or OIDC assertion is requested by this Handoff.
  - Responsible Party Or Role: Sigma

- rendered-browser
  - Kind: unresolved-dependency
  - Description: dependency-equipped React/Vite rendered-browser acceptance remains open and is not requested in this commit/push checkpoint.
  - Responsible Party Or Role: Anchor; Sigma

- renderer-cutover
  - Kind: unresolved-dependency
  - Description: qualified spatial candidate is not yet the active renderer; multi-surface camera/presentation continuity remains the next Playthings technical boundary.
  - Responsible Party Or Role: Anchor

## Completion Expectation

- Signal Kind: return
- Signal Meaning: Sigma reports that the complete Playthings checkpoint was landed and gives the resulting commit/push observation, or reports a landing conflict without partially inventing a merge.
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Interpretation Limits

- Does Not Mean: npm publication, rendered-browser acceptance, final renderer acceptance, semantic meaning of companion pixels, parent productization completion or Refactor Turn 2 completion.
- Must Not Be Used To Claim: package transport equals registry publication; rectangular geometry is Tiinex semantic truth; sibling Workspaces are apply targets; or Sigma should interrupt/restart the independent npm flow because of this Handoff.
- Transport Limits: apply/commit/push Playthings only. Core/App/Site/Business/Docs are carried for qualified recovery/context, not as source deltas to land.

## Source Boundary

This carrier must manufacture from the current qualified Playthings Workspace after the new Task/Evidence are sealed. It carries complete source rather than an overlay. The checkpoint requests **COMMIT + PUSH only**; publication and browser testing remain separate future signals.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-8-2-2-qualified-spatial-world-candidate-task.trace.md](001-8-2-2-qualified-spatial-world-candidate-task.trace.md)
  - Value: iw0cnNwirOr3NHrq2rhee8n15gs2WAi8Q3W_-xfATjQ

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: XM0RcWRYmsoV4OApAHSuQOINQHY5fieseqoEzaKhti4