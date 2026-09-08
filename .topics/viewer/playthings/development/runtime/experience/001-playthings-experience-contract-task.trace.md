# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Origin:
    - [relative](../001-playthings-runtime-productization-task.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:53
  - Authors: Anchor; Sigma
  - Why: Define the observable product experience before renderer or control implementation can bias the design.
  - Summary: Lock what a person sees, controls, understands, and can safely infer while entering, replaying, observing, and leaving Playthings.
  - Status: planned/design

---

# Playthings Experience Contract

## Objective

['Define entry with no selected artifact versus entry focused on existing work; Root Gate is the neutral world entry when no stronger focus exists.', 'Define true fullscreen behavior: ordinary host header hidden, Playthings in-world controls visible, and host-owned exit/Verse switching requested through a narrow boundary.', 'Specify 1–4 desired playback pace, Space play/pause, camera dwell, auto-fast-forward through inactivity, dense-event slow/freeze, and smooth acceleration/braking.', 'Specify day/night presentation from historical time and safe ambient life that makes characters/world feel alive without fabricating work, sleep records or semantic events.', 'Specify inspector/focus behavior so artifacts, ghosts, places and story frontiers remain understandable without forcing a graph-first view.', 'Define Root Gate interaction expectations, including gate zoom before a successful host-approved Verse switch and parentless creation only when host transitions allow it.']

## Scope

- ../001-1-playthings-runtime-design-invariants-decision.trace.md.
- ../../design/semantics/001-semantic-event-model-review-topic.trace.md as prior design evidence, not implementation authority.
- Future App Verse-host/fullscreen contract for executable host actions.

## Dependencies

- Experience state diagram/examples cover empty world, first artifact, dense activity, long inactivity, simultaneous activity at distant locations, pause/resume, replay and return to present.
- Every ambient behavior is classified as semantic choreography or non-semantic presentation.
- Controls and camera observation never cause a source event to be omitted or silently reordered.
- Fullscreen/Root Gate behavior has explicit host-owned versus Playthings-owned responsibilities.

## Done Criteria

- Create bounded acceptance scenarios rather than UI implementation.
- Resolve observation dwell and user-focus interruption rules.
- Produce an accepted experience Decision before presentation code starts.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: Y_GoYwJj9zAhikINEZaebCj7PmXl8KdbR1lsE3Cz_w0

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:DxwmUaWMRBj1d04wcXJCO4LQ_3uo8DlG56gExbMvq-o
