# Semantic / Event Scenario Matrix — Designer Pass 1

This is co-event supporting material for [the semantic review](001-semantic-event-model-review-topic.trace.md). It is not a collection of new user artifacts, a runtime test report, or acceptance evidence.

**Method:** read the carried schema boundaries and actual repository evidence, then desk-check constructed counterexamples against the earlier conversation model. `source-bound` means the constraint is grounded in a source rule; `proposal` means a depiction policy still needs user approval; `consumer-dependent` means a future Core/App/provider guarantee is required. None is an executable PASS result.

Dates, letters and events below are illustrative. Each oracle describes what a future executable fixture must verify after contracts are available. References to "Core" are requirements, not invented export names.

## S01 — Serial authorship

- Classification: source-bound.
- Given: P authored by A; later child Q authored by A. No performed-work claim.
- Proposed depiction: Reuse a contribution presence if compatible with the scene; show Q appearing at its creation anchor.
- Must not infer: Do not infer that Q completed the work described by P.
- Future test oracle: Displayed source is Q and Parent is P; no completion event is fabricated.

## S02 — Author change

- Classification: proposal.
- Given: Child Q names B while Parent P named A; no Handoff.
- Proposed depiction: Let B present/continue from P; distinguish informal contribution succession from a formal packet exchange.
- Must not infer: No transfer of responsibility, consent or prior-author removal from the whole world.
- Future test oracle: Inspector describes authorship change only; no From/To edge is synthesized.

## S03 — Partial author overlap

- Classification: proposal.
- Given: A becomes A+B, later only B is named.
- Proposed depiction: Show B joining the contribution and later only B contributing to that artifact.
- Must not infer: Do not equate author omission with resignation, death, abandonment or end of another branch.
- Future test oracle: Participant delta affects this contribution only.

## S04 — Handoff writer is not endpoint

- Classification: source-bound.
- Given: Handoff authored by C, From A, To B, transfer limited to work X.
- Proposed depiction: Show declared A-to-B offer/transfer of X; retain C in authorship detail.
- Must not infer: Do not replace From with C or apply transfer to every linked artifact.
- Future test oracle: Only qualified Transfers and scoped endpoints appear in the formal scene.

## S05 — Transport is not acceptance

- Classification: source-bound.
- Given: A qualified Handoff ZIP was delivered/read, but no recipient acceptance exists.
- Proposed depiction: Show delivery/orientation separately if observable; Handoff remains a declaration.
- Must not infer: No accepted/completed badge or performance claim from package success.
- Future test oracle: Delivery does not advance unrecorded acceptance or outcome state.

## S06 — Planned or cancelled Event

- Classification: source-bound.
- Given: Event lists A/B as required/optional parties; state is planned, tentative or cancelled.
- Proposed depiction: Show the plan/notice/cancellation, not an enacted meeting; invited/required parties are not attendees.
- Must not infer: Do not animate drinking/attendance just from names or a planned time.
- Future test oracle: No performed action until the source supports occurrence and participant roles.

## S07 — Event writer and occurrence time differ

- Classification: source-bound.
- Given: Sigma writes at 12:00 that Alice/Bob participated at 10:00; occurrence is explicitly recorded.
- Proposed depiction: At the document anchor, show the reported Event with its separate time/roles; retain both clocks/claims in inspection.
- Must not infer: Do not make Sigma a drinker or state the Event occurred at 12:00.
- Future test oracle: Document Created At and declared Event time remain distinct and inspectable.

## S08 — Evidence / rejected Decision

- Classification: source-bound.
- Given: Evidence preserves a failed attempt; a later Decision rejects that attempt.
- Proposed depiction: Show review/material and a rejection appropriate to its actual target.
- Must not infer: Evidence type or a generic status string must not generate success; rejection is not global destruction.
- Future test oracle: Qualified target/state governs effect; surrounding accepted assets remain unchanged.

## S09 — New sibling from old checkpoint

- Classification: source-bound.
- Given: P has child A; much later B is created with Parent P.
- Proposed depiction: At B creation revisit P context and show a fresh branch contribution.
- Must not infer: Do not connect B as a continuation of A just because A was rendered last.
- Future test oracle: Branch anchor is P; B appears at its own Created At.

## S10 — Late-loaded old sibling

- Classification: consumer-dependent.
- Given: B created in January is first loaded into the Viewer in September.
- Proposed depiction: Signal newly available historical material; retain its January anchor in historical replay.
- Must not infer: Do not depict the same record as September work or quietly rewrite a pinned replay.
- Future test oracle: Ingestion notification and artifact occurrence stay separate.

## S11 — Siblings without activity intervals

