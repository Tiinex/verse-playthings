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
  - Created At: 2026-09-08 15:49:03
  - Authors: Anchor; Sigma
  - Why: Make the world feel populated and continuous while keeping identity, contribution, action and ambient life truthful.
  - Summary: Define and implement identity discovery, branch presences, ghosts, actor-source selection, locomotion/action lifecycles and non-semantic idle behavior.
  - Status: planned/design

---

# Playthings Identity Presence And Action

## Objective

['Do not show a role/party identity-specific Character before that identity is qualified as discovered at the playhead; use default fallback beforehand.', 'Separate identity from presence so one identity can have several branch/frontier presences when the story projection requires them.', 'Implement active versus ghost/echo presence states according to the frontier Decision; ghosting is legibility, not real-world inactivity.', 'Use explicit participants/endpoints/typed relations before Authors for scene actors; use Authors as contribution fallback only.', 'Visualize formal Handoff separately from informal contribution succession and distinguish Verb completion from mere document existence.', 'Ambient behavior may breathe, shift weight, look around, use idle/rest loops or make bounded non-semantic local movement; it must not fabricate work, transfers, discovery, sleep records, travel to another Place or persistent results.']

## Scope

- ../semantics/001-playthings-semantic-story-projection-task.trace.md.
- ../semantics/001-1-frontier-ghost-backtrack-decision.trace.md.
- ../time/001-playthings-historical-and-presentation-time-task.trace.md.
- ../world/001-playthings-deterministic-world-generation-task.trace.md for navigation topology.

## Dependencies

- Serial, branch, late sibling, multi-author, Handoff and explicit-participant fixtures produce expected presence transitions.
- Identity fallback changes only when the timeline allows discovery.
- Movement follows pathfinding and respects presentation-time speed rather than historical fast-forward speed.
- Ambient-life catalog is explicitly non-semantic and cannot mutate durable world/story state.

## Done Criteria

- Define identity/presence state machine.
- Map Verb/Character/Props animation lifecycles to semantic events.
- Stress-test several presences of one identity across reactivated branches.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:DwP_ELQKyne---ZA43mfac0Zktv2WPyCam6Nx7Z4B1I
