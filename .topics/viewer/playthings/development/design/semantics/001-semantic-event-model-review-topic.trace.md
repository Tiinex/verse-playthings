# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 13:05:17
  - Trace: [Playthings Designer Review Frontier](../001-playthings-designer-review-topic.trace.md)
  - Origin:
    - [relative](../001-playthings-designer-review-topic.trace.md)
- Current
  - Current Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 13:05:17
  - Authors: Anchor
  - Why: Advance the designer-only Playthings planning frontier without implementing runtime.
  - Summary: Playthings Semantic / Event Model — Adversarial Design Review.
  - Status: proposed/review

---

# Playthings Semantic / Event Model — Adversarial Design Review

This is a proposed reading/depiction contract and desk review. It refines the discussion using the carried Tiinex schemas; it neither changes those schemas nor claims to execute their future Core projections.

## Current Read

The central design promise remains: **show the recorded work clearly, with lively presentation, without inventing execution, responsibility, identity, containment or chronology**. The supplied data can be incomplete, contradictory or only a current snapshot. The renderer must make those limits inspectable rather than silently repair them.

The [32-case matrix](001-scenario-matrix-01.md) contains source observations, proposed permitted depiction, forbidden inference and a future test oracle. The [consumer questions](001-consumer-contract-questions-02.md) are an informal design request, not a new Core API.

## Source Basis

These are carried-source facts. Claims about future behavior below are proposals.

| Source | What it actually supports | What it does not supply |
|---|---|---|
| [Root](docs::.topics/.schemas/tiinex.root.v1.schema.md), Current / Parent / Created At / Continuity Integrity | Parent is direct ancestry; missing Parent means local lineage root; Created At records artifact creation, UTC implied, second precision; a hash is not immutable logical identity proof. | Physical location, author activity intervals, stable rename identity in every adapter, creation time of PNG content, arbitrary Status meaning. |
| [Handoff](docs::.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md), Core Semantics / Handoff Parties / Transfers | Explicit From/To/Capacity and bounded transfer declaration; Authors remains authorship. | Recipient acceptance, completed work, role-holder identity or authority from delivery/ZIP/Authors. |
| [Event](docs::.topics/.schemas/event/tiinex.event.v1.schema.md), Time And Context Boundary / Participants And Targets / Event State | Separate time/context and participants/targets; events may be planned, tentative, occurred, cancelled, deferred, missed or unknown. | Automatic attendance by every listed target, an occurred event simply because its document exists, universally parsed free-text locations. |
| [Task](docs::.topics/.schemas/core/task/tiinex.task.v1.schema.md) | Objective, Scope, Dependencies and Done Criteria describe work and its completion criteria. | Completion or executor identity just from artifact creation. |
| [Evidence](docs::.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md) | Preserved supporting material with explicit fidelity and interpretation limits. | Truth, success, consent, acceptance or product qualification merely from schema type. |
| [Decision](docs::.topics/.schemas/core/decision/tiinex.decision.v1.schema.md) | A stated/landed decision and its scope, including rejected/deferred/superseded states. | A universally successful outcome or authorization beyond its actual scope. |
| [Party Role](docs::.topics/.schemas/party/role/tiinex.party.role.v1.schema.md) | Role/capacity, holder relationship and responsibility boundaries. | A unique real person, attendance or authority without further support. |
| [Relation](docs::.topics/.schemas/relation/tiinex.relation.v1.schema.md) | Typed scoped non-Parent relations and distinguishable targets. | Parent changes, semantic edges from directory membership, or mandatory extra Relation artifacts for every edge. |
| [Actual Root Props Evidence](../../../graphics/root/001-4-1-pilot-root-props-generation-evidence.trace.md) | Exact preserved output and approval-for-return with explicit deferred normalization/integration and recorded process deviations. | Root runtime PASS or automatic stable promotion. This is a real regression example, not a constructed success case. |
| [Refactor planning sync](../../repository/001-1-1-core-app-site-unblock-sync-topic.trace.md) | Proposed Core resolver, App host and thin Site ownership; no new Site work authorized here. | Stable export names or passing installed consumers. |

## Design Direction

### 1. Keep the claim separate from the scene

Every visible semantic occurrence should have inspectable source support: which artifact/version, what declared relation/state/time, what qualification or uncertainty. This is a **conceptual requirement**, not a JSON companion or a newly implemented data structure.