- Classification: proposal.
- Given: Two sibling artifacts name the same Role and have creation timestamps but no execution spans.
- Proposed depiction: Display separate branch episodes/presences as representatives of the branches.
- Must not infer: No claim that a real person was physically multitasking between both dates.
- Future test oracle: Branch count is not reported as proven concurrent workers.

## S12 — Explicit concurrency

- Classification: consumer-dependent.
- Given: Qualified records establish overlapping activity spans or simultaneous occurrences in separate branches.
- Proposed depiction: Show concurrent branch-scoped presences with the same resolved Role identity when appropriate.
- Must not infer: Do not turn several presences into several distinct people/Role identities.
- Future test oracle: Concurrency claim points to the qualifying spans/events, not filename or leaf count.

## S13 — Convergence with non-parent inputs

- Classification: source-bound.
- Given: Q has one Parent A and explicit typed input relations to B/C.
- Proposed depiction: Show one continuity path plus the supported contributing inputs.
- Must not infer: Do not create multiple Parents or pick an arbitrary sibling as continuity.
- Future test oracle: Relation types/targets remain distinguishable from Parent.

## S14 — Unavailable/cyclic Parent

- Classification: source-bound.
- Given: One Parent is absent from loaded scope or traversal cycles.
- Proposed depiction: Expose unresolved/conflicting ancestry; a visual holding area may be used without creating an edge.
- Must not infer: Do not call the artifact parentless or repair the cycle from paths.
- Future test oracle: Termination is bounded; missing data stays missing, Root is only a visual fallback.

## S15 — Timestamp conflicts

- Classification: consumer-dependent.
- Given: A child declares an earlier Created At than its available Parent, or time is invalid/missing.
- Proposed depiction: Expose chronology uncertainty and keep exact recorded values visible.
- Must not infer: Do not silently sort by filename, invent a UTC time, or change Created At to fit choreography.
- Future test oracle: Qualified ordering/failure state is requested from Core; unresolved material is not given false precision.

## S16 — Same creation time after edit

- Classification: consumer-dependent.
- Given: The current representation changed but retains Created At; no revision event time is supplied.
- Proposed depiction: Show a newly observed version/change with its known provenance limits.
- Must not infer: Do not manufacture an original revision history or use file mtime as an authoritative event.
- Future test oracle: Current snapshot is labelled as such; revision-time certainty stays unavailable.

## S17 — Future identity

- Classification: proposal.
- Given: An early artifact mentions A before A's Role/identity becomes discoverable on the timeline.
- Proposed depiction: Use default/unresolved representation for earlier contribution; reveal allowed identity only at discovery frontier.
- Must not infer: No future portrait, name resolution or holder knowledge leaks into earlier shots.
- Future test oracle: Seeking before discovery still gives fallback under the same pinned inputs.

## S18 — Same label, different subjects

- Classification: source-bound.
- Given: Two Workspaces use the name Pilot, or a person/Role share a label, without a qualified identity mapping.
- Proposed depiction: Keep descriptors scoped and visibly unresolved where appropriate.
- Must not infer: No global merge of equal names; a Role is not automatically its holder.
- Future test oracle: Core identity or explicit references are required before unification.

## S19 — Real/synthetic path changes

- Classification: consumer-dependent.
- Given: A file moves or an adapter changes its synthetic path; Core can qualify the same identity and correct companion association.
- Proposed depiction: Keep stable narrative/layout identity while exposing the new locator.
- Must not infer: Do not derive a new Parent, creation event or room from path spelling.
- Future test oracle: Same qualified identity/resources gives the same placement; absent identity proof is explicitly unsupported.

## S20 — Content hash identity trap

- Classification: source-bound.
- Given: Two equal-byte copies may represent aliases or distinct subjects; an edit changes a hash.
- Proposed depiction: Ask the qualified identity/source projection what is same versus new.
- Must not infer: No automatic logical-subject dedup by hash, or automatic new person on changed hash.
- Future test oracle: Blob equality/inequality never independently decides story identity.

## S21 — Asset history unknown

- Classification: consumer-dependent.
- Given: Only current PNG companions exist; no old asset versions/discovery timestamps are supplied.
- Proposed depiction: Use a declared resource snapshot with identity gating; state limits of historical skin fidelity.
- Must not infer: Do not claim the current art was historically available or infer resource time from filesystem mtime.
- Future test oracle: Replay guarantee names both material and resource snapshot, not just T.

## S22 — Restricted or unavailable source

- Classification: source-bound.
- Given: A participant/material reference is private, redacted or outside available scope.
- Proposed depiction: Use bounded anonymous/absent depiction and preserve the access limit.
- Must not infer: No identifying portrait, name, related prop or inferred hidden location revealed by fallback.
- Future test oracle: No private content leaks via visuals or inspector lookup.

