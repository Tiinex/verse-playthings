# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:49:05
  - Trace: [Playthings Package Runtime Architecture](001-playthings-package-runtime-architecture-task.trace.md)
  - Origin:
    - [relative](001-playthings-package-runtime-architecture-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 19:52:00
  - Authors: Anchor; Sigma
  - Why: Make @tiinex/playthings operationally releasable while the Refactor Turn 1 remains pending, with deterministic version recommendation and no long-lived npm write token.
  - Summary: Prepare a guarded GitHub Release to npm Trusted Publishing path without inventing Core/App or React integration.
  - Status: completed/bounded-qualification

---

# npm Release And Trusted Publishing Readiness

## Objective

Prepare the existing headless npm package for controlled public release without treating package publication as product completion.

## Scope

- Add a GitHub Release-triggered npm publish workflow using GitHub OIDC / npm Trusted Publishing.
- Add one-time prerelease bootstrap publication because npm trust configuration requires an existing package.
- Add a fail-closed prepublish guard that only admits the bootstrap path or the exact GitHub Release workflow.
- Add a VS Code release task and Node release CLI that recommends semantic version bump, qualifies the package, atomically pushes one release commit/tag, then creates the GitHub Release.
- Preserve a read-only preview mode and explicit major/minor/patch override.
- Document the human setup and normal release flow in RELEASING.md.

## Dependencies

- Complete Sigma-supplied Playthings source remains the only writable source basis.
- Existing package and runtime qualification must continue to pass.
- npm/GitHub account authority, scope ownership and 2FA remain with Sigma.
- Refactor Turn 1 remains pending; no release tooling may invent Core/App or React integration contracts.

## Done Criteria

- Package is release-enabled but ordinary local npm publish still fails closed.
- One-time prerelease bootstrap is explicit and isolated from normal release publication.
- GitHub workflow contains OIDC permission and no long-lived npm write secret.
- Automatic bump recommendation covers bootstrap, patch, feature, breaking public surface and pre-1.0 safety; human override remains possible.
- VS Code preview and release tasks are available.
- Package/runtime/release tests and local dry-runs pass without publishing or mutating remote services.
- Human bootstrap and normal release procedure is documented.

## Version Policy

- Explicit release markers outrank heuristics.
- Breaking-change markers and removed/retargeted public package surfaces are breaking signals.
- Added public exports/file patterns and feature markers are minor signals.
- Otherwise release defaults to patch.
- Before 1.0, automatically detected breaking changes advance minor rather than silently declaring 1.0.0; explicit major intent may opt into 1.0.0.
- First stable release converts the current 0.1.0-dev.0 prerelease to 0.1.0 after registry bootstrap.

## Interpretation Limits

This Task prepares release infrastructure only. It does not publish any package, create any GitHub Release, alter npm/GitHub account settings, create Core/App imports, add a React entrypoint, or qualify Viewer behavior.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Package Runtime Architecture](001-playthings-package-runtime-architecture-task.trace.md)
  - Value: VQoGZXwRLb_7QE9qopup9PhGw39mdH6lQZv1ACtAhgY

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:IRbBkn08caRah8s7YBaMqD85Q6zA5KodAREjxBV_qPk
