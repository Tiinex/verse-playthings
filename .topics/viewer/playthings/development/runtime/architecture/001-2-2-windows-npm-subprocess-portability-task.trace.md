# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 19:52:00
  - Trace: [001-2-npm-release-and-trusted-publishing-readiness-task.trace.md](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
  - Origin:
    - [relative](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 22:52:26
  - Authors: Anchor
  - Why: Close the observed Windows spawnSync npm.cmd EINVAL without changing runtime or package semantics.
  - Summary: Bound npm shell mediation to Windows npm.cmd package qualification.
  - Status: ready/local

---

# Windows npm subprocess portability hotfix

## Objective

Make Playthings package qualification portable on Windows by invoking the npm command through the Windows shell only when the selected subprocess is `npm.cmd`, preserving direct spawn behavior for Node and every other command.

## Done Criteria

- `tools/playthings/test-package.mjs` no longer fails with `spawnSync npm.cmd EINVAL` on Windows Node because the npm subprocess is explicitly shell-mediated on Windows.
- The shell exception is bounded to `process.platform === 'win32' && command === npm`; arbitrary subprocesses do not gain shell execution.
- Runtime, package-boundary, release-policy and App/Core adapter qualification continue to pass against the carried package candidates.
- The published npm package boundary remains unchanged because `tools/**` is not part of the package `files` allow-list.
- Actual Windows re-run and first npm publication remain Sigma-observed external gates; this Task does not invent either result.

## Scope

Playthings release-test tooling only. No runtime, React renderer, spatial-world behavior, App/Core/Site source, npm account settings, GitHub Trusted Publisher settings or semantic contracts are changed by this hotfix.

## Dependencies

- [npm Release And Trusted Publishing Readiness](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md).
- Sigma's observed Windows failure `spawnSync npm.cmd EINVAL` during `npm run publish:bootstrap`.
- Carried `@tiinex/core` 0.1.1 and `@tiinex/app` 0.1.1 source/package boundaries for local qualification.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-2-npm-release-and-trusted-publishing-readiness-task.trace.md](001-2-npm-release-and-trusted-publishing-readiness-task.trace.md)
  - Value: IRbBkn08caRah8s7YBaMqD85Q6zA5KodAREjxBV_qPk

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: JBRLfkStOJlGvSJU_BFKaodAyNUhr7i6d37o4VmSO-Q