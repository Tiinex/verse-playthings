# Tiinex Playthings

A deterministic Tiinex lineage/story presentation engine with an experimental App/React Verse adapter, qualified spatial projection and a guarded multi-surface renderer with a bounded Root fallback.

## What can I use today?

**A locally installable experimental package with an immersive React Verse adapter. Qualified spatial presentations can render across surfaces; browser/human acceptance is still incomplete.**

- `@tiinex/playthings` exports the `time`, `story`, `observation`, `world`, `companions` and `scene` namespaces.
- Matching subpaths, including `@tiinex/playthings/app` and `@tiinex/playthings/react`, expose the App adapter and React view without private Core/App imports.
- `@tiinex/playthings/node` is the separate Node-only PNG codec/compiler entrypoint.
- React 19.2.7 is an optional peer. The React Verse enters host immersive mode and occupies the viewport with an in-Verse Root Gate for exit. It uses a qualified rectangular multi-surface presentation when exact spatial companion activation completes; otherwise it fails back to the deterministic Root-only SVG scaffold. Cross-surface camera/actor transitions stay explicit and never interpolate diagonally between unrelated surfaces.

The source package is `0.1.0` and is release-enabled, but this repository state does **not** claim that any npm version has been published. Publication is guarded: the one-time registry bootstrap must be explicit, and normal publication is only accepted from the GitHub Release workflow. APIs remain experimental. The headless/runtime package needs no bundled runtime dependency; the React entrypoint uses the host React peer and real rendered-browser qualification remains an external gate.

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

The [world layer](src/verses/playthings/runtime/world/README.md) qualifies exact companion capabilities, computes recursive common-zone/capacity requests, preserves prior Root reservations, and can compile a bounded rectangular geometry/navigation candidate with real barriers, doors, passages and stairs. It does not infer topology from pixels, and unresolved semantic ordering is never guessed from filenames.

The [companion layer](src/verses/playthings/runtime/companions/README.md) implements a **candidate** atlas profile, bounded PNG decoding and explicit cell compilation. Valid dimensions do not certify semantic pixels. Existing accepted artwork is unchanged; no Root atlas has been promoted by this implementation.

## Package ownership

- Core owns Tiinex semantics and companion resolver/provider precedence.
- App owns the React Verse lifecycle, schema ancestry projection and provider composition.
- Site owns deployment and configuration. It remains read-only for this lane.
- Playthings owns story/time/spatial presentation, choreography and optional PNG defaults.
- Qualified providers may supply artifact-local or schema-owned Playthings companions from workspaces, deployments, packages or other host-approved sources. Playthings never treats repository location as companion authority.

Source remains under `src/verses/playthings/...`. Future final PNG defaults retain the mirrored `src/schemas/...` hierarchy without copying schema authority. No `reference/`, private Core imports or required per-artifact Playthings metadata sidecars are introduced.

## Distribution versus source delivery

The small npm tarball contains runtime modules, documentation, license/notice and future promoted PNG defaults only. It deliberately excludes `.topics`, tests and authoring images.

**The npm tarball is not a replacement-safe source snapshot.** Source deliveries to Sigma remain full Tiinex Anchor-to-Sigma Handoff packages, including unchanged source and lineage. Dependency workspaces are read-only context, never implicit apply targets.

## Planning and remaining work

Start with the [master Task](.topics/viewer/playthings/development/runtime/001-playthings-runtime-productization-task.trace.md). Current implementation evidence is in each domain's lineage; the master is not marked complete just because headless tests pass.

The public Core/App adapter, bounded Root fallback, exact-capability → rectangular world assembly, and guarded candidate → active multi-surface renderer cutover are now present.
The immersive viewport shell and Root Gate exit path are now implemented but still require dependency-equipped React/Vite rendered-browser and Sigma acceptance. Also pending are longer-lived continuity state for demand-footprint growth across live snapshot replacement and final atlas approval/promotion. No tech-tree/skills surface is exposed until App/Core can provide an explicit qualified binding between a Workspace schema-definition artifact and the schema declaration it introduces; pre-discovered runtime schemas are never treated as story discoveries by repository/path inference. There is no claim that generated rectangular presentation geometry is Tiinex spatial source truth.

The developer-only reseal helper now requires an explicit qualified integrity module via `--integrity-module`; it does not import an absent Site source file or silently copy Core. Run its `--help` for the local tooling contract.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.


## 2026-09-08 integration frontier

Master-only automatic versioning/publication is implemented through the single Core Node release helper. See `docs/NPM-PUBLISH.md`; release is disabled until `TIINEX_ENABLE_NPM_PUBLISH` and the npm environment are configured. No registry publication was performed by Anchor.
The `./app` and `./react` entrypoints now exist. Earlier statements below/above that React integration is pending describe the pre-adapter checkpoint. See `docs/APP-INTEGRATION.md` for the exact current boundary and remaining browser/product gates.
