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
  - Created At: 2026-09-08 15:49:00
  - Authors: Anchor; Sigma
  - Why: Make history feel like days, months and years passing while guaranteeing that playback speed never causes important events to be missed.
  - Summary: Define the mathematical playhead, presentation clock, event preparation windows, observation pauses, simultaneous-event groups, acceleration and replay state.
  - Status: planned/design

---

# Playthings Historical And Presentation Time

## Objective

['With no qualified artifacts, historical playhead is present time; otherwise playback begins at the earliest qualified artifact historical timestamp.', 'Use artifact-declared historical time for artifact introduction; keep host filesystem timestamps as provenance only. Preserve separate schema-qualified occurrence times when relevant.', 'Allow navigation/action lead-in before an artifact anchor while preventing completion/result/knowledge from appearing before the qualified anchor.', 'When transitions cannot fit at desired pace, slow historical time or freeze it while presentation continues instead of accelerating Plaything movement beyond normal presentation speed.', 'Treat equal timestamps as one simultaneous observation set; camera focus order is presentation order, not historical causality.', 'Specify desired 1–4 pace, Space pause, idle-gap fast-forward with speed-dependent dwell, gradual acceleration and sharp/smooth braking before activity.', 'Drive day/night from historical time, including during fast-forward; presentation-time movement can continue while historical lighting is frozen in bullet-time.']

## Scope

- ../001-1-playthings-runtime-design-invariants-decision.trace.md.
- ../experience/001-playthings-experience-contract-task.trace.md.
- ../semantics/001-playthings-semantic-story-projection-task.trace.md.

## Dependencies

- A deterministic schedule can compute historical playhead, observation state and animation progress for dense, sparse and simultaneous fixtures.
- No event is skipped because user selected a faster desired pace.
- Pause/resume/seek state is defined beyond timestamp alone so bullet-time camera progression can be recovered deterministically.
- Day/night and activity lead-in obey anti-spoiler/knowledge-frontier rules.

## Done Criteria

- Define clock/state equations and observation budget policy.
- Stress-test seconds-apart, same-timestamp, month-gap and year-gap histories.
- Specify deterministic replay/seek state used by later runtime tests.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Runtime Productization](../001-playthings-runtime-productization-task.trace.md)
  - Value: 9B3pZq69IgnJqVk-iFUlcfBHeQIyvt5yEQp9R7vUwBg

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:C3s-QzFcsMzQH3vx7afwC9UOjQa8i_RPiKSuxRSBrME
