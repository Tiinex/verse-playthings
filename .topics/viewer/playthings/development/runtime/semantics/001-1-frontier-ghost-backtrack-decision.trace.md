# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Semantic Story Projection](001-playthings-semantic-story-projection-task.trace.md)
  - Origin:
    - [relative](001-playthings-semantic-story-projection-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 15:48:55
  - Authors: Anchor; Sigma
  - Why: Lock the visual grammar for a new sibling that continues from an older common ancestor without presenting branch navigation as time travel.
  - Summary: Preserve the previous frontier as a ghost, backtrack the active presence to the common ancestor, mark the fork there, then continue the new branch.
  - Status: accepted/design

---

# Frontier Ghost And Backtrack

## Decision

- State: accepted.
- Decision: when a new branch is introduced from an older common ancestor while another frontier of the same story/identity is currently represented, Playthings immediately leaves a toned historical ghost/echo at the previous frontier. The active presence then traverses the already-known lineage back to the common ancestor, visually marks the fork there, and continues toward the new branch.
- Historical time does not rewind because of this movement. The historical playhead remains at the branch-introduction time and may slow/freeze while the presentation completes.
- Backtracking is ordinary visible traversal through the projected world/story path, not a claim that a real participant travelled backward in historical time.
- A sibling does not use Root spawn when its common ancestor is known. Root spawn remains suitable for a genuinely Parentless new story/first manifestation where host/source rules allow it.
- Ghosts represent historical frontiers, not dead, sleeping, abandoned or inactive real people. Selecting a ghost may bring that frontier into focus; a later continuation of that frontier may make an active presence sharp there again.
- Several frontiers may be sharp when the current playhead/source supports several simultaneously relevant branches. Ghosting is a legibility device, not a concurrency claim.

## Basis

This preserves the Black Mirror-inspired sense that leaves/frontiers have identity while keeping the active story readable. It also makes a late sibling visibly originate from its true common ancestor instead of appearing to continue from the previously rendered sibling.

## Consequences

- Story projection must expose common-ancestor/frontier information separately from actor identity.
- World/navigation must support a backtrack route that can be observed without altering historical timestamps.
- Presentation must visually distinguish active presence, ghost/echo, selected ghost and fork marker.

## Interpretation Limits

This Decision does not define how many real people worked concurrently, prove task responsibility, or require a unique ghost per author. Actor/presence projection remains a separate design task.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Semantic Story Projection](001-playthings-semantic-story-projection-task.trace.md)
  - Value: WNh-8DzTQYhSCPWHhjRXivr7lhklJzqGwYYUuDCRiww

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:_MgcIIHmYNU_ldlk9V1KkFtbdKLtqljvXxW1JYVcnBU
