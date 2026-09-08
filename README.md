# Tiinex Playthings

Playthings is a React-compatible Tiinex Verse for projecting artifact history into a deterministic, moddable world without introducing Playthings-specific semantic artifacts.

This repository is being bootstrapped as a separate package boundary from `Tiinex/site`. The boundary is intentionally distributive rather than architectural: source paths mirror Site conventions where practical so Playthings can be consumed as an npm package or, if needed, moved into a Site tree with minimal structural change.

## Current state

The first **host-neutral, headless foundations** are implemented. There is no public npm/React entrypoint, Core/App adapter, renderer or playable Verse yet.

- Historical/presentation playback, continuous fast-forward rate ramps and observation budgets.
- Neutral story fixtures: contribution changes, explicit participants/endpoints, historical identity discovery, frontier ghosts, backtrack/fork and reactivation.
- Deterministic navigation across explicit surfaces, doors and stairs; immutable link-state changes and bounded route search.
- Stateless visual variation, capacity estimates, stable existing placement reservations and NESW topology masks.
- A headless integration fixture combines ghost/backtrack, a door, a staircase and elastic observation. It is not a rendered tavern or proof of Core/App integration.

Run the dependency-free JavaScript tests from the repository root:

`node tools/playthings/test-runtime.mjs`

The graphics regression script uses the existing Python/Pillow tooling:

`PYTHONDONTWRITEBYTECODE=1 python tools/playthings/generative_visual/tests/test_motion_sheet_tool.py`

Read [the runtime foundation boundary](src/verses/playthings/runtime/README.md) before consuming internal exports.

## Package boundary

The intended long-term split is:

- `@tiinex/core`: host-neutral Tiinex semantic projections and the planned general Companion Resource Resolver/provider contract;
- `@tiinex/app`: planned Viewer/React foundation, Verse host/mount boundary and companion-provider composition;
- `Tiinex/site`: thin deployment, configuration and overrides above App/Core; read-only in this Playthings planning checkpoint;
- `Tiinex/playthings`: Playthings runtime, world/timeline projection, presentation, React entrypoint, and default Playthings graphics;
- user Workspaces: artifact-local `.playthings.*.png` companions for moddable overrides.

Playthings must not depend on Site internals or assume that companion files physically live in the Site repository. Companion lookup will use qualified artifact/schema identity plus registered asset providers.

## Active frontier

Start with the [Runtime Productization master Task](.topics/viewer/playthings/development/runtime/001-playthings-runtime-productization-task.trace.md) and its [bounded implementation authorization](.topics/viewer/playthings/development/runtime/001-4-bounded-host-neutral-foundation-implementation-authorization-decision.trace.md).

The latest [headless foundation integration evidence](.topics/viewer/playthings/development/runtime/integration/001-1-1-headless-foundation-integration-evidence.trace.md) records executable coverage and the remaining gates. Earlier designer scenarios remain design material; they are not all claimed to be implemented or tested.

Refactor Anchor still owns the qualified Core/App consumer exports and host integration. Site, Business and Docs are read-only context in this lane. Only the uploaded Playthings full-source snapshot is the writable baseline.

Deliveries to Sigma use a complete Tiinex Handoff carrier, not a source overlay. The [delivery decision](.topics/viewer/playthings/processes/003-sigma-full-source-delivery-contract-decision.trace.md) explains replacement safety and ignored-file boundaries.

## Mirrored paths

Future default schema companions may live under `src/schemas/...` using the same relative schema hierarchy as Site, but Playthings does not copy schema authority merely to place graphics there.

Playthings-specific development provenance belongs under `.topics/viewer/playthings/`.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.