Walking, waiting at a desk, camera travel and ambient movement are visual illustration unless the source actually records physical behavior. The UI should be able to explain "author contribution to this artifact" without implying "this person was in this real building doing the described work".

Publication/creation and domain events are separate layers. Created At remains the hard anchor for the **artifact's creation in the story**, not a universal timestamp for the event described inside it. A planned meeting created today must not play as an attended meeting today. An occurred event described later must keep the occurrence time and the later recording time distinguishable. For this first product plan, an Event can be presented at its document anchor with its qualified event state/time visible; an alternative occurrence-time replay remains an explicit future choice, not a silent retiming.

### 2. Select participants by their actual semantic role

For a Handoff, qualified From/To and Capacity control the transfer depiction; Authors describes who wrote it. For an Event, distinguish actual participants from required/optional/invited parties, resources and targets. Do not animate every name in `Relevant Parties Or Targets` as an attendee. For other typed relations, follow their scoped meanings rather than a hard-coded field-name priority or an LLM guess.

When no explicit performer is established, Authors may supply a **contribution avatar** presenting the new artifact. It does not become executor, assignee or owner. If neither is known, depict an impersonal artifact occurrence, not an invented person.

A change from author A to B can still be shown clearly as the next contributor arriving and continuing at the inherited checkpoint. Call this **informal contribution succession**, not proven responsibility transfer. Adding/removing a name changes the contribution to the new artifact, not global employment, participation elsewhere, task state or life/death.

### 3. Branch identity is not execution duration

A child continues its declared Parent. A new sibling starts from their shared Parent, never from whichever sibling was last rendered. A common Parent proves branching in provenance, not overlapping activity intervals.

It is legitimate to show several branch-scoped representations of one role, but they are **story presences**, not evidence that one concrete person did several jobs simultaneously. Use actual qualified interval/occurrence data to assert concurrency. With only Created At, show separate branches and their known anchors; do not fabricate a long working interval for a leaf while waiting for its next child.

An old branch may receive a new sibling with today's Created At: show a new contribution from the older checkpoint today. A newly loaded artifact with an old Created At is different: it is newly available historical material, not a new present-day act. Only the latter alters the historical material set being replayed.

Convergence uses the declared Parent plus explicitly qualified other relations, not a second invented Parent. Retirement of a presence is a display/lifecycle policy, not proof that the branch has ended or a Role stopped existing.

### 4. Two clocks require more than one replay coordinate

Historical playhead T owns the shown calendar and creation anchors. Presentation progress P owns camera travel, path animation, slow-motion preparation and inspection dwell. With bullet-time, many P values share the same T. Therefore "same T always means the same frame/camera" is no longer an adequate determinism claim.

Proposed replay identity is: **the same qualified material snapshot, same source-availability frontier, same seed/layout policy, same T, and same presentation position within the event group produce the same depiction**. This may be volatile runtime/session state or a host bookmark later; it is not a required extra user artifact.

A plain seek to a timestamp chooses a documented canonical observation position. Exact continuation of a paused shot additionally needs its observation position. Space freezes both clocks; automatic bullet-time freezes/slows T while P continues. Day/night follows T, with visual safety/smoothing to be specified rather than flashing every day at high speed.

If several occurrences share T, reveal/commit the timestamp group together, then let the camera observe locations in a stable **viewing order**, visibly still at T. Never serialize their historical truth merely because the camera visits A before B. Tie-break order is not causal order. Large groups need an explicit queue/overview policy so important events are not silently dropped or a "never miss" promise becomes infinite blocking.

The first artifact has no prior world history to borrow. Do not invent timestamps before it to fit a walk. Prepare/present while holding at its boundary, then expose the anchored result; already known things may move before a later anchor, but future identity, location or outcome may not leak early. Exact microstep and reveal timing belong to the experience/time pass.

### 5. Knowledge and identity must remain bounded

A name is not a unique Party/Role identity. Preserve contextual unresolved descriptors when Core cannot disambiguate; do not merge equal labels across Workspaces or equate a Role with its holder. Unknown/future identities use the default depiction until the allowed frontier; later discovery must not rewrite earlier playback's claimed knowledge.

Created At, source ingestion time and source/version availability are separate. A PNG has no universally supplied historical discovery time. Without resource history, do not claim a physically exact historical skin reconstruction. Use a declared fixed resource snapshot plus identity-discovery rules, and disclose the missing older resource history. Pinned replay and "show all currently known history" must remain distinguishable when older records arrive.

