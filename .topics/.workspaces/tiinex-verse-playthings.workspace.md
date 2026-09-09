# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.workspace.v1](https://github.com/Tiinex/docs/blob/911d4cf990e35ce25a56e8f376d296e327c48260/.topics/.schemas/tiinex.workspace.v1.schema.md)
  - Created At: 2026-09-08 13:18:00
  - Trace: [tiinex-playthings.workspace.md](tiinex-playthings.workspace.md)
  - Origin:
    - [relative](tiinex-playthings.workspace.md)
- Current
  - Current Schema: tiinex.workspace.v1
  - Created At: 2026-09-09 15:04:22
  - Authors: Anchor; Sigma
  - Why: Preserve repository-rename continuity without rewriting the predecessor Playthings Workspace provenance.
  - Summary: Current Workspace entrypoint for the renamed Tiinex/verse-playthings repository.
  - Status: ready/local

---

# Tiinex Verse Playthings

## Schema Origins

- [Tiinex docs schemas](https://github.com/Tiinex/docs/tree/master/.topics/.schemas)
  - Kind: github-tree
  - Repository: Tiinex/docs
  - Ref: master
  - Root Path: .topics/.schemas
  - Trust Role: canonical-core

## Workspace Entrypoints

### Tiinex Verse Playthings source

- Source Kind: local-directory
- Repository: Tiinex/verse-playthings
- Root Path: .
- Repo Files Discovery: on

## Workspace Boundary

- Verse Playthings source, package, presentation runtime and its repository-local development lineage are owned here after the repository rename from `Tiinex/playthings`.
- The predecessor Workspace remains historical recovery context for the old repository identity; it does not override this current repository entrypoint.
- App and Core remain public host/data/mechanics dependencies, not Playthings semantic authority.
- Site remains a host/deployment integration dependency and must not become a private source dependency.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [tiinex-playthings.workspace.md](tiinex-playthings.workspace.md)
  - Value: uQ4DADjvKJc20sM-hNqySdQ3ZEtpdQo5h_M2RivAENQ

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: ERWoFPsZTpmUIE9JNMcRBiezNYru4Z6NaMRqZJhpjeo