# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 23:13:41
  - Trace: [001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md](001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md)
  - Origin:
    - [relative](001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 23:15:55
  - Authors: Anchor
  - Why: Give Sigma a replacement-safe landing/test checkpoint while keeping npm publication and Refactor Turn 2 separate.
  - Summary: Complete Playthings renderer-cutover checkpoint for commit/push plus dependency-equipped source-set/browser qualification
  - Status: ready/local

---

# Multi-surface renderer checkpoint — Anchor to Sigma

## Handoff Parties

- Purpose: land the complete Playthings checkpoint that activates qualified multi-surface rendering behind a fail-closed Root fallback, then run the dependency-equipped whole-source-set/browser qualifier.
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Sigma
- To Kind: role
- To Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)

## Transfers

- complete-playthings-renderer-checkpoint
  - Transfer Kind: work
  - Description: apply the complete carried Playthings Workspace as the replacement-safe source checkpoint, then commit and push the Playthings repository.
  - Controlling Artifact: [Qualified multi-surface renderer Evidence](001-8-2-2-3-1-qualified-multi-surface-renderer-evidence.trace.md)
  - Boundary: Playthings is the only apply target. Preserve destination `.git` and normal gitignored local state; sibling Workspace snapshots are recovery/test context, not patches.

- source-set-browser-qualification
  - Transfer Kind: work
  - Description: after landing, run the dependency-equipped Core/App/Site/Playthings source-set qualifier from a workspace containing the four current repositories and return its JSON/browser-smoke result or exact blocker.
  - Controlling Artifact: [Qualified multi-surface renderer Task](001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md)
  - Boundary: use the repository-owned qualifier; do not replace an unavailable React/Vite/browser gate with module-only or synthetic PASS evidence.

## Required Context

- renderer-cutover-evidence
  - Material: exact local qualification, source bindings, cutover rules and open external gates.
  - Material Reference: [Qualified multi-surface renderer Evidence](001-8-2-2-3-1-qualified-multi-surface-renderer-evidence.trace.md)
  - Purpose: preserve what passed locally and what still requires dependency-equipped execution.
  - Availability: available

- playthings-workspace
  - Material: complete current Playthings source, tests, docs and lineage.
  - Material Reference: [Playthings Workspace](playthings::.topics/.workspaces/tiinex-playthings.workspace.md)
  - Purpose: sole writable/apply target.
  - Availability: available

- business-workspace
  - Material: roles and organizational context.
  - Material Reference: [Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: role/authority recovery context.
  - Availability: available

- docs-workspace
  - Material: canonical schemas and tooling context.
  - Material Reference: [Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: schema/tooling recovery context.
  - Availability: available

- core-workspace
  - Material: carried Core source snapshot.
  - Material Reference: [Core Workspace](core::.topics/.workspaces/tiinex-core.workspace.md)
  - Purpose: read-only recovery/source-set context only; use your current local Core repository for the requested live source-set test if newer.
  - Availability: available

- app-workspace
  - Material: carried App source snapshot.
  - Material Reference: [App Workspace](app::.topics/.workspaces/tiinex-app.workspace.md)
  - Purpose: read-only recovery/source-set context only; use your current local App repository for the requested live source-set test if newer.
  - Availability: available

- site-workspace
  - Material: carried Site source snapshot.
  - Material Reference: [Site Workspace](site::.topics/.workspaces/tiinex-site.workspace.md)
  - Purpose: read-only recovery/source-set context only; use your current local Site repository for the requested live source-set test if newer.
  - Availability: available

## Reference Context

- source-set-command
  - Material: repository-owned `docs/NPM-PUBLISH.md` qualification path: `node core/tools/qualify-source-set.mjs --core core --app app --site site --playthings playthings`, with Playwright/Chromium prerequisites described there.
  - Purpose: run the actual React/Vite/build/browser-smoke chain after the four current repositories are available locally.
  - Availability: available

- renderer-boundary
  - Material: `README.md`, `docs/APP-INTEGRATION.md`, world/scene docs and the cutover Evidence.
  - Purpose: `qualified-spatial` is active only behind exact capability/navigation/geometry gates; Root remains fallback and generated geometry remains presentation-only.
  - Availability: available

## Retained Responsibilities

- playthings-engineering
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: consume Sigma's source-set/browser result and continue live-snapshot continuity/visual renderer work.
  - Boundary: Anchor does not take Sigma npm/GitHub account authority.

- publication-flow
  - Retained By: Sigma
  - Retained By Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)
  - Responsibility: continue the independently repaired npm/publication flow according to the current repository/release state.
  - Boundary: this Handoff does not request, cancel, restart or claim npm publication.

- refactor-turn-2
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: the separate Refactor Anchor retains Core/App/Site refactoring Turn 2.
  - Boundary: Playthings delivery does not transfer or mutate that lane.

## Exclusions And Dependencies

- npm-publication
  - Kind: excluded-scope
  - Description: no npm publish, dist-tag operation, Trusted Publisher change, GitHub Release creation or OIDC assertion is requested by this checkpoint.
  - Responsible Party Or Role: Sigma

- rendered-browser
  - Kind: unresolved-dependency
  - Description: Anchor's runtime cannot resolve registry dependencies (`EAI_AGAIN`). Sigma is requested to run the real dependency-equipped source-set qualifier after landing the Playthings checkpoint.
  - Responsible Party Or Role: Sigma

- live-growth-continuity
  - Kind: unresolved-dependency
  - Description: candidate-to-active renderer cutover is implemented, but long-lived continuity across replacement snapshots whose settled demand footprints grow remains a later Playthings technical boundary.
  - Responsible Party Or Role: Anchor

## Completion Expectation

- Signal Kind: return
- Signal Meaning: Sigma reports the resulting Playthings commit/push observation and returns the full source-set/browser qualifier PASS receipt or the exact dependency/build/browser blocker without manufacturing a PASS.
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Interpretation Limits

- Does Not Mean: npm publication, Trusted Publisher success, final visual acceptance, semantic meaning of companion pixels, productization completion or Refactor Turn 2 completion.
- Must Not Be Used To Claim: package transport equals registry publication; generated rectangular geometry is Tiinex spatial truth; sibling Workspace snapshots are apply targets; or module-only checks substitute for rendered-browser execution.
- Transport Limits: apply/commit/push Playthings only. Core/App/Site/Business/Docs are carried for qualified recovery/context; the live source-set test should use Sigma's current repository checkouts where they are newer than the carried snapshots.

## Source Boundary

This carrier manufactures from the current qualified Playthings Workspace and carries complete source rather than an overlay. Requested Sigma actions are **COMMIT + PUSH + SOURCE-SET/BROWSER TEST**. npm publication remains a separate Sigma flow.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md](001-8-2-2-3-qualified-multi-surface-renderer-task.trace.md)
  - Value: mKQZlKrg61qy3dARaN_JwwPUdunemM3DD-rnQHhwAxY

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: 7mPfuocvqbPDT2ngMjoeFTS6GIQAWP3TV2IRTwp89W0