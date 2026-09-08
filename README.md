# Tiinex Playthings

A deterministic Tiinex story/world engine, intended to become a React Verse through the future Core/App host boundary.

## What can I use today?

**A locally installable, experimental headless npm package. Not a playable Verse yet.**

- `@tiinex/playthings` exports the `time`, `story`, `observation`, `world`, `companions` and `scene` namespaces.
- Matching subpaths, such as `@tiinex/playthings/scene`, expose those modules without importing the whole root barrel.
- `@tiinex/playthings/node` is the separate Node-only PNG codec/compiler entrypoint.
- There is intentionally **no `@tiinex/playthings/react` export yet**. We will add a real React adapter, peer dependencies and App integration together, not an empty component or speculative host API.

The source package is `0.1.0-dev.0` and is now release-enabled, but this repository state does **not** claim that any npm version has been published. Publication is guarded: the one-time registry bootstrap must be explicit, and normal publication is only accepted from the GitHub Release workflow. APIs remain experimental and may change when Refactor Anchor supplies the qualified consumer contract. No external runtime dependencies or build/transpilation step are currently required.

## Run qualification

From the source repository:

```sh
npm test
npm run test:package
npm run test:release
```

`npm test` runs the headless fixtures. `npm run test:package` performs an actual offline `npm pack`, installs that tarball into an isolated consumer, exercises package-name imports and checks that no source symlink or private-path import is necessary. It also evaluates the browser-facing module graph in a VM without Node/DOM globals. `npm run test:release` checks the release policy, publish workflow and fail-closed publish guard. None of these are rendered-browser acceptance tests.

The Python graphics regression remains:

```sh
PYTHONDONTWRITEBYTECODE=1 python tools/playthings/generative_visual/tests/test_motion_sheet_tool.py
```


## Release preparation

The repository contains a guarded npm release path without adding a token to GitHub. See [RELEASING.md](RELEASING.md) for the one-time registry bootstrap, npm Trusted Publisher settings and the normal VS Code release flow.

The normal VS Code task is **`Tiinex: release @tiinex/playthings (auto)`**. It derives major/minor/patch from explicit release markers, breaking/feature commit intent and changes to the public package surface, then asks for confirmation before creating any release side effect. A separate preview task is read-only. Before 1.0, automatically detected breaking changes advance the minor version; 1.0.0 requires explicit major intent.

A published GitHub Release triggers `.github/workflows/publish.yml`, which verifies that `vX.Y.Z` exactly matches `package.json`, runs package qualification and publishes through npm Trusted Publishing / GitHub OIDC. No `NPM_TOKEN` is part of this workflow. The first prerelease must still be published once under the `dev` dist-tag so npm has a package to which the trusted publisher can be attached.

## Minimal headless use

After installing a local pack in a consumer:

```js
import { createStoryPlan } from '@tiinex/playthings/story';
import { createNavigationWorld } from '@tiinex/playthings/world';
import { createScenePlan, createSceneStore } from '@tiinex/playthings/scene';

const story = createStoryPlan([
  { id: 'example', parentId: null, historicalTimeMs: 0, authors: ['A'] },
]);
const world = createNavigationWorld({
  surfaces: [{ id: 'courtyard', width: 8, height: 8 }],
});
const plan = createScenePlan(story, {
  world,
  locations: { example: { surfaceId: 'courtyard', x: 2, y: 2 } },
  playback: { endHistoricalMs: 0 },
});
const store = createSceneStore(plan);
const unsubscribe = store.subscribe(() => console.log(store.getSnapshot()));
store.tick(16); // Caller drives presentation; no timers start inside the library.
store.setPaused(true);
unsubscribe();
store.dispose();
```

These are Playthings-owned fixture/adapter inputs, **not a replacement Tiinex schema or the future Core/App API**. The example contains explicit fictional fixture values, not inferred artifact semantics.

## Implemented boundaries

Historical/presentation clocks, elastic observation, story/frontier/ghost transitions and explicit navigation remain independent of React. The new [scene layer](src/verses/playthings/runtime/scene/README.md) stages camera/actors while keeping authoritative history separate from the order in which it is shown. Its manually driven external store keeps snapshots stable between updates.

The [spatial demand planner](src/verses/playthings/runtime/world/README.md) computes recursive common-zone/capacity requests and preserves prior Root reservations. It is **not** a complete automatic room/door/stair assembler. Unresolved sibling-surface order is reported rather than guessed from filenames.

The [companion layer](src/verses/playthings/runtime/companions/README.md) implements a **candidate** atlas profile, bounded PNG decoding and explicit cell compilation. Valid dimensions do not certify semantic pixels. Existing accepted artwork is unchanged; no Root atlas has been promoted by this implementation.

## Package ownership

- Core owns Tiinex semantics and the planned general companion resolver/provider contracts.
- App owns the planned React Verse lifecycle and provider composition.
- Site owns deployment and configuration. It remains read-only for this lane.
- Playthings owns its world/story/time/presentation and PNG defaults.
- User workspaces may supply artifact-local PNG companions.

Source remains under `src/verses/playthings/...`. Future final PNG defaults retain the mirrored `src/schemas/...` hierarchy without copying schema authority. No `reference/`, private Core imports or required per-artifact Playthings metadata sidecars are introduced.

## Distribution versus source delivery

The small npm tarball contains runtime modules, documentation, license/notice and future promoted PNG defaults only. It deliberately excludes `.topics`, tests and authoring images.

**The npm tarball is not a replacement-safe source snapshot.** Source deliveries to Sigma remain full Tiinex Anchor-to-Sigma Handoff packages, including unchanged source and lineage. Dependency workspaces are read-only context, never implicit apply targets.

## Planning and remaining work

Start with the [master Task](.topics/viewer/playthings/development/runtime/001-playthings-runtime-productization-task.trace.md). Current implementation evidence is in each domain's lineage; the master is not marked complete just because headless tests pass.

Core/App imports, companion provider composition/append, renderer, actual React mount, fullscreen, Root Gate host actions, dynamic building navigation, final atlas approval/promotion and human visual acceptance remain pending. There is no standalone demo.

The developer-only reseal helper now requires an explicit qualified integrity module via `--integrity-module`; it does not import an absent Site source file or silently copy Core. Run its `--help` for the local tooling contract.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.


## 2026-09-08 integration frontier

Master-only automatic versioning/publication is implemented through the single Core Node release helper. See `docs/NPM-PUBLISH.md`; release is disabled until `TIINEX_ENABLE_NPM_PUBLISH` and the npm environment are configured. No registry publication was performed by Anchor.
The `./app` and `./react` entrypoints now exist. Earlier statements below/above that React integration is pending describe the pre-adapter checkpoint. See `docs/APP-INTEGRATION.md` for the exact current boundary and remaining browser/product gates.