Same bytes do not prove the same logical subject; different hashes may be successive representations of one qualified subject. Rename/path independence is conditional on an adapter/Core being able to qualify the same identity and companion association after relocation. Do not promise move-invariance for ambiguous path-only sources. File paths remain locators, not semantic chronology or room layout.

Missing Parent is not an explicitly parentless root. Private/unavailable sources must not be recovered by layout inference or fallback art. A safe Root holding area for unresolved visual objects is permitted only when clearly presentation fallback, not a fabricated Parent edge.

### 6. Bound the spatial projection without new world schemas

The user's seven-channel candidate is retained: Character, Verb, Blueprint, Portrait, Tiles, Structure and Props. The currently accepted six-channel source artifacts are not silently rewritten in this pass.

Exact artifact-local and exact-schema companions may opt into a **Playthings spatial depiction**, subject to qualified provider rules. Ancestor/Root fallback provides artwork and must not by itself change a nonspatial Topic into a building. Core must expose sufficient origin/specificity to distinguish the two. Artifact-Parent style propagation remains an open Playthings projection question; do not claim Core's planned general resolver already offers it.

Parent traversal may select the nearest opted-in projected container as a convenient *visual home*. Parent still means ancestry, not recorded physical containment. A qualified explicit event location has priority for that event's scene without moving its Parent or permanent home. Ambiguous/conflicting location claims must remain visible, not be settled by parsing titles.

A Props sheet is an asset catalogue, not a count of owned objects or a command to spawn every row. A new persistent result needs a source-backed event/result or an explicitly cosmetic depiction of that artifact; it must not assert production of real inventory. A state-column image also does not prove the prop changed state. Unused/unsupported cells do not encode new semantics.

A renderer-inferred floor or room is a layout choice, not a new domain fact. Direct children not allocated to a nested room can use their container's shared area without inventing room membership. Connectivity/pathfinding must qualify doors, stairs and reachability. If no valid route exists, show the blockage or a clearly disclosed presentation reposition, never silently walk through walls.

Same material and seed should reproduce layout, but recomputing a packed city can move old buildings when new content arrives. **Reproducibility and incremental spatial stability are different requirements.** Footprint allocation, growth reservations and row-append identity need separate tests, not merely a seeded random function.

## Adversarial Review Outcome

The [matrix](001-scenario-matrix-01.md) is a specification review of 32 distinct cases, not "32 passed tests". The old conversation sketches do not yet cover all of them safely. Main repairs proposed here are: creation versus described occurrence; contribution versus responsibility; branching versus proven concurrency; import time versus creation time; and event time versus camera-observation progress.

The Role names A/B/P/Q and scenario dates are constructed examples, not facts imported into any user Workspace. The real Root Props Evidence is included only as a source sanity check. No new Task/Event/Handoff fixtures pretending to be real user history were injected.

## Open Questions

- Accept contribution avatars as the fallback for Authors without implying executor/owner? Accept separate branch presences without claiming unproven concurrency?
- At an event timestamp, accept atomic semantic revelation followed by sequential camera observation under one held clock? Experience timing remains to be set for 1–4, skip/overview, Space and initial state.
- What qualified identity, as-of/source-version, companion-specificity and collection-row-origin information will the actual Core consumer contract supply?
- Approve explicit exact-companion capability versus inherited-graphics separation and the new Structure template in a later spatial decision; root/floor/room layout and dynamic growth remain unqualified.

## Next Artifacts

Review these proposed boundaries with Sigma. Then run the experience/time and spatial designer passes with comparable examples. Only after the expected behavior and dependency contracts are approved should the master runtime Task/subtasks and executable fixtures be created. Do not start renderer, pathfinder, package scaffolding or schema PNG promotion in this pass.

## Interpretation Limits

This work advances the design; it is not a new canonical schema, a final acceptance Decision, a machine-enforced guard, or an implemented simulator. The exact naming/state contracts remain under user review. Schema validation of this Topic checks artifact shape/integrity, not truth of its design proposals or performance of future code.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Designer Review Frontier](../001-playthings-designer-review-topic.trace.md)
  - Value: gkbCrJFgk8brcI97lMfcriqkXJvj16puFNOFC-pWIKc

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:vg5XM2bJ4HzXPGlypP2aBfrS8OrHYp2lOr6i0LAUut8
