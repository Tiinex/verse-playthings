# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:24:00
  - Trace: [Playthings Core / Site Package Boundary](001-1-playthings-core-site-package-boundary-decision.trace.md)
  - Origin:
    - [relative](001-1-playthings-core-site-package-boundary-decision.trace.md)
- Current
  - Current Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-08 13:05:17
  - Authors: Anchor
  - Why: Preserve the supplied second Refactor Anchor reply and capture the newly explicit App and Core resource-resolver ownership boundaries.
  - Summary: Core / App / Site Unblock Planning Sync.
  - Status: proposed/review

---

# Core / App / Site Unblock Planning Sync

This Topic records the newer informal Refactor Anchor plan; it is not a delivered consumer contract or evidence of an implemented API.

## Current Read

Sigma supplied [the exact Refactor Anchor reply](001-1-1-refactor-anchor-unblock-input-01.md), SHA-256 `58b603807510d73de660574ac9ceb1962d2ca9d7639e3072f85213cc2e0160ff`. It proposes two delivery rounds: **Playthings unblock**, then **full reconciliation**. This source supersedes the earlier informal ownership sketch for planning where they differ, but does not rewrite the earlier accepted [package-boundary Decision](001-1-playthings-core-site-package-boundary-decision.trace.md).

The reply assigns general Companion Resource Resolver/provider contracts to **Core** and introduces **App** as the shared Viewer/React/Verse-host foundation. Site becomes a thin deployment above App/Core. The preceding Playthings response did not capture this App boundary precisely enough.

Sigma reports the Playthings repository committed/pushed; Site is read-only for this work. No remote repository or version was fetched to establish a newer baseline. The attached Major 006 workspaces are the only full-source basis used here.

## Design Direction

- **Core:** qualified artifact/schema/workspace identities, Parent/typed relations, ordering, general companion resolution and provider contracts, deterministic override/append/ambiguity behavior; browser-safe public exports separate from Node functionality.
- **App:** Verse host/mount contract, React application foundation, companion-provider composition, external-Verse lazy-load boundary; no dependency on Site internals.
- **Site:** deployment configuration, host/provider overrides and activation of a Verse through App. Its files are frozen in this checkpoint.
- **Playthings:** game-like depiction, semantic-to-scene interpretation within qualified boundaries, clocks, actors, spatial layout and rendering. No second general resolver, copied Core implementation, new user world schemas, or internal Core/App imports.

Core/App exports and their executable guarantees have **not** been delivered. Read this as alignment of planned ownership only. Core/App workspaces are not available in the current full snapshot; do not fabricate them or claim that the carried Site is the refactored Site.

Mirrored `src/schemas/...` remains a resource-provider lookup convention, never schema authority. Companion type semantics belong to Playthings; source precedence, qualification, ambiguity, and ancestry resolution should use the forthcoming general contract.

## Integration Questions To Preserve

Playthings will need the qualified result's origin/specificity (exact artifact, exact schema, ancestor, fallback), ambiguity/unavailable states and identity stability limits. Otherwise Root fallback artwork could accidentally enable a spatial capability for every artifact. This is a **request**, not a promised API shape.

We also need to know what temporal/source-version information is available for as-of identity and asset lookup, what ordering is arbitrary tie-breaking rather than causality, and whether collection append supplies stable row origins instead of only shifting atlas indices. Companion append must respect whole type-defined rows/family blocks, not concatenate arbitrary partial images.

Fullscreen/escape, switch requests, creation eligibility and durable writes remain host-owned actions. Gate animation may request them, not confer authority. Public export names, installable version pins and actual mount behavior remain a later consumer-contract gate.

## Next Artifacts

Continue the Playthings designer review now. When Refactor Anchor supplies the concrete consumer contract, reconcile these needs with it before authorizing implementation. Do not create speculative package configuration or adapters to bridge the missing contract.

## Interpretation Limits

The supplied message is an informal plan, not verification of Core/App/Site builds, npm publication, resolver behavior, or Site compatibility. The exact attachment is preserved beside this Topic under the same event dimension; no extra child dimension represents the attachment number.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Core / Site Package Boundary](001-1-playthings-core-site-package-boundary-decision.trace.md)
  - Value: JOE8Ck6SoevYzLmavc1HlS9wKHCi89zFzbwmCjepJ4g

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:aF1w1y0VQYL8pqO5uTWM31_5quaY1JprlfQ_1Mm69hE
