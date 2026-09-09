# App ↔ Playthings — landed source contract, 2026-09-09

Exact candidate composition: Core 0.1.1, App 0.1.1, Playthings 0.1.0.
The source-independent headless engine remains intact. The App adapter now exposes both
the bounded Root fallback and a separately qualified spatial-world candidate. A complete
candidate now becomes the active multi-surface presentation world; incomplete or absent
spatial activation keeps the fallback active. This remains an integration surface, NOT
final rendered-browser or visual acceptance.

## Public entrypoints

- `@tiinex/playthings/app`: createPlaythingsVerse, createAppVerseModel, sampleAppVerse, sampleAppScene.
- `@tiinex/playthings/react`: default/PlaythingsVerse React function component.
- Existing time/story/world/observation/companions/scene/node exports remain unchanged.
- `@tiinex/app/viewer`: mountTiinexApp(element, config).
- `@tiinex/app`: runtime, snapshots, explicit Verse and companion contracts.

Site imports createPlaythingsVerse from the data-only app subpath. Only selecting
Playthings imports React/presentation code. React is a host peer, not a private
copy. No Site source or private Core/App module is imported by Playthings.

## Adapter inputs

The current App VerseHost passes `applicationData`, `getPlaythingsStoryRecords`,
`resolveCompanions`, `host` and `verse`. Snapshot schema must be
`tiinex.core.application-data.v1`. createAppVerseModel validates the snapshot,
requires matching IDs, enforces a record budget, then calls the existing
createStoryPlan. It does not re-parse artifacts or invent missing Parents/actors.

When `resolveCompanions` is available, the model also builds `spatialCandidate` through
the Playthings world chain. Exact artifact resources and exact-schema defaults may
activate `tiles` / `structure` / `props`; ancestor-schema, Root and fallback resources
cannot activate them. Resolution authority remains Core/App-owned. The resulting ready
candidate can contain rectangular enclosures, real wall barriers/doors, multiple
surfaces, passages and stairs. `semanticPixelsQualified` remains false: pixels are not
read as hidden geometry.

`presentationWorld` is selected fail-closed. It uses `qualified-spatial` only when
the candidate is `ready`, navigation is compiled, geometry is qualified, exact spatial
capability provenance is present, and at least one `tiles` or `structure` activation
exists. Resolver availability or Props-only artwork does not replace the Root fallback.

The React view renders the selected surface, qualified rectangular enclosures, blocked
cells, wall barriers, door/stair endpoints, artifact markers and actors. Cross-surface
camera/actor transitions use explicit endpoints; the renderer never draws a fictitious
diagonal between unrelated surfaces. The Root scaffold remains available as fallback;
its artifact placement is a stable presentation hash only, collisions stack visibly,
later history cannot move earlier placements, and renderer budget overflow is explicit.
Historical presentation uses source-declared times; missing timestamps remain explicit.
Snapshots remain owned by App. Viewer stays mounted, hidden while external Verse is
shown, so returning does not recreate source state. No mutation/automation is added.


## Immersive Verse and Root Gate

The Playthings Verse descriptor now declares immersive/fullscreen presentation intent. On mount, the React Verse calls the host `setImmersive(true)` callback and restores it on unmount. The Verse itself occupies the browser viewport with a fixed presentation layer, so existing Viewer chrome and host fallback controls remain behind the Playthings surface during the experience. Browser Fullscreen API remains optional and is not required for the normal Playthings path.

The visible navigation escape is the in-Verse **Root Gate**. It calls the host-owned `exitVerse()` callback to return to Viewer, where the host Verse switcher becomes available again. Playthings does not own the host registry or invent Verse ids. The Root Gate also owns presentation-only replay/pause/latest controls.

This is deliberately a presentation boundary: immersive mode, viewport coverage and Root Gate navigation create no Tiinex semantic authority and do not mutate Workspace material.

## Dynamic schemas, story visibility and companion source neutrality

Playthings never assumes a schema or its companions live in the Playthings repository. It queries the App/Core resolver using the loaded artifact owner. App/Core remains responsible for qualified schema ancestry, exact artifact/schema specificity and provider precedence; the selected resource may therefore originate from a Workspace, deployment/provider, package or other qualified host source. Playthings only consumes the resolver result and applies its stricter exact-spatial-capability gate.

Runtime schema knowledge and story knowledge are intentionally separate. Embedded/pre-discovered schemas may be used immediately for parsing/validation/ancestry/companion resolution, but that does not make a schema a discovered item in the Playthings story. A schema becomes ordinary story material only when its artifact is present in a loaded Workspace and historical sampling reaches that artifact.

The current App projection does not expose a sufficiently explicit artifact-to-schema-definition identity binding for Playthings to build a truthful tech-tree/skills discovery surface. Therefore Playthings does **not** infer such a binding from filename, path, title or the fact that an ordinary artifact uses the same schema id. Tech/skills remain intentionally absent until that qualified host projection exists.

## Companion reads

Portrait lookup requests playthings/portrait for the exact loaded artifact owner.
Spatial capability lookup requests Playthings `tiles`, `structure` and `props` through
the same host resolver and applies a stricter activation gate described above.
App composes workspace-local and explicitly registered package/deployment providers.
Resolution remains in Core; Playthings does not implement a competing resolver.
Ambiguous or blocked resources fail closed. Portrait bytes are inspected with
Playthings' existing bounded PNG/CRC inspector, turned into an object URL and revoked
on change/unmount. Aborted/stale effects cannot repaint the new selection. Metadata
presence alone is not loaded byte availability.

No default PNG resources were supplied in the current Playthings source; this pass adds
no fabricated art. Schema-default and override registries remain explicit host/provider
configuration using the existing mirrored src/schemas convention.

## What is verified vs pending

Local source qualification covers the runtime suite, offline installed-package consumer,
master-only release-policy suite and App-adapter tests against the carried Core 0.1.1 and
App 0.1.1 source snapshots. Adapter coverage includes the real Core companion resolver
feeding exact spatial capabilities into a geometry-qualified Playthings candidate.
World tests cover fail-closed fallback activation, bounded nested packing, append-stable
enclosure/entry placement under surface growth, real door barriers, container passages
and multi-surface stair navigation.

Pending external execution: pinned React/Vite bundle and rendered browser tests, including the immersive viewport/Root Gate path; real GitHub OIDC/account configuration and npm publication remain independently evidenced by the release flow. No registry publication is
claimed here. Refactor Anchor retains Turn 2; Playthings does not mutate Core/App/Site.

The candidate → active multi-surface cutover and first immersive Root Gate shell are now implemented behind strict qualification boundaries. The next product gate is dependency-equipped rendered-browser + Sigma experience acceptance, followed separately by longer-lived continuity state when a live replacement snapshot expands an already-settled demand footprint. The Root scaffold remains the deliberate fallback, not a deprecated semantic source. Final atlas approval/promotion and human visual acceptance remain separate gates.
