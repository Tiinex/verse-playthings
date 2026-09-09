# Candidate companion atlas profile 1

**Executable layout candidate, not a new accepted visual contract.** These APIs implement Playthings-owned image mechanics. Core/App still owns actual resource lookup, ambiguity, specificity, inheritance and append. Presence of fallback artwork must not activate a spatial capability.

The filename is `<owner>.playthings.<channel>.png`. No JSON/Markdown companion or hidden pixel marker is required. The compiler specification is an ordinary build-time function argument; preserve recipes as source/tooling or lineage evidence, not as a new per-artifact runtime sidecar.

## Geometry implemented for qualification

| Channel | Columns | Cell | Row meaning / height |
|---|---:|---|---|
| character | 8 | 128×192 | 8 fixed rows: hybrid idle, four walk directions, rest, born, expire |
| verb | 8 | width/8 × image height | One 8-frame action row; rectangular choreography allowed |
| blueprint | 8 | square, width/8 | One reveal row |
| portrait | 8 | square, width/8 | neutral, active, warning, dormant, four ambient frames |
| props | 8 | square, width/8 | Variable rows; each prop has default, active, open/alternate, carried, damaged, recovered, placed, removed |
| tiles | 8 | 32×32 | Variable 2-row families; floor NESW masks 0..15 |
| structure | 8 | 32×32 | Variable 6-row families: wall masks 0..15, roof masks 0..15, four doorways, four windows, four stairs-up, four stairs-down |

Direction ordering is North/East/South/West. Mask bits are N=1, E=2, S=4, W=8. Slots and families are zero-based in code. This splits the former combined 64-slot authoring family into 16 surface slots and 48 structural slots. **The generated Root source has not been proven to follow these mask meanings**, so it is not automatically sliced and promoted.

Square-cell strips can use different resolutions as long as their geometry is unambiguous; each cell axis is bounded to 512 px in this candidate profile. Structural cells remain fixed at 32 px. Default decoded-pixel budget is 16,777,216. Tests do not claim these limits are an accepted mobile performance budget.

## Operations

`companionChannel(filename)` recognizes exactly the seven names. `validateAtlas({channel,width,height})` returns a geometry result; `atlasSlot(layout,item,slot)` returns its role and pixel rectangle.

`compileAtlas(source, specification)` works on `{width,height,data}` straight RGBA8 rasters. Supply one ordered mapping per output cell: `{source:{x,y,width,height}, quarterTurns?, flipX?, flipY?}` or explicitly `{empty:true}`. Rotation is clockwise, flips apply after rotation, and resizing uses deterministic nearest-neighbour sampling. Every source rectangle is checked before output allocation. No connected-component guessing, pruning, cell-centering, fit adjustment or semantic classification occurs implicitly. Callers own the output buffer; the input buffer is unchanged.

`inspectPng(bytes)` verifies bounded PNG container structure and CRCs, not IDAT decompression or artwork semantics. Node-only `decodePng`, `encodePng` and `compilePngAtlas` are exported from `@tiinex/verse-playthings/node`. The codec accepts non-interlaced 8-bit RGB/RGBA PNG, including RGB color-key transparency. Unsupported depth, palette/interlace decoding and APNG fail closed. All five row filters are supported. Encoding is RGBA8 and drops ancillary metadata by design; keep original source bytes for provenance. Identical encoded bytes are qualified for the same Node/zlib implementation; decoded pixels are the cross-codec fidelity check.

`node tools/playthings/inspect-companion.mjs <file.png> [channel]` inspects local bytes without writing/promoting. Supplying a channel for an authoring source does not promote that source.

## Deliberately separate gates

1. Container/decoded pixel integrity.
2. Atlas geometry and slot addressing.
3. Source-map correctness and semantic connectivity.
4. Visual review at runtime size.
5. Promotion beside the qualified schema/owner through existing asset lifecycle tooling.

Only the first two and explicit mapping mechanics are qualified in this slice. Blank cells do not change type. A PNG can pass geometry and still be unusable art.

Reference: [PNG Third Edition](https://www.w3.org/TR/png-3/) for container/filter/CRC mechanics. The atlas vocabulary is this project's candidate design, not part of PNG.


## Experience-candidate visual selection and byte lifetime

`resolveVisualCompanions` delegates winner selection entirely to Core/App, then checks historical disclosure, cardinality and a bounded resource count. It does not try a shadowed candidate after ambiguity or hidden-resource refusal. Dynamic schemas/providers are ordinary qualified inputs, not repository paths. Returned data is detached before freezing.

`createCompanionResourceStore` owns one immutable snapshot/revision: at most four concurrent reader slots, 48 retained entries, 8 MiB per PNG and 32 MiB retained PNG-plus-decoded-RGBA accounting by default. Unused leases are evicted before active ones; abort/dispose invalidates late results and revokes object URLs. The host is responsible for honoring cancellation in its actual transport; this module cannot terminate an arbitrary reader that ignores its signal. Pixel decoding can be supplied by the browser adapter. Invalid MIME, CRC, atlas geometry or decoded pixels is not ready artwork.

`sampleCompanionFrame` explicitly addresses each of the seven candidate channels. Occurrence-gated verb animation never supplies action truth. Geometry masks/directions are presentation input, not inferred pixel semantics. `semanticPixelsQualified` remains false, including after native browser decoding. Resource artwork is the current skin, not a historical pixel version.

Props collections preserve Core's append/key decisions. The small React decoration view is bounded to three resources and three items each, a display budget only. Other single-sheet renderers refuse multi-sheet collections rather than choose a competing winner. There is no fabricated/default PNG promotion in this candidate.
