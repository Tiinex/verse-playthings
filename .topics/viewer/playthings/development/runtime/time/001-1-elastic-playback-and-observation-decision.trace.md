# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Historical And Presentation Time](001-playthings-historical-and-presentation-time-task.trace.md)
  - Origin:
    - [relative](001-playthings-historical-and-presentation-time-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 15:49:01
  - Authors: Anchor; Sigma
  - Why: Lock the high-confidence playback behavior before choosing implementation equations or animation timing constants.
  - Summary: User pace is desired historical speed; Playthings may accelerate empty history and slow/freeze dense history while presentation continues so events remain observable.
  - Status: accepted/design

---

# Elastic Playback And Observation

## Decision

- State: accepted.
- Historical time is the visible human date/time playhead. Presentation time drives camera, path traversal, animation and observation choreography.
- Keys 1–4 select desired historical pace, not a promise that history always advances at that exact rate. Space toggles play/pause.
- Long intervals without relevant activity may enter automatic fast-forward after a dwell threshold. Higher selected pace may use a longer pre-fast-forward dwell. Acceleration is gradual; approach to the next activity window brakes quickly and smoothly.
- Dense activity may reduce historical speed continuously down to zero. While historical time is slowed/frozen, presentation time continues so characters can move at normal readable speed and the camera can observe each relevant scene.
- A semantic event/result must not be shown as completed before its qualified historical anchor. Preparation/navigation may occur earlier only as presentation lead-in that does not reveal unsupported result/knowledge.
- Events sharing the same historical timestamp are all active in that timestamp's observation set. Camera travel between them may hold historical time; camera visit order is not a historical ordering claim.
- Day/night uses historical time. Therefore lighting can remain nearly fixed during bullet-time while Playthings/camera continue moving.
- Deterministic replay requires historical timestamp plus presentation/observation phase (and stable input/layout identity), because a frozen historical timestamp may correspond to several camera/animation states.

## Basis

This makes playback speed describe how quickly the user is willing to consume transitions rather than allowing speed selection to hide events or force implausibly fast actors.

## Consequences

- Time engine must schedule observation windows and not merely multiply timestamps by a speed scalar.
- Camera, actor and animation systems consume presentation time and a historical playhead instead of owning their own unrelated clocks.
- Seek/replay tests must cover bullet-time phases and simultaneous observation sets.

## Open Boundary

Exact pace multipliers, dwell seconds, acceleration curves, observation budgets and user overrides remain tuning parameters for the Time/Experience Tasks rather than semantic constants.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Historical And Presentation Time](001-playthings-historical-and-presentation-time-task.trace.md)
  - Value: I7CohXAJJy4pE2qnb9dNOx8cPCLxRG4iCeytAHORV6E

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:D7Mig51BhxumVDpAljB9VYCOXNfWHgP3ZRyNr5p_9rM
