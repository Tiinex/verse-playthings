# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-08 13:46:00
  - Trace: [Playthings Repository Bootstrap — Anchor To Anchor](../repository/001-3-anchor-to-anchor-playthings-repository-bootstrap-handoff.trace.md)
  - Origin:
    - [relative](../repository/001-3-anchor-to-anchor-playthings-repository-bootstrap-handoff.trace.md)
- Current
  - Current Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 13:05:17
  - Authors: Anchor
  - Why: Advance the designer-only Playthings planning frontier without implementing runtime.
  - Summary: Playthings Designer Review Frontier.
  - Status: proposed/review

---

# Playthings Designer Review Frontier

The current task is design confidence and recoverability, not runtime implementation or a prematurely approved implementation Task tree.

## Current Read

This continues the [repository bootstrap Handoff](../repository/001-3-anchor-to-anchor-playthings-repository-bootstrap-handoff.trace.md). Sigma authorized designer work while Refactor Anchor prepares the new dependencies. Site stays read-only; Playthings is the writable planning workspace. The old Site experiment is observations material, not a preservation or migration requirement.

The newer [Core / App / Site planning sync](../repository/001-1-1-core-app-site-unblock-sync-topic.trace.md) governs our understanding of the proposed integration boundary. It does not deliver a consumer API.

The first completed pass is a [semantic/event design review](semantics/001-semantic-event-model-review-topic.trace.md), with 32 specification scenarios and expected outcomes. These are desk-reviewed examples, **not executed runtime tests**. No global confidence percentage is calibrated by this pass.

## Design Direction

### Retained user requirements

The following are conversation-derived requirements, paraphrased rather than a byte-exact transcript. They remain separate from source-schema facts and the refinements proposed by the semantic review.

| Area | Requirement to carry into design |
|---|---|
| Ownership | Standalone Playthings, Site read-only; mirror source/provider paths when practical; no internal Site imports or implementation before approval. |
| Product surface | User-facing Playthings companions are named `.playthings.<channel>.png` only. No per-artifact world manifest, Playthings fields, or forced Floor/Room/Place schema. Shared development Topics are not user world artifacts. |
| History | Parent Lineage supplies continuity; real/synthetic paths locate representations, not story causality. Parentless and unresolved-Parent cases must remain distinct. |
| Actors | Explicit schema-qualified roles/participants/endpoints matter; authorship can depict contribution without asserting task execution. Several presences may represent separate branches of one identity. |
| Knowledge | Identity, blueprint and other discovered subjects must not be revealed before their allowed timeline frontier; use fallback beforehand. |
| Spatiality | Root supplies one outer surface. Inner/outer share scale, tiles, navigation and renderer; there is no separate miniature world map. |
| Modding | Generic Topics can opt into spatial depiction through exact named companions. Tiles and Structure combine into four distinct spatial projections; Props is an independent object collection. Inherited artwork must not activate every node. |
| Layout | Stable pseudorandom variation affects arrangement/decor, never authorship, relationships, success or event occurrence. Room/common areas, doors and stairs must remain usable. |
| Time | Empty input starts at now; otherwise the earliest valid artifact creation anchors historical playback. Created time is not automatically a described Event's occurrence time. |
| Playback | 1–4 select desired pace; Space pauses/resumes. Long idle gaps may accelerate smoothly with braking before activity. Dense activity may slow/freeze history while camera/animation completes observation. |
| Simultaneity | Separate locations may share a timestamp. Camera travel must not falsify their order or silently omit them. |
| Atmosphere | Day/night follows historical time; ambient behavior is illustration, never fabricated work, abandonment, sleep records or result creation. |
| Interaction | Fullscreen hides the normal header; Playthings offers exit/Verse switch via its own controls and Root Gate. Gate zoom precedes a successful switch where allowed. Root-parentless creation remains subject to the host's permitted transitions. |
| Recovery | Planning refinements and their uncertainties live under `.topics/viewer/playthings/`; new co-event source attachments share the owning trace's dimension. Existing sources are referenced, not duplicated. |

### Changes not silently locked by this pass

The accepted graphics contract in `graphics/001...` still describes six channels. The later conversation proposed a seventh `.playthings.structure.png` channel and splitting the Tiles contract. The asset tool still recognizes six. We have **not** renamed/promoted PNGs, altered tools, or claimed the seven-channel runtime contract is implemented. A later explicit companion-template decision must reconcile this difference before production resumes.

Similarly, earlier sketches equated siblings with parallel execution, Authors with responsibility, and a single timestamp with a unique camera frame. The semantic review records narrower proposals rather than overwriting historical artifacts.

### Four bounded designer passes

1. **Semantics/event review:** source claims, roles, Parent, late arrival, branching, temporal knowledge and anti-fabrication rules. This pass is ready for discussion, not product acceptance.
2. **Experience/time review:** pace modes, observation dwell, pause/scrub, simultaneous groups, anti-spoiler preparation, day/night, fullscreen and escape. No new clock code.
3. **Spatial/companion review:** exact capability versus inherited art, seven-channel candidate, nested surfaces, floor order, common zones, footprint growth, navigation and collection row semantics.
4. **Architecture/breakdown:** consume the actual Core/App boundary, approve the master Task and scoped domain subtasks, then establish work packets and integration gates.

Each pass belongs in a dedicated domain subdirectory with a small main reading artifact and necessary co-event supporting material. Do not pre-create empty folders or dozens of future Tasks to simulate progress.

## Confidence And Exit Gates

| Gate | Present state | Required next evidence |
|---|---|---|
| Source semantics | Bounded local schema/reply review completed | User review of the proposed depiction constraints and problematic examples. |
| Semantic scenario model | 32 desk-review scenarios recorded | Approved expected outcomes, later executable tests against the delivered Core projections. |
| Time/observation | Two-clock concept retained; exact replay state still needs design | Demonstrate freeze, simultaneous focus and seek without invented time or early knowledge. |
| Spatial/graphics | User intent retained; exact/inherited capability and new Structure template not finalized | Switch/provider matrix and nested multi-floor cases. |
| Package/API integration | New Core/App plan aligned; no executable consumer contract delivered | Actual exports, qualified tarball install/mount tests, resolver-origin and ambiguity results. |
| Runtime delivery | Not started | Plan approval plus consumer-contract readiness; no premature completion claims. |

Confidence is expressed by covered claims and unresolved gates, not an untested 90–95% success promise.

## Next Artifacts

After discussing this pass, advance experience/time and spatial/companion Topics. Only once those decisions and dependency contracts are explicit should we materialize the runtime master Task and domain subtasks. Carrier majors represent meaningful accepted checkpoints, not a quota or one major per designer turn. This designer continuation remains within Major 006.

## Interpretation Limits

A source-space Topic is documentation of our work, not a required Playthings companion or a new semantic type for the user's world. No Site, Docs or Business source is modified. This checkpoint carries their previous snapshots for recovery only, not the unreceived Refactor work.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Repository Bootstrap — Anchor To Anchor](../repository/001-3-anchor-to-anchor-playthings-repository-bootstrap-handoff.trace.md)
  - Value: qTqBEh6SqdAnW_hapzXwVdDk8DGLxPnMHB5S1Fq0JlU

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:gkbCrJFgk8brcI97lMfcriqkXJvj16puFNOFC-pWIKc
