# Package / companion / scene qualification receipt

This is supporting material for the same `001-2-1` Evidence event; `-01` is attachment order, not child lineage.

## Source scope

- Input carrier: `tiinex-site-playthings-006-1-1-1-1-anchor-to-sigma.handoff-package.zip`.
- Input SHA-256: `e63512bfb8922fc536ce767d5f49f4da9dcf877985d23a0f30b32eb8260817c7`.
- Input Playthings: 138 files. Final complete Playthings candidate: 173 files (35 added, 7 changed, zero deleted). All original trace/workspace artifacts remain byte-identical; new lineage is additive. No baseline source deletions are authorized or performed.
- Business: 87 files; Docs: 157; Site: 1214. All are frozen complete context, not apply targets.
- All 13 original PNGs remain byte-identical. No graphics re-generation, promotion or separate demo.
- No remote checkout/write. Latest landed state is as reported by Sigma; this is not a fresh GitHub audit.

## Executable checks

- `npm test`: 139 top-level tests, 139 pass, zero fail/skip. Includes the previous 87 tests plus 22 companion, 13 recursive demand and 17 scene/store tests.
- Companion property subcases include 80 RGBA roundtrips and all 16 rotation/flip combinations; these are subcases, not inflated headline test counts.
- Existing independent navigation reference-algorithm tests remain included.
- `npm run test:package`: real offline tarball pack/install into isolated node_modules, no symlink, no external packages, no publication. Public imports work; private deep imports and nonexistent React export fail.
- Browser-facing 23-module graph evaluates in a browser-like VM with standard TextEncoder/TextDecoder/structuredClone but no Node or DOM globals. No rendered browser, hydration or React test is claimed.
- All 13 carried PNGs decode/encode/decode without pixel differences and independently match Pillow RGBA. Source bytes are not rewritten.
- Existing Python graphics assertions: pass, margin 6, alpha roundtrip true, two surgery assertions.
- New codec checks invalid CRC/order/filter, truncation, unsupported encoding, decompression/output bounds, transparency range and APNG rejection.
- Node v22.16.0; npm 10.9.2; Pillow 12.3.0.

## Package versus source

Current package is `@tiinex/playthings@0.1.0-dev.0`, private. The tested npm pack has 33 files / 40254 compressed bytes, deliberately excluding authoring PNGs, .topics, tools and tests. It is NOT the complete source snapshot and must not be used with Sigma's replacement tool.

`.gitignore` retains its previous rules and adds only local `*.tgz` output exclusion. Runtime .mjs files, tests, package.json, package-lock.json, documentation and lineage remain full source.

## Additional tooling correction

The existing reseal helper still imported an absent Site integrity module. It now requires `--integrity-module` pointing to an explicitly qualified local Tiinex implementation; no Core internals are guessed or copied. `--check` performs read-only self/local-target checks. In this turn the verified carrier's integrity implementation supplies that dependency. This is developer-tool injection, not a proposed Core public API.

## Remaining gates

- Actual Core/App exports and provider provenance/append integration.
- Real React binding, Verse host lifecycle, fullscreen and Root Gate actions.
- Final atlas profile approval, actual Root source mapping and visual/runtime-size review before promotion.
- Full room/corridor/door/stair assembly and emitted navigation; the current world module only plans capacity/reservations.
- Physical multi-agent collisions, complete actor animation and persistent-result prop lifecycle.
- Human visual acceptance, mobile performance and real browser matrix.

## Reference material checked for this implementation

- [Node package exports](https://nodejs.org/api/packages.html): entrypoint encapsulation and environment separation.
- [npm package.json](https://docs.npmjs.com/files/package.json/): package files/exports/private boundary.
- [npm pack](https://docs.npmjs.com/cli/v10/commands/npm-pack/): actual tarball qualification.
- [React external store](https://react.dev/reference/react/useSyncExternalStore): cached immutable snapshot/subscribe contract; no React implementation is claimed here.
- [PNG Third Edition](https://www.w3.org/TR/png-3/): bounded PNG container, CRC, scanline filters and data representation.

The Playthings atlas roles and scene rules are project design/fixtures, not facts supplied by these external specifications.
