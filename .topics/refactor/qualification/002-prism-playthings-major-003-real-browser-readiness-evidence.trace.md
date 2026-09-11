# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-11 19:59:09
  - Trace: [001-1-playthings-major-003-real-browser-sigma-test-readiness-task.trace.md](../orchestration/001-1-playthings-major-003-real-browser-sigma-test-readiness-task.trace.md)
  - Origin:
    - [relative](../orchestration/001-1-playthings-major-003-real-browser-sigma-test-readiness-task.trace.md)
- Current
  - Current Schema: tiinex.evidence.v1
  - Created At: 2026-09-11 20:18:58
  - Authors: Prism
  - Why: Preserve Major 003 qualification truthfully and return the smallest exact blockers without synthetic PASS or sibling mutation.
  - Summary: Exact carried source gates pass; real Site React/Vite browser gate remains blocked before Vite startup, with stale Site smoke assumptions isolated and no Verse-local defect found.
  - Status: ready/local

---

# Prism Playthings Major 003 Real Browser Readiness Evidence

## Supported Claim Or Question

- Supported Claim Or Question: Does the exact carried Verse Playthings Major 003 candidate pass its available source/integration gates, and can this execution host complete a genuine current Site React/Vite browser run strongly enough to unlock Sigma testing?
- Evidence Role: Preserve the exact carried source set and qualification receipts, distinguish Verse-local correctness from shared-host/environment blockers, and prevent a stale or synthetic browser PASS from being interpreted as Sigma readiness.

## Provenance

- Known Source: Tiinex-qualified `001-18-1-1-1-handoff-pointer.trace.md` from the received Carrier Dimension `003`, explicitly bound to the `Prism` recipient Role. Tiinex reported `grounded-to-act` and materialized the complete carried Verse Playthings, App, Core and Site Workspaces through the qualified workspace byte provider.
- Carried Workspace Entry Points: Verse Playthings `e0e353a59ab26311f851a2c5babba2d5933f4b70a0fad855390a1f402d3eb0d1`; App `3217b321631aec741b491b09c824ed65e3493ea06479712303beb45f435aa3fa`; Site `93b4897a66f09c8233e769cac895920fb68893562cf7af7e46984354b1ff0895`; Core `3ee262e761c1c3a64b62608cdbc53677a52fe706ce1b1c9c31f66e6042ed65c5`; Business `b0f10a259949f560f5bec9ad76d5bffb9f9eb613ddc233ee2f4be8c0d9075c6f`.
- Materialization: Verse Playthings 274 files / 11,618,154 bytes; App 660 / 4,029,009; Core 583 / 5,936,139; Site 457 / 4,615,946. The outer carrier SHA-256 is `3aa1c11c2e633f5590d345ae3498e4a1e00cb3debc6fe8d232f3078e3ea30238`.
- Preservation Basis: Re-run the declared carried-source gates against exact Tiinex-materialized sibling Workspaces, preserve raw command receipts in the Verse Workspace, and keep browser/environment failures separate from Verse-local defects.
- Candidate Binding: Verse/App/Core/Site package and lockfile SHA-256 values, plus the unchanged Site browser-smoke SHA-256 `ae641953cefbb7c91c691bcb98a4e6c074916fade54bfdb99cc8cc2fb056ab3a`, are recorded in `docs/evidence/playthings-major-003-real-browser-readiness/candidate-hashes.json` and match the prior Major 002 package/lock/smoke identities.
- Provenance Limits: No App/Core/Site source was modified. Runtime-only exact-source bindings were created only in scratch `node_modules` trees. No npm publication, deployment, remote write or Sigma observation occurred.

## Evidence Material

