# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Current
  - Current Schema: [tiinex.workspace.v1](https://github.com/Tiinex/docs/blob/911d4cf990e35ce25a56e8f376d296e327c48260/.topics/.schemas/tiinex.workspace.v1.schema.md)
  - Created At: 2026-09-08 13:18:00
  - Authors: Anchor; Sigma
  - Why: Establish a portable Workspace entrypoint for the new Tiinex/playthings repository after Playthings source ownership was split from the Site Playthings branch.
  - Summary: Tiinex Site Playthings workspace for Playthings lineage, tooling, future runtime source, and mirrored default companion paths.
  - Status: active/local

---

# Tiinex Site Playthings

## Schema Origins

- [Tiinex docs schemas](https://github.com/Tiinex/docs/tree/master/.topics/.schemas)
  - Kind: github-tree
  - Repository: Tiinex/docs
  - Ref: master
  - Root Path: .topics/.schemas
  - Trust Role: canonical-core

## Workspace Entrypoints

### Tiinex Playthings source

- Source Kind: local-directory
- Repository: Tiinex/playthings
- Root Path: .
- Repo Files Discovery: on

## Workspace Boundary

- Playthings lineage and Playthings-specific tooling are owned here after repository extraction from Site.
- Site remains a host/Viewer integration dependency, not Playthings semantic authority.
- Core public contracts may later be consumed through `@tiinex/core`; internal Core or Site paths are not repository-bootstrap dependencies.
- Default Playthings schema companions may later use a mirrored `src/schemas/...` path hierarchy without copying schema authority.

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:uQ4DADjvKJc20sM-hNqySdQ3ZEtpdQo5h_M2RivAENQ
