# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 19:52:00
  - Trace: [npm Release And Trusted Publishing Readiness](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
  - Origin:
    - [relative](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
- Current
  - Current Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 19:53:00
  - Authors: Anchor; Sigma
  - Why: Record reproducible release-infrastructure qualification before Sigma applies the full source and performs account-level bootstrap/setup.
  - Summary: Preserve the tested release policy, workflow, package guard and local dry-run results without claiming a real registry publish.
  - Status: recorded/technical-pass

---

# npm Release And Trusted Publishing Readiness Evidence

## Supported Claim Or Question

- Supported Claim Or Question: can the current Playthings package be prepared for controlled GitHub Release to npm publishing without a long-lived npm write token or speculative Core/App/React integration?
- Evidence Role: technical qualification of local source and workflow structure before real account-level bootstrap.
- Review Context: Sigma receives full source and retains all remote account/publishing authority.

## Preserved Material

- Material Description: complete Playthings release-readiness source derived from the Sigma-supplied workspace, including package metadata, release workflow, VS Code tasks, release tooling, operating instructions and executable tests.
- Material Kind: ESM source, JSON package/editor configuration, GitHub Actions workflow, Markdown operating documentation and Tiinex lineage artifacts.
- Material Reference: [Release readiness Task](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md).
- Source: complete Sigma-supplied `playthings(2).zip`, SHA-256 `efc53e9ad90c2776b11d0003f5b13ded57ddab9428b392f0f17aa43f3ad1de6e`.

## Preservation Act

- Preservation Method: retain every supplied baseline path, modify only the bounded release surfaces, run executable package/release/runtime qualification, and preserve exact source hashes for the supplied boundary.
- Preservation Time Or State: after the release workflow, guarded publication path, automatic version policy and VS Code release tasks were implemented and locally qualified without remote publication.
- Actor: Anchor.
- Capture Conditions: supplied complete Playthings workspace; local Node/npm execution; no writable GitHub/npm account action.

## Provenance

- Known Source: complete Sigma-supplied `playthings(2).zip`, SHA-256 `efc53e9ad90c2776b11d0003f5b13ded57ddab9428b392f0f17aa43f3ad1de6e`, plus this bounded release-readiness Task.
- Preservation Basis: executable tests, npm dry-run output, synthetic git dry-runs and exact source paths.
- Provenance Limits: no GitHub clone/fetch was used to reconstruct writable source; no npm/GitHub remote mutation was performed.

## Evidence Material

- Material: package.json, .github/workflows/publish.yml, .vscode/tasks.json, RELEASING.md and tools/playthings release scripts/tests.
- Material Kind: package configuration, CI workflow, JavaScript ESM tooling, VS Code task configuration and operating documentation.
- Description: release-enabled package with GitHub OIDC workflow, deterministic semantic-version recommendation, fail-closed normal publish guard and explicit one-time prerelease bootstrap.

## Preservation And Fidelity

- Preservation State: all 173 baseline source paths remain present; no baseline path is deleted.
- Fidelity Notes: all 13 pre-existing PNG files remain byte-identical to the supplied source; release work modifies package/release surfaces only.
- Known Losses: GitHub CLI release creation and npm OIDC cannot be end-to-end executed in this environment because `gh` is not installed and Anchor has no npm publishing/account authority.
- Representation Limits: synthetic git repositories validate recommendation behavior but are not evidence that GitHub accepted a real Release or npm accepted OIDC.

## Fidelity And Loss

- Fidelity Notes: all 173 supplied baseline paths remain present and all 13 pre-existing PNG files remain byte-identical; package/release changes are explicit and reviewable.
- Known Losses: no real GitHub Release, npm registry bootstrap, Trusted Publisher configuration or OIDC publication was executed in this environment.
- Uncertainty: remote account policy, npm scope authority and first live publish behavior remain for Sigma to verify during account-level setup.

## Custody Or Storage Boundary

- Storage Or Custody State: writable Playthings workspace only; Business, Docs and Site remain frozen read-only carrier context and are not apply targets.
- Reuse Boundary: release engineering, package publication qualification and later Core/App/React integration; this Evidence does not grant registry or repository account authority.

## Technical Results

- Existing runtime regression remains 139/139 passing.
- Package qualification exposed a race in its browser-like VM module-loader fixture; caching the in-flight module load made module identity deterministic, and the complete package test then passed five consecutive isolated runs. This changes qualification tooling only, not runtime module behavior.
- Actual offline npm pack/install boundary remains passing after publication configuration changed.
- Release policy tests cover bootstrap, patch, feature/minor, public-export addition, public-export removal, pre-1.0 breaking safety and explicit major intent.
- Publish workflow contains `id-token: write` and no npm write secret reference; it runs only for published non-prerelease GitHub Releases, binds the `npm` Environment, uses current `checkout@v7` / `setup-node@v7`, disables package-manager caching, and installs with lifecycle scripts disabled before explicit qualification.
- Publish guard rejects ordinary local `npm publish`; the explicit prerelease bootstrap path passes the guard.
- Bootstrap `npm publish --dry-run --tag dev` succeeded locally without network publication and retained the 33-file package boundary; `repository.url` uses npm's normalized `git+https` GitHub form so npm does not rewrite it during publish preparation.
- A synthetic git repository dry-run recommended first stable `v0.1.0` from `0.1.0-dev.0` without mutation.
- A synthetic tagged repository with a new public React export plus `feat:` commit recommended `0.2.0`, proving the CLI uses both package-surface and commit-intent signals.

## Interpretation Limits

- Not Yet Used As: live npm publication evidence, npm Trusted Publisher acceptance evidence, production release approval, React/Viewer acceptance, or Core/App integration evidence.
- Must Not Be Treated As: registry authority, final public API stability, successful remote OIDC publication, or completed Playthings product qualification.
- Does Not Prove: any npm package/version currently exists, any GitHub Environment or npm Trusted Publisher is configured, any OIDC publish succeeded, or any React/Viewer integration is ready.
- Must Not Be Used To Claim: remote publication authority, production readiness, final public API stability, completed Core/App integration, or visual acceptance.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [npm Release And Trusted Publishing Readiness](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
  - Value: IRbBkn08caRah8s7YBaMqD85Q6zA5KodAREjxBV_qPk

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:Bv9q-LE1Q0s3GP135br5ScVXbD2iCK0I18aTk5oKSRs
