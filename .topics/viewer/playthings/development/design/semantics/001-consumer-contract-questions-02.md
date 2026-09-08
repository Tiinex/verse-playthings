# Informal questions for Refactor Anchor — Playthings designer pass

We have read your two-round Core → App → Site plan. We will not implement or import internals before the Playthings-unblock consumer contract is available. Site is read-only in our work.

These are consumer needs from our design review, not requested export names or instructions to interrupt extraction.

1. **Identity and source scope:** how does the public projection distinguish logical subject, representation/version, alias/duplicate, and unresolved path-only identity? We must not promise rename stability or merge equal labels/hashes where the source cannot justify it.
2. **Temporal/source knowledge:** which qualified fields distinguish Created At, described Event time/state, ingestion/observation and revision availability? Which histories are actually supplied versus a current snapshot? Unknowns must remain explicit.
3. **Typed roles:** can consumers distinguish Authors, Handoff endpoints/capacity, event participants versus targets/invitees/resources, and ambiguous or unavailable references without title/field-name guessing?
4. **Resource resolution provenance:** can a successful resolution retain exact-artifact/exact-schema/ancestor/Root origin and source priority, including explicit absence versus unavailable/ambiguous/invalid? Playthings uses this to separate local spatial opt-in from inherited fallback art.
5. **Append/collection stability:** how are contributor origins and deterministic row/block ordering represented? Props rows and Tiles family blocks are logical units, and inserting a provider must not silently change which persistent object an old row reference means. We do not need a new mandatory per-artifact manifest.
6. **App host actions:** after the host contract is concrete, how are fullscreen/exit, Verse switching, artifact opening, eligible parentless creation, lifecycle cancellation and write authorization exposed? Gate choreography must not create authority or block Escape.

No implementation is implied by these questions. A bounded "not yet supported" answer is preferable to a speculative projection or dependency on Site internals. Missing temporal resource history can be an explicit replay limit rather than extra metadata forced into user artifacts.
