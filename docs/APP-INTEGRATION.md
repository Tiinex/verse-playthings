# App ↔ Playthings — landed source contract, 2026-09-09

Exact candidate composition: Core 0.1.1, App 0.1.1, Playthings 0.1.0.
The source-independent headless engine remains intact. The App adapter now exposes both
the current bounded Root-only renderer model and a separately qualified spatial-world
candidate. This is still an integration surface, NOT completion of the final spatial
renderer.

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

The current React view intentionally still renders the deterministic Root-only SVG
scaffold. Semantic story, qualified spatial candidate and active presentation geometry
remain separate until the multi-surface renderer/camera cutover is itself qualified.
The scaffold's artifact placement is a stable presentation hash only: collisions stack
visibly, later history cannot move earlier placements, and renderer budget overflow is
explicit. Historical presentation uses source-declared times; missing timestamps remain
explicit. Snapshots remain owned by App. Viewer stays mounted, hidden while external
Verse is shown, so returning does not recreate source state. No mutation/automation is
added.

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

Pending external execution: pinned React/Vite bundle and rendered browser tests, real
GitHub OIDC/account configuration and npm publication. No registry publication is
claimed here. Refactor Anchor retains Turn 2; Playthings does not mutate Core/App/Site.

The next renderer step is **candidate → active multi-surface renderer**: preserve the
semantic/presentation boundary, carry continuity state where settled geometry must
survive growth, qualify camera behavior across surfaces, and only then retire the
Root-only scaffold. Final atlas approval/promotion and human visual acceptance remain
separate gates.