- Material: `docs/evidence/playthings-major-003-real-browser-readiness/README.md`, `qualification-summary.json`, `candidate-hashes.json`, `verse-check.log`, `site-node-integration.log`, `site-browser-smoke.log`, `chromium-probe.log`, `site-npm-ci-offline.log`, `dependency-availability.log`, `smoke-reconciliation.json`, and `receipt-sha256.txt`.
- Material Kind: Exact carried-source test logs, source-set hashes, browser-engine probe, unchanged Site smoke failure, dependency-availability receipts, and static reconciliation of the carried smoke against the current Verse interaction contract.
- Verse Gate: `npm run check` passes against exact carried App/Core source: 219 runtime tests, package qualification with 49 packed files, seven release-policy cases, and 22 adapter tests.
- Site Node Gate: the two carried Site node integration tests pass against exact carried Site/App/Core/Verse source.
- Browser Engine: Python Playwright 1.57.0 cannot launch its missing bundled Chromium headless-shell, but system Chromium 144.0.7559.96 launches successfully when explicitly selected.
- Real Host Gate: the unchanged carried Site `tools/browser-smoke.py` exits before Vite startup because `vite/package.json` is absent. Registry DNS resolution is unavailable, the required public dependency cache entries are absent, and `npm ci --offline` fails `ENOTCACHED`; the exact locked React/Vite tree therefore cannot be materialized in this host.

## Carried Smoke Reconciliation

- The carried Site smoke still asserts the pre-current text `2 / 2 declared historical moments` / `1 / 2 declared historical moments`. The current Verse instead exposes `data-visible-moment-count` and renders `N visible artifacts · M declared historical moments shown`.
- The carried Site smoke clicks `Fullscreen` directly. The current Verse exposes the Fullscreen control only inside the Root Gate dialog, so the smoke must open Root Gate before invoking it.
- Back-to-Viewer remains represented by the current Verse Root Gate control. The App host-level button has accessible name `Exit Verse` even though its visible text is `Back to Viewer`.
- These are stale Site-smoke assumptions, not Verse-local product defects. This Handoff does not authorize Prism to edit Site, and the gate must not be weakened or rewritten only to manufacture PASS.

## Preservation And Fidelity

- Preservation State: Raw receipts are stored inside the writable Verse Playthings Workspace. App/Core/Site carried Workspaces remain source-unchanged. No Verse product/source module was repaired because qualification exposed no Verse-local defect.
- Known Losses: The exact Site React/Vite server could not start because the locked dependency tree is unavailable in this host; therefore real host mount, lifecycle, Root Gate/fullscreen, Viewer-return and state-retention behavior remain unobserved in Major 003.
- Fidelity Notes: The real browser gate did not start Vite, so no new claim is made about React mount, lazy Verse loading, current timeline selection, Root Gate interaction, fullscreen return, Viewer return or retained Workspace state in the real Site host.
- Smallest Remaining Blockers: (1) execution environment/Anchor must provide the exact Site lockfile dependency tree, or a host where it is already present, so Vite can start; (2) Site ownership via Anchor must reconcile the carried smoke with the current moment-count and Root Gate/fullscreen contract and with browser executable availability; then the exact candidate must be rerun through the real host.
- Sigma Readiness: not reached. No Sigma launch/observe test card is emitted.

## Interpretation Limits

- Does Not Prove: a full React/Vite browser PASS, current host lifecycle/fullscreen correctness, Sigma readiness or acceptance, release readiness, or that the environment/Smoke blocker is a Verse source defect.
- Not Yet Used As: a Sigma test request, Major 003 closure, release/deployment approval, or authority to change App/Core/Site.
- Must Not Be Treated As: a synthetic browser PASS. The truthful result is exact local/source PASS with the real browser gate blocked before Vite startup and with separate stale Site-smoke assumptions identified for the owning lane.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-1-playthings-major-003-real-browser-sigma-test-readiness-task.trace.md](../orchestration/001-1-playthings-major-003-real-browser-sigma-test-readiness-task.trace.md)
  - Value: wtHKZ4UpsyJSv5SP14maEofw3oKjyEnD8Sp4jp5dpe0

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: gU-AR93D3H4aDM2cD4gmmXGVpw3wxw8hcOGhZJZ5Suk