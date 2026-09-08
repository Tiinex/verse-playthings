# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 22:52:26
  - Trace: [001-2-2-windows-npm-subprocess-portability-task.trace.md](001-2-2-windows-npm-subprocess-portability-task.trace.md)
  - Origin:
    - [relative](001-2-2-windows-npm-subprocess-portability-task.trace.md)
- Current
  - Current Schema: tiinex.evidence.v1
  - Created At: 2026-09-08 22:52:26
  - Authors: Anchor
  - Why: Preserve what passed locally and keep the actual Windows/npm outcome explicit.
  - Summary: Local qualification of the bounded Playthings Windows npm subprocess fix.
  - Status: ready/local

---

# Windows npm subprocess portability evidence

## Supported Claim Or Question

- Supported Claim Or Question: does the bounded Playthings source change remove the identified cross-platform subprocess defect without changing the npm distribution surface or claiming a publication that has not happened?
- Evidence Role: local technical qualification of the source hotfix before Sigma re-runs the exact flow on Windows.
- Review Context: Sigma supplied the latest Playthings full-source Handoff and retains npm/GitHub account authority.

## Preserved Material

- Material Description: latest carried Playthings source plus one bounded code change in `tools/playthings/test-package.mjs`.
- Material Kind: JavaScript ESM qualification tooling and Tiinex lineage.
- Material Reference: [Windows npm subprocess portability hotfix](001-2-2-windows-npm-subprocess-portability-task.trace.md).
- Source: `tiinex-playthings-001-1-1-1-anchor-to-sigma.handoff-package.zip` supplied by Sigma.

## Preservation Act

- Preservation Method: preserve every carried Workspace byte except the explicit Playthings hotfix and newly authored Playthings continuity artifacts; execute package/runtime/release/adapter qualification locally without publishing.
- Preservation Time Or State: after replacing only the npm subprocess spawn options and before any Sigma Windows re-run or npm publication.
- Actor: Anchor.
- Capture Conditions: Linux Node 22.16.0; Core/App were materialized from their locally packed carried package archives solely into `node_modules` for qualification and are not source changes.

## Provenance

- Known Source: Sigma-supplied latest Playthings Handoff carrier and its carried Playthings/Core/App Workspace snapshots.
- Preservation Basis: exact source diff plus executable local qualification.
- Provenance Limits: this environment cannot prove Windows subprocess execution or npm registry acceptance; those remain Sigma-observed gates.

## Evidence Material

- Material: `tools/playthings/test-package.mjs`.
- Material Kind: package-boundary test tooling.
- Description: `spawnSync` now sets `shell: process.platform === 'win32' && command === npm`, matching the already-qualified Core release-runner platform boundary while keeping direct spawn for all other subprocesses.

## Preservation And Fidelity

- Preservation State: no runtime or package-export source was modified.
- Fidelity Notes: the package test still reports the real installed-package consumer PASS, no network, no publication and no leaked `tools/**` material in the npm tarball.
- Known Losses: actual Windows execution is not available in this environment.
- Representation Limits: Linux success plus bounded source inspection supports the portability candidate but is not equivalent to Sigma's Windows acceptance.

## Custody Or Storage Boundary

- Storage Or Custody State: Playthings Workspace only; sibling Workspaces are carried unchanged for recovery and qualification context.
- Reuse Boundary: publication qualification only; does not grant npm/GitHub authority or alter Playthings renderer scope.

## Technical Results

- `npm run check`: PASS in the repaired workspace when exact locally packed `@tiinex/core` 0.1.1 and `@tiinex/app` 0.1.1 were materialized as test dependencies.
- Runtime suite: 164/164 PASS.
- App/Core adapter suite: 7/7 PASS.
- Release policy/workflow suite: PASS, including master-only workflow and no long-lived publish secret.
- Offline package pack/install consumer: PASS; `network: false`, `published: false`.
- The modified `tools/playthings/test-package.mjs` remains excluded from the published package `files` boundary.

## Interpretation Limits

- Not Yet Used As: Windows execution evidence, npm publication evidence, OIDC/Trusted Publisher evidence or browser acceptance evidence.
- Must Not Be Treated As: proof that `@tiinex/playthings` is published or that GitHub Actions can already publish it.
- Does Not Prove: Windows accepted the corrected subprocess path until Sigma re-runs it.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-2-2-windows-npm-subprocess-portability-task.trace.md](001-2-2-windows-npm-subprocess-portability-task.trace.md)
  - Value: JBRLfkStOJlGvSJU_BFKaodAyNUhr7i6d37o4VmSO-Q

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: _OBUNqAS65Mj3iaR9XpnVvHfvbXyFZG0aRRKEHXOFNI