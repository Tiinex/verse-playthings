# Turn-2 integration request — Playthings-owned request, not a sibling patch

Owner of Core/App/Site changes: **Refactor Anchor**. Playthings Anchor retains the Playthings lane. Turn 2 is explicitly still open; no delivery date or completion is inferred.

## P0 — immersion without trapping Sigma

The current `app/src/react/TiinexApplication.jsx` supplies `setImmersive`, `exitVerse`, `switchVerse`, `requestFullscreen` and `readCompanion`. It keeps Viewer mounted while another Verse is selected, but still renders its own Back button in the Verse stage. Playthings calls the host callbacks and covers the viewport; it does not query, delete, restyle or reparent host DOM.

Host acceptance requirements:

1. When Playthings requests immersive mode, legacy header/footer, old Verse switcher and duplicate Back controls are genuinely hidden and excluded from focus/accessibility traversal. Prevent background scrolling. A fixed overlay alone does not meet this requirement.
2. Exit, successful Verse switch, load failure and unmount restore the host's chrome, focus and loaded Workspace/Viewer state. Provide an emergency exit on a failed lazy load or render. Root Gate remains available in Playthings empty/error states.
3. Browser fullscreen is optional and user-invoked. Denial must not trap navigation. Native Escape may exit browser fullscreen before any Verse keyboard handler; do not assume Escape always reaches React.
4. Keep host controls outside the narrative: Root Gate is navigation, not a Tiinex source event or an acceptance signal.

## P0 — whole-source-set smoke contract reconciliation

The carried `site/tools/browser-smoke.py` asserts `2 / 2 declared historical moments`, seeks to zero and asserts `1 / 2 ...`, and later clicks `Fullscreen` without opening Root Gate. That describes the earlier UI, not this candidate.

The new presentation deliberately avoids exposing future total counts. It supplies:

```text
[data-playthings-state="ready"]
[data-playthings-immersive="true"]
[data-visible-artifact-count]
[data-visible-moment-count]
Root Gate menu       (button, opens the dialog)
Back to Viewer       (accessible name of the in-Verse escape)
History position     (slider)
Fullscreen           (optional button inside Root Gate)
```

Update the **host-owned** smoke to validate semantic availability rather than old prose: the two-moment fixture exposes visible-moment count `2` at Latest and `1` after seek zero, with no future total in story controls. Open Root Gate before requesting browser fullscreen. Ensure the hidden host Back button does not create duplicate accessible selectors. Keep the existing real lazy-import, error collection, return and Viewer-state-retention checks; do not delete them to get a green gate.

Add actual 360×800 and desktop viewport checks, browser fullscreen return/denial, keyboard focus, touch-style pointer navigation, repeated enter/exit and late image completion after exit. The primitive browser fixture in Playthings is not a replacement for these tests.

## P1 — genuine Verse inventory

Playthings can consume optional `host.availableVerses` entries `{id,label,enabled?}` and call `host.switchVerse(id)`. This is a proposed adapter shape, not a claim that the current public host supplies it. Missing/invalid/duplicate inventory fails closed: the supported path remains Root Gate → Viewer → the host's Verse selector. No hardcoded sibling Verse ids are manufactured.

Refactor should settle the host-owned shape and lifecycle, then coordinate an explicit Playthings adapter change if it differs. Inventory is runtime navigation availability, not historical schema/skill knowledge.

## P1 — dynamic Workspace schema companions and introduction binding

Three different upstream responsibilities must not be conflated:

- runtime schema declarations and qualified ancestry;
- companion ownership/provider registration and byte access;
- explicit schema-definition/identity introduction binding to loaded historical Workspace artifacts.

Actual carried App supports externally supplied `schemaDeclarations`, `companionProviders` and registered resource readers; the real integration tests exercise them. However, the carried Core `companionProviderFromWorkspace` convenience inference only tries owner `.trace.md`, `.workspace.md` and `.md` candidates. A `custom.leaf.schema.md` plus `custom.leaf.playthings.portrait.png` pair does not by itself produce a schema-owned provider. Explicit artifact ownership would still describe the **definition artifact's** own presentation, not automatically a default for every instance of the schema it defines.

Please close automatic dynamic schema discovery/registration through qualified schema identity, without promoting filename/repository placement to authority. Preserve the distinction between a schema artifact's companions as story material and that definition's companions as schema defaults for its instances.

Playthings' `introductions` ledger API is internal, opt-in and headless. The shipped React adapter deliberately does not guess or pass such bindings from the current App data. For tech/skills or identity-specific character appearance, supply an explicit qualified subject→Workspace-artifact binding, including availability and ambiguity/unknown-time outcomes. Embedded+Workspace duplicates must share one qualified subject, with disclosure gated to the historical event, including rewind. Ordinary artifact use of a schema is not its definition/discovery. No UI unlock should be based on a `state` string without upstream qualification.

## P1 — companion provider revision notification

The carried App `setCompanionProviders` changes configured providers but does not replace the application-data snapshot. New queries see the new providers; an existing React memo/resource lease is not automatically notified.

The host needs a subscription/revision boundary covering provider inventory, resource bytes/digests and schema ancestry changes, even when artifact bytes are unchanged. Playthings must recreate/re-resolve the affected model and byte-store against that revision, without late callbacks restoring a previous skin. The current candidate safely handles **replacement application snapshots**, not an invisible in-place registry mutation. Do not work around this by polling private Core/App state.

## Optional — source inspector

Playthings has its own read-only metadata inspector. It can show a host action when `host.openArtifact(id)` is explicitly supplied. This callback is not present in the carried host contract and is not required for the bounded first experience test. A host implementation must retain artifact identity/source and preserve historical context, rather than open an unrelated latest artifact by matching a label.

## Integration order

Receive the actual new Turn-2 source; review these boundaries; apply only Playthings from the new carrier; reconcile P0 host/test contracts in the proper lane; run the actual installed-package/source-set build/browser qualifier; then give Sigma a qualified experience checkpoint. P1 identity/schema UI stays disabled unless its binding is genuinely available. Record exact versions/commits used rather than treating the carried sibling snapshots as current Turn 2.

The carried command, run from a parent containing all four repositories, is:

```sh
node core/tools/qualify-source-set.mjs --core core --app app --site site --playthings playthings
```

Use Turn 2's updated repository-owned equivalent if its contract changes. It stages scratch copies, installs actual packages and runs the real browser path. Do not treat node-only checks, source syntax, native primitive fixtures or an npm publication receipt as this gate.
