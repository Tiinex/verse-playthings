# App ↔ Playthings — landed source contract, 2026-09-08

Exact candidate composition: Core 0.1.1, App 0.1.1, Playthings 0.1.0.
The prior source-independent headless engine remains intact. Its 139 runtime tests
are preserved. A real React entrypoint and a small history/portrait view now bridge it
into App. This is an integration surface, NOT completion of the full world renderer.

## Public entrypoints

- `@tiinex/playthings/app`: createPlaythingsVerse, createAppVerseModel, sampleAppVerse.
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

The view supports empty Workspace guidance, bounded historical-position selection,
frontier/actor depiction, portrait resources, exit and fullscreen request. Historical
presentation uses source-declared times; missing timestamps are omitted with an
explicit count. Story findings remain available without claiming semantic authority.
Snapshots remain owned by App. Viewer stays mounted, hidden while external Verse is
shown, so returning does not recreate source state. No mutation/automation is added.

## Companion reads

Portrait lookup requests playthings/portrait for the exact loaded artifact owner.
App composes workspace-local and explicitly registered package/deployment providers.
Resolution remains in Core; Playthings does not implement a competing resolver.
Ambiguous or missing resources are not replaced with invented source facts. Successful
reads are inspected with Playthings' existing bounded PNG/CRC inspector, turned into
an object URL and revoked on change/unmount. Aborted/stale effects cannot repaint the
new selection. Metadata presence alone is not loaded byte availability.

No default PNG resources were supplied in the current Playthings source; this pass
adds no fabricated art. Schema-default and override registries remain explicit
host/provider configuration using the existing mirrored src/schemas convention.

## What is verified vs pending

Local: installed npm tarballs; headless App/Core → actual story engine; exact Parent
and empty history cases; `.topics/.relations` artifact portrait using a real PNG;
updates/unloaded resources; package exports and no source symlinks; master-release
policy and real Git/npm staging tests with simulated registry responses.

Pending external execution: pinned React/Vite bundle and rendered browser tests,
real GitHub OIDC/account configuration and npm publication. Network DNS is absent in
the Anchor container. The Site workflow and Core source-set qualification tool run
those real tests when dependencies can be obtained; no fake React/Vite is substituted.

Next Playthings Anchor should start from the carried successor Handoff, run the
source-set qualification, then develop the actual scene/world renderer according to
the existing Playthings plan. The minimal history view is scaffolding, not a redesign
of that plan. No new world schemas, authority rules, or per-artifact Playthings
metadata were introduced. Refactor Anchor retains Turn 2; VS Code stays later.
