# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-08 13:20:00
  - Trace: [Playthings Repository Extraction And Bootstrap](002-playthings-repository-extraction-and-bootstrap-task.trace.md)
  - Origin:
    - [relative](002-playthings-repository-extraction-and-bootstrap-task.trace.md)
- Current
  - Current Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:24:00
  - Authors: Anchor; Sigma
  - Why: Lock the repository/package boundary that Playthings can safely bootstrap against after Refactor Anchor confirmed compatibility with the in-progress Core extraction.
  - Summary: Playthings becomes a separate mirrored React-compatible package Workspace; Core supplies host-neutral semantic projections, Site supplies host integration, and companion bytes resolve through providers rather than Site internals.
  - Status: accepted/local

---

# Playthings Core / Site Package Boundary

## Decision

- State: accepted.
- Repository: `Tiinex/playthings`.
- Intended package: React-compatible Playthings Verse, later publishable through npm without making npm layout semantic authority.
- Package boundary is distributive, not a second architecture: relative source hierarchy should mirror Site where practical so source can be consumed as a package or moved into a Site tree with minimal restructuring.

## Refactor Anchor Input

The exact informal response that qualified this boundary is preserved as co-event source material at [Refactor Anchor package-boundary input](002-1-refactor-anchor-package-boundary-input-01.md).

The response establishes that the Core extraction is compatible with the Playthings split and recommends that Playthings consume stable Core contracts/projections rather than Site internals. It also assigns Verse selection, lazy loading, mount/unmount, fullscreen shell behavior, and navigation back to Site. Runtime import names remain intentionally unlocked until Core's public API surface is stabilized.

## Ownership Boundary

- `@tiinex/core`: general host-neutral artifact/schema identity, normalization, lineage/continuity traversal, Created At ordering, Authors/typed relations, Workspace/source identity, validation/findings, and deterministic semantic projections.
- `Tiinex/site`: Viewer shell, Verse selection, dynamic import/lazy loading, mount/unmount, browser/URL/filesystem-like host integration, Site header/fullscreen state, and navigation between Verses.
- `Tiinex/playthings`: Playthings-specific timeline/world projection, spatial assembly, pathfinding, deterministic presentation, renderer, React Verse entrypoint, and Playthings default graphics.
- user Workspaces: may supply artifact-local `.playthings.*.png` companions without injecting Playthings-specific metadata into Tiinex artifacts.

## Runtime Import Boundary

- Do not import Site internals from Playthings.
- Do not import unstable internal Core paths while extraction is in flight.
- Wait for Refactor Anchor's later Core consumer contract before cementing runtime imports.
- React and ReactDOM should be peer dependencies when package implementation begins so Site supplies the active React instance.
- A dedicated React entrypoint such as conceptual `@tiinex/playthings/react` is preferred over making Site an implicit dependency; exact export names are not yet authority.

## Companion Provider Boundary

Mirrored `src/schemas/...` paths in Playthings are permitted as a lookup/storage convention for default PNG companions, but physical path is not semantic authority and Playthings must not assume assets reside in Site.

Resolution design must be provider-oriented:

1. artifact-local companion provider;
2. exact schema companion provider;
3. schema ancestry fallback;
4. Root/default fallback.

Core supplies qualified identity/ancestry needed for this lookup. Host/Playthings supplies companion byte providers and resolution behavior.

## Bootstrap Boundary

Initial Playthings repository source intentionally contains only:

- `README.md`;
- `LICENSE`;
- `NOTICE`;
- `.topics/` with migrated Playthings lineage and Workspace identity;
- still-relevant `tools/playthings/` production tooling.

No runtime source, npm manifest, React implementation, or mirrored `src/schemas` companion tree is created until the current designer/planning phase determines the accepted product contract.

## Consequences

- The Site Playthings branch can be frozen as the source baseline that produced this extraction and later discarded without becoming Playthings package authority.
- Playthings planning may continue while Core extraction proceeds because no runtime import path is being locked yet.
- Once Core publishes a qualified consumer surface, runtime implementation can bind to it without reintroducing Site coupling.
- Future fullscreen/Root-Gate Verse switching remains a Site-host integration contract even though Playthings controls its in-Verse presentation.

## Interpretation Limits

- Does Not Mean: Core public export names are already stable.
- Does Not Mean: a generic `@tiinex/ui` package is required.
- Does Not Mean: mirrored filesystem paths create schema semantics.
- Must Not Be Used To Claim: runtime implementation has started or that the still-evolving companion capability matrix is already finalized.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Repository Extraction And Bootstrap](002-playthings-repository-extraction-and-bootstrap-task.trace.md)
  - Value: EifyeF8roZEmMmvuCw6ptMkI9Gps4yYBzh_HZld8qco

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:Z_t9eA3XCSuERkK28092PbAj8fhjm2Qnj89jfxdzlbM
