# App ↔ Playthings — Experience Candidate 1

Carried source composition: Core 0.1.1, App 0.1.1, Playthings 0.1.0. These version labels describe tested source packs, not registry publication or Refactor Turn-2 completion. Read [candidate scope](EXPERIENCE-CANDIDATE-1.md) and [the required host integration boundary](TURN-2-HOST-BOUNDARY.md) before a human test.

## Public boundary

The App VerseHost passes `applicationData`, `getPlaythingsStoryRecords`, `resolveCompanions`, `host` and `verse`. Playthings imports neither private Core/App paths nor Site source. The `@tiinex/verse-playthings/app` descriptor is dependency-free; selecting `@tiinex/verse-playthings/react` loads the optional pinned host React peer.

The model requires `tiinex.core.application-data.v1`, matching unique record IDs and primitive metadata. Core's declared-data projection does not itself certify artifact schema/integrity; Playthings adds no such certification. It consumes the supplied historical/Parent/participant/Handoff/occurrence projection without reparsing source, guessing identities or treating camera visits as occurrences.

`createAppVerseModel` accepts `previousModel`, input/drawing budgets and optional **Playthings-internal** `introductions` for qualified fixture/future-host bindings. `sampleAppScene` adds historically eligible `presentationWorld` and `knowledge` to its scene snapshot. The React adapter does not manufacture introduction bindings from the current host.

## Rendering and time

Exact `tiles` / `structure` companion activation can produce a compiled spatial world; exact Props capability alone cannot. Unqualified, conflicting, incomplete or over-budget candidates retain the deterministic bounded Root scaffold. Historical topology is filtered using explicit assembler ownership before routing and drawing. Shared obstacles retain any qualified visible owner; links require all declared owning/end-point dependencies. Parentless Root reservations are not source geography.

Camera/actor movement follows compiled presentation walkability. Cross-surface travel uses explicit endpoints instead of interpolating between unrelated coordinate frames. Read-only shelf/inspector availability remains the complete admitted story even when physical depiction is unavailable. Same-time source facts are available together; a sequential camera visit order does not give them new semantic ordering.

Snapshot refresh preserves compatible placements and observation position. Incompatible growth is held explicitly until user Rebuild; removed/changed semantics or changed capability receipts cause a truthful reset. This is not a claim that arbitrary live growth has been solved.

## Companions

All selection remains Core/App-owned: artifact specificity, exact schema, qualified ancestry, generic Root; provider precedence only resolves equal specificity. Dynamic declarations/providers are supported without repository assumptions. Spatial Props collections append exactly as returned; inherited-only artwork cannot activate capabilities. Byte access uses host `readCompanion` only.

The renderer owns bounded shared leases, CRC/container and atlas-geometry inspection, browser decoding, current-snapshot cancellation and URL revocation. A valid atlas is still only `playthings-atlas-candidate-1`, with `semanticPixelsQualified:false`. Each channel has explicit crop/state sampling. Portrait strips are cropped to one cell, not squeezed into a portrait. Verb work animation requires supplied `occurred` status. No production default PNG was supplied or promoted.

Unbound runtime schemas may style the current presentation without becoming story discoveries. Explicit known future schema/identity introduction bindings restrict historical disclosure. Core/App must qualify the actual schema definition rather than infer its identity from a `.schema.md` filename. Provider-only changes also require an upstream observable revision; the carried host does not currently notify the snapshot stream for them.

## Immersion and controls

Playthings requests `host.setImmersive(true)` and restores it on unmount. Its own fixed `100% × 100dvh` layer includes Root Gate exit, keyboard/touch-friendly controls, timeline, reduced motion and read-only inspection. Browser fullscreen is optional and user-invoked.

The host must genuinely hide/inert old chrome/footer/duplicate exit controls, isolate focus/background scroll and restore Viewer state on return. Playthings covering it is not proof that the host has done so. An optional host-provided Verse list can populate Root Gate; otherwise exit to Viewer is the supported selector path. No guessed registry is introduced.

The old Site smoke's prose counters and always-visible Fullscreen selector require a coordinated update. The new stable attributes are documented in `TURN-2-HOST-BOUNDARY.md`. Do not make future totals visible merely to satisfy an outdated assertion.

## Qualification levels

1. Runtime/package/release and **actual installed carried Core/App** tests run locally.
2. Genuine Chromium primitive decoding/crop/disposal/dialog checks run separately, using a network-free local-source import map and diagnostic PNGs. They mount neither React nor App.
3. Pinned React/Vite/whole-host browser execution, old-footer/focus isolation, all seven channels against approved real artwork and Sigma experience acceptance remain separate open gates.

Refactor Anchor retains Turn 2. This candidate changes only Playthings, performs no remote writes and neither requests nor claims npm publication.
