# Tiinex Playthings

Playthings is a React-compatible Tiinex Verse for projecting artifact history into a deterministic, moddable world without introducing Playthings-specific semantic artifacts.

This repository is being bootstrapped as a separate package boundary from `Tiinex/site`. The boundary is intentionally distributive rather than architectural: source paths mirror Site conventions where practical so Playthings can be consumed as an npm package or, if needed, moved into a Site tree with minimal structural change.

## Current state

The repository intentionally contains no new runtime implementation yet. The current checkpoint carries:

- `README.md`, `LICENSE`, and `NOTICE`;
- `.topics/viewer/playthings/` development, graphics, and process lineage migrated from the Site Playthings branch;
- `.topics/.workspaces/tiinex-playthings.workspace.md` as the portable Workspace entrypoint;
- `tools/playthings/` graphics/asset-lifecycle tooling that remains relevant to Playthings production.

Runtime design remains in a planning phase. The old Site experiment may be consulted for observations, but it is not migration authority for the new runtime.

## Package boundary

The intended long-term split is:

- `@tiinex/core`: host-neutral Tiinex semantic contracts and projections;
- `Tiinex/site`: Viewer shell, Verse selection, lazy loading, fullscreen/mount integration, and navigation;
- `Tiinex/playthings`: Playthings runtime, world/timeline projection, presentation, React entrypoint, and default Playthings graphics;
- user Workspaces: artifact-local `.playthings.*.png` companions for moddable overrides.

Playthings must not depend on Site internals or assume that companion files physically live in the Site repository. Companion lookup will use qualified artifact/schema identity plus registered asset providers.

## Mirrored paths

Future default schema companions may live under `src/schemas/...` using the same relative schema hierarchy as Site, but Playthings does not copy schema authority merely to place graphics there.

Playthings-specific development provenance belongs under `.topics/viewer/playthings/`.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.
