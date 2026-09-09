# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 23:50:22
  - Trace: [001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md](001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md)
  - Origin:
    - [relative](001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-09 00:02:36
  - Authors: Anchor
  - Why: Give Sigma one replacement-safe checkpoint with explicit browser and human acceptance actions while keeping publication and sibling-repo authority separate.
  - Summary: Complete Playthings immersive/truthful checkpoint for commit, push, real browser qualification and first Sigma experience test
  - Status: ready/local

---

# Immersive Playthings experience checkpoint — Anchor to Sigma

## Handoff Parties

- Purpose: land the complete Playthings-only immersive/truthful checkpoint, run the real dependency-equipped browser path, then perform the first bounded human Playthings Verse experience test.
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Sigma
- To Kind: role
- To Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)

## Transfers

- complete-playthings-immersive-checkpoint
  - Transfer Kind: work
  - Description: apply the complete carried Playthings Workspace as the replacement-safe source checkpoint, then commit and push Playthings.
  - Controlling Artifact: [Immersive truthful Sigma-test Evidence](001-8-2-2-3-3-1-immersive-truthful-sigma-test-evidence.trace.md)
  - Boundary: Playthings is the only apply target. Preserve destination `.git`, credentials and ordinary ignored local state; carried sibling Workspaces are read-only recovery/context.

- dependency-equipped-browser-qualification
  - Transfer Kind: work
  - Description: with current local Core/App/Site/Playthings repositories, run the repository-owned full source-set qualifier including React/Vite build and real Chromium smoke. Return its JSON receipt or exact blocker.
  - Controlling Artifact: [Immersive truthful Sigma-test Task](001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md)
  - Boundary: do not substitute module-graph/headless checks for the real browser gate. The new Playthings UI preserves the existing Site smoke accessibility contract for Back to Viewer, Fullscreen, History position and declared-historical-moment progress.

- sigma-immersive-experience-test
  - Transfer Kind: work
  - Description: after the browser qualifier is green, manually enter Playthings from Viewer using ordinary Workspace material and judge the immersive Verse, lineage-time truth, companion depiction and Root Gate return path.
  - Controlling Artifact: [Immersive truthful Sigma-test Task](001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md)
  - Boundary: this is presentation/experience acceptance. Do not interpret generated layout as Tiinex semantic spatial truth or pre-discovered runtime schemas as story discoveries.

## Required Context

- immersive-test-evidence
  - Material: exact local qualification, source hashes, dynamic schema-provider proof, immersive boundary and external browser blocker.
  - Material Reference: [Immersive truthful Sigma-test Evidence](001-8-2-2-3-3-1-immersive-truthful-sigma-test-evidence.trace.md)
  - Purpose: preserve exactly what passed locally and what still requires Sigma/browser evidence.
  - Availability: available

- playthings-workspace
  - Material: complete current Playthings source, tests, docs and lineage.
  - Material Reference: [Playthings Workspace](playthings::.topics/.workspaces/tiinex-playthings.workspace.md)
  - Purpose: sole writable/apply target.
  - Availability: available