## S23 — Empty world and first artifact

- Classification: proposal.
- Given: No records, then first valid creation anchor arrives; no earlier known world exists.
- Proposed depiction: Empty starts at now; chosen history starts at first valid creation. Hold presentation at its boundary when preparation needs time.
- Must not infer: Do not fabricate earlier Created At or claim a role/building existed before knowledge.
- Future test oracle: First introduction has no semantically visible premature actors/results.

## S24 — Two places at identical time

- Classification: proposal.
- Given: Two source-supported occurrences share T, one in location A and one in B.
- Proposed depiction: Expose their time group together; camera visits smoothly while T is held, with an observation indicator.
- Must not infer: Visiting A first must not mean A historically caused or preceded B.
- Future test oracle: World state at the shared anchor is independent of camera order.

## S25 — Dense anchors, no travel time

- Classification: proposal.
- Given: Several artifacts lie too close for readable movement at selected speed.
- Proposed depiction: Keep creation anchors fixed; use presentation-time movement/observation and slow or hold historical T.
- Must not infer: No speedup of characters that hides events; no future outcome or identity shown early.
- Future test oracle: All eligible events remain observable; 1–4 affects pace, not semantic results.

## S26 — Frozen clock / pause / seek

- Classification: proposal.
- Given: Camera moves during automatic hold; user later presses Space or seeks to the same calendar time.
- Proposed depiction: Auto-hold permits presentation progress; Space pauses both. Plain seek chooses a canonical shot; exact resume needs observation progress.
- Must not infer: Do not promise identical camera frames from T alone or let user-pause continue semantic/visual execution.
- Future test oracle: Determinism compares snapshot, frontier, seed/policy, T and observation position.

## S27 — New material and observation overload

- Classification: proposal.
- Given: A large equal-time group or live import arrives while another group is being watched.
- Proposed depiction: Keep source-time versus newly observed material distinct; queue/overview with no silent omission and user-controlled review.
- Must not infer: Do not reorder authoritative chronology to suit camera arrival, or mark unobserved events as seen.
- Future test oracle: Queue policy, cancellation and pinned/live refresh behavior must be approved in the time pass.

## S28 — Root defaults everywhere

- Classification: consumer-dependent.
- Given: Only Root has Tiles/Structure resources; ordinary Topics have no exact opt-in.
- Proposed depiction: Resolve fallback art when requested without promoting every Topic to a building.
- Must not infer: Availability of inherited art is not exact local capability.
- Future test oracle: Provider result supplies specificity; switch considers only approved activation sources.

## S29 — Generic Topic tavern

- Classification: proposal.
- Given: Topics model a structure, two surfaces and nested room-like enclosures through exact named companions.
- Proposed depiction: Project one-scale architecture with common areas for directly scoped content; floor/room choice is documented layout.
- Must not infer: No new mandatory Floor/Room schema or assertion that Parent means real containment.
- Future test oracle: Modding works without added semantic fields; new Structure slot contract still needs acceptance.

## S30 — Props catalogue versus result

- Classification: proposal.
- Given: Props sheet has several rows; a Verb ends but no actual output is declared.
- Proposed depiction: Rows are available appearances; show cosmetic illustration only if marked as such, or spawn a result only with support.
- Must not infer: Do not spawn all rows as real inventory or let a removed-state image prove destruction.
- Future test oracle: Persistent artifact depiction and claimed produced objects remain distinguishable.

## S31 — Explicit event location / blocked path

- Classification: consumer-dependent.
- Given: Event has a qualified location differing from Parent-derived home; no navigable path is currently available.
- Proposed depiction: Keep ancestry unchanged, target the qualified event location, and expose navigation blockage/presentation reposition.
- Must not infer: No re-parenting, guessed free-text place, wrong room assignment or walking through walls.
- Future test oracle: No false semantic movement; world/pathfinding pass must supply valid connectivity.

## S32 — Growth / appended visual collections

- Classification: consumer-dependent.
- Given: An old sibling or new room/prop row is inserted after a layout was generated.
- Proposed depiction: Retain stable allocation where promised; row identity/origin and whole-family append require defined contracts.
- Must not infer: A deterministic seed alone does not prove old houses remain put; shifted row indices are not stable prop identities.
- Future test oracle: Compare prior positions and references after growth; unresolved append precedence blocks reliable instantiation.

## Review limits

This pass checks logical compatibility, not rendering quality, implemented timing, frame retention, performance, navigation correctness, installed package isolation, or real consumer contracts. The examples are not exhaustive. Unresolved source semantics must remain unresolved; the engine must not guess to satisfy a visual test.
