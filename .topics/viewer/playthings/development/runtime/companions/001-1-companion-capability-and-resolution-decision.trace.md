# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 15:48:51
  - Trace: [Playthings Companion Capability Contract](001-playthings-companion-capability-contract-task.trace.md)
  - Origin:
    - [relative](001-playthings-companion-capability-contract-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 15:48:57
  - Authors: Anchor; Sigma
  - Why: Lock the current high-confidence companion vocabulary and prevent fallback resources from accidentally assigning world type.
  - Summary: Seven named PNG channels; exact resources may activate capabilities, inherited/fallback resources supply artwork only.
  - Status: accepted/design

---

# Companion Capability And Resolution

## Decision

- State: accepted for runtime design.
- Named channels are `character`, `verb`, `blueprint`, `portrait`, `tiles`, `structure`, and `props`, expressed as `<identity>.playthings.<channel>.png` according to the active provider/path convention.
- `structure` supersedes the earlier idea that one final Tiles atlas must contain walls, roofs, openings and stairs. Existing combined authoring sources remain valid lineage/source material and may be deterministically compiled/split; historical graphics Decisions are not rewritten.
- Exact artifact-local resource presence may activate that artifact's channel capability.
- An exact default resource for the artifact's exact schema may activate the corresponding schema-default capability.
- Resource inherited from artifact ancestors, schema ancestors, Root or any less-specific fallback may provide styling/content for an already active capability but MUST NOT activate the capability by itself.
- `tiles`, `structure`, and `props` participate in spatial/world capability projection. `character`, `verb`, `blueprint`, and `portrait` are orthogonal visual/action/presentation channels and do not alter the spatial base-type switch.
- Resolver/provider output must expose enough qualified origin/specificity to enforce this distinction. Exact public API names are intentionally deferred to Core/App delivery.
- No required Playthings JSON manifest, Playthings metadata field, or special world artifact is introduced by this Decision.

## Basis

This preserves moddability for generic Topics while preventing Root/default artwork from making every artifact spatial. It also lets a future suitable schema acquire default spatial behavior simply by receiving an exact schema-local companion, without inventing a Floor or Room schema for Playthings.

## Consequences

- Companion tooling and the old six-channel process must be revised before production/runtime promotion resumes.
- Combined Root Tiles source must be treated as authoring evidence until a deterministic compiler emits the accepted final Tiles and Structure products.
- Runtime classification depends on capability activation plus Parent/spatial context, never on transparent pixels or missing atlas slots as hidden metadata.

## Open Boundary

Final per-channel cell sizes, Structure slot grammar, collection append semantics and provider precedence among multiple equally exact sources remain to be qualified by the companion Task and Core resolver contract.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Companion Capability Contract](001-playthings-companion-capability-contract-task.trace.md)
  - Value: LRNAufEG7RPsaWkn4YQ0yuMMDPX4L66hlere7kpmm4M

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:KIEfeWnI1CNP7irAxaTxCSXbtHEJQVE4zVGkrRu6_Ck