- business-workspace
  - Material: current roles and organizational/project context.
  - Material Reference: [Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: role/authority recovery context.
  - Availability: available

- docs-workspace
  - Material: canonical Tiinex semantics and schema/tooling context.
  - Material Reference: [Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: truth/schema recovery context.
  - Availability: available

- core-workspace
  - Material: carried Core source snapshot.
  - Material Reference: [Core Workspace](core::.topics/.workspaces/tiinex-core.workspace.md)
  - Purpose: read-only recovery context; for live browser qualification use Sigma's current Core checkout when newer.
  - Availability: available

- app-workspace
  - Material: carried App source snapshot and Verse host contract.
  - Material Reference: [App Workspace](app::.topics/.workspaces/tiinex-app.workspace.md)
  - Purpose: read-only recovery context; for live browser qualification use Sigma's current App checkout when newer.
  - Availability: available

- site-workspace
  - Material: carried Site source snapshot and browser-smoke integration fixture.
  - Material Reference: [Site Workspace](site::.topics/.workspaces/tiinex-site.workspace.md)
  - Purpose: read-only recovery context; for live browser qualification use Sigma's current Site checkout when newer.
  - Availability: available

## Reference Context

- full-source-set-command
  - Material: run from a parent directory containing the four current repositories: `node core/tools/qualify-source-set.mjs --core core --app app --site site --playthings playthings` after the Playwright/Chromium prerequisites in Playthings `docs/NPM-PUBLISH.md` are satisfied.
  - Purpose: execute the actual tarball install, React/Vite builds and Chromium smoke without source linking.
  - Availability: available

- manual-sigma-path
  - Material: Viewer → choose Playthings → inspect immersive lineage presentation → scrub/replay History position → inspect current frontier/companion depiction → use Root Gate to return to Viewer/Verse switcher.
  - Purpose: human-visible acceptance of the first bounded Playthings Verse slice.
  - Availability: available

## Retained Responsibilities

- playthings-engineering
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: consume Sigma's browser/human result, fix Playthings-only defects and continue truthful companion/lineage presentation, atlas integration and later live-snapshot continuity.
  - Boundary: Anchor does not take Core/App/Site mutation authority or Sigma account/publication authority.

- publication-flow
  - Retained By: Sigma
  - Retained By Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)
  - Responsibility: continue the independently repaired npm/GitHub publication flow according to current repository state.
  - Boundary: this Handoff does not request, restart, cancel or claim npm publication.

- refactor-integration
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: the separate Refactor Anchor retains Core/App/Site integration/refactoring ownership.
  - Boundary: no sibling source in this carrier is an apply target.

## Exclusions And Dependencies

- npm-publication
  - Kind: excluded-scope
  - Description: no npm publish, dist-tag operation, Trusted Publisher change, OIDC assertion or GitHub Release action is requested by this checkpoint.
  - Responsible Party Or Role: Sigma

- rendered-browser
  - Kind: unresolved-dependency
  - Description: Anchor's runtime still returns `EAI_AGAIN` for `registry.npmjs.org`, so React/Vite/browser execution is intentionally delegated to Sigma's dependency-equipped environment.
  - Responsible Party Or Role: Sigma

- tech-tree-and-skills
  - Kind: unresolved-dependency
  - Description: Playthings deliberately exposes no tech-tree/skills discovery until App/Core supplies an explicit qualified binding between a loaded Workspace schema-definition artifact and the schema declaration identity it introduces.
  - Responsible Party Or Role: Anchor / Refactor integration boundary

- final-atlas-and-live-growth
  - Kind: unresolved-dependency
  - Description: final atlas promotion/visual approval and long-lived geometry continuity across expanding replacement snapshots are later Playthings productization gates.
  - Responsible Party Or Role: Anchor

## Completion Expectation

- Signal Kind: return
- Signal Meaning: Sigma returns (1) Playthings commit/push observation, (2) full source-set/browser qualifier PASS receipt or exact blocker, and (3) concise human observations for the six manual checks below.
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

Manual checks:

1. Viewer header/footer/old chrome are visually absent while Playthings is active.
2. Playthings fills the viewport without requiring browser Fullscreen API.
3. History scrub/replay does not expose future artifacts before their declared historical time.
4. Current lineage/frontiers are understandable and companion depiction feels attached to the right artifacts; report any precedence/result that looks wrong.
5. Root Gate is obvious enough and returns to Viewer with the loaded Viewer/Workspace state intact; Verse switching is available again there.
6. Overall: does this feel like a Tiinex lineage presentation that happens to be game-like, rather than a separate game or graph UI?

## Interpretation Limits

- Does Not Mean: npm publication, final product acceptance, final visual acceptance, tech-tree completion, semantic meaning of companion pixels, Tiinex spatial source truth or Refactor Turn 2 completion.
- Must Not Be Used To Claim: runtime-known schema equals story-known schema; repository location determines companion precedence; generated presentation geometry is semantic truth; or package/module tests substitute for rendered-browser evidence.
- Transport Limits: apply/commit/push Playthings only. Core/App/Site/Business/Docs are carried for qualified recovery/context and are read-only here.

## Source Boundary

Requested Sigma actions are explicitly separate: **COMMIT → PUSH → SOURCE-SET/BROWSER TEST → MANUAL EXPERIENCE TEST**. npm publication remains a separate Sigma flow and is not part of this Handoff.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md](001-8-2-2-3-3-immersive-truthful-sigma-test-task.trace.md)
  - Value: zZeY7cjhnRFIWQh4eW50Mk__OnEqt45GfC3ly7fwJlo

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: vcWaQjv6gUuzJkjDaXRKKjV1t8iOY6V4qez-r6lb88Q