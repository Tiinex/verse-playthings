# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 17:01:00
  - Trace: [Host-Neutral Playthings Playback Engine Foundation](001-2-host-neutral-playback-engine-foundation-task.trace.md)
  - Origin:
    - [relative](001-2-host-neutral-playback-engine-foundation-task.trace.md)
- Current
  - Current Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 17:06:00
  - Authors: Anchor; Sigma
  - Why: Preserve the first executable Playthings runtime foundation while proving that it remains host-neutral and obeys the accepted elastic-time invariants before Core/App integration exists.
  - Summary: Eight Node-native playback fixtures pass against pure ESM time planning/sampling modules with no React, Site or Core imports.
  - Status: recorded/local

---

# Host-Neutral Playthings Playback Engine Foundation Evidence

## Preserved Material

- Material Description: first Playthings runtime implementation slice for deterministic historical/presentation time and observation scheduling.
- Material Kind: JavaScript ESM source plus Node test fixture.
- Material Reference: `src/verses/playthings/runtime/time/` and `test/verses/playthings/runtime/time/playback.test.mjs`.
- Represented Subject: playback plan construction, simultaneous observation groups, dense-history slowdown, sparse-history fast-forward/braking, observation holds, pause and deterministic sampling.
- Source: implementation produced under the accepted bounded host-neutral foundation authorization.

## Preservation Act

- Preservation Method: exact source retained in the standalone Playthings workspace; tests executed directly with Node 22.16.0 using `node --test`.
- Preservation Time Or State: after the first bounded host-neutral implementation slice passed all declared fixtures.
- Actor: Anchor; Sigma.
- Capture Conditions: no Site, Core, App or React implementation was imported or modified.

## Provenance

- Known Source: [Host-Neutral Playthings Playback Engine Foundation](001-2-host-neutral-playback-engine-foundation-task.trace.md).
- Provenance Limits: current pace constants and presentation curves are provisional tuning defaults, not validated user-experience constants.
- Preservation Basis: exact source hashes plus executable test output.
- Source Artifact: [Elastic Playback And Observation](001-1-elastic-playback-and-observation-decision.trace.md).
- Capture Time: 2026-09-08 17:06:00.
- Custody Context: standalone Tiinex/playthings implementation workspace.

## Fidelity And Loss

- Fidelity Notes: the implementation consumes only neutral `{ id, historicalTimeMs }` event facts plus caller-supplied playback policy options.
- Known Losses: no Core artifact/schema/relation semantics are projected yet; this slice intentionally cannot decide actor, place, branch or companion meaning.
- Transformation: historical events are grouped deterministically by timestamp; equal-time presentation ordering is stable by id and explicitly marked non-historical.
- Uncertainty: final user-facing pace ratios, dwell budgets, fast-forward curve and camera/actor lead-in budgets remain tuning and later experience-test concerns.

## Custody Or Storage Boundary

- Storage Or Custody State: implementation lives only in the standalone Playthings workspace under the mirrored `src/verses/playthings/` hierarchy.
- Reuse Boundary: safe for subsequent host-neutral semantic/world fixtures and later thin Core adapter work; not yet a public npm API contract.
- Retention: durable implementation foundation while later designer and integration tasks qualify surrounding systems.
- Permission Boundary: no Site mutation or npm publication is implied.

## Supported Claim Or Question

- Supported Claim Or Question: whether the accepted historical/presentation-time laws can be represented as deterministic host-neutral executable mechanics without depending on unfinished Core/App integration.
- Evidence Role: implementation and executable-fixture evidence.
- Target Artifact: Playthings Historical And Presentation Time Task and later runtime architecture/integration work.
- Review Context: first implementation slice only.

## Evidence Material

- Material: host-neutral Playthings playback implementation slice.
- Material Kind: JavaScript ESM source and Node-native executable fixture.
- Description: deterministic historical/presentation playback planner and sampler with observation scheduling.
- Attachment Reference: `src/verses/playthings/runtime/time/` and `test/verses/playthings/runtime/time/playback.test.mjs`.
- Sample Reference: eight passing Node test fixtures on Node 22.16.0.

- `src/verses/playthings/runtime/time/index.mjs` — SHA-256 `cb4c38a3810c31350445049aa2adef37e227fa830945fba44c8f708a4fb9aa6f`.
- `src/verses/playthings/runtime/time/playback.plan.mjs` — SHA-256 `6748c99bc488963ea8c62855455785fd95ac323a840925b75fe9eded3e37c363`.
- `src/verses/playthings/runtime/time/playback.policy.mjs` — SHA-256 `4be664fd5f60cb2c8d9265417fb15b11e8b6dcceacb3513f9a40bba41cd02cb3`.
- `src/verses/playthings/runtime/time/playback.sample.mjs` — SHA-256 `688b980c684010ebd9b6c32dbefc02bcd7b5efcf3107e20d665c3893bbe592f9`.
- `test/verses/playthings/runtime/time/playback.test.mjs` — SHA-256 `15ddceeb05e0c8ee56e5c52272c8ae3d4c95ee08e470157778c332bd3afb8881`.

## Preservation And Fidelity

- Preservation State: exact source and executable fixture retained.
- Fidelity Notes: fixture inputs are intentionally neutral and do not pretend to be the future Core consumer shape.
- Known Losses: none to source/test bytes; no UI animation or camera integration is evidenced.
- Transformation: pure deterministic planning/sampling only.
- Representation Limits: passing fixtures prove current mathematical behavior, not visual quality or final tuning.
- Storage Boundary: standalone Playthings source tree.

## Executable Qualification

Command:

`node --test test/verses/playthings/runtime/time/playback.test.mjs`

Observed result on Node 22.16.0:

- tests: 8
- pass: 8
- fail: 0
- skipped: 0
- todo: 0

Covered fixtures:

- no-artifact state follows present time;
- same-timestamp events become one observation set and presentation ordering is not historical ordering;
- two-seconds-apart dense history enters `slow-approach` instead of skipping;
- observation freezes historical time while presentation continues;
- month-scale idle gap enters explicit `fast-forward` and `brake-approach` phases;
- observation cannot begin before the historical anchor;
- pause freezes presentation progression;
- equal plan + presentation phase samples deterministically.

## Architectural Boundary Check

The new runtime modules contain no imports from React, Site, Core or App. Their only internal imports are sibling Playthings time modules. The source therefore remains compatible with the Refactor Anchor requirement that Playthings later consume qualified public Core/App surfaces rather than Site/private implementation paths.

## Interpretation Limits

- Not Yet Used As: public npm API, Core adapter contract, Site integration authority, or final user-experience tuning.
- Does Not Prove: final pace tuning, camera choreography, day/night rendering, actor locomotion, semantic projection, world generation, React integration or Site cutover.
- Does Not Mean: the neutral event shape is the future public `@tiinex/core` API.
- Must Not Be Treated As: authorization to cement package exports before Refactor Anchor delivers the consumer contract.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Host-Neutral Playthings Playback Engine Foundation](001-2-host-neutral-playback-engine-foundation-task.trace.md)
  - Value: RSKlBerFqhcJadIKWRyZSx53UjwRY8j04ETXfwvBxLU

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:I8R1RtIdr3ciAHKfpcdEU2a0Bip0wKdjZzM36zNbA5g
