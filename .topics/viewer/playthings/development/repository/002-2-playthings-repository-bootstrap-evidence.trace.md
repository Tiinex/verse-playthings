# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Parent
  - Parent Schema: [tiinex.decision.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/decision/tiinex.decision.v1.schema.md)
  - Created At: 2026-09-08 13:24:00
  - Trace: [Playthings Core / Site Package Boundary](002-1-playthings-core-site-package-boundary-decision.trace.md)
  - Origin:
    - [relative](002-1-playthings-core-site-package-boundary-decision.trace.md)
- Current
  - Current Schema: [tiinex.evidence.v1](https://github.com/Tiinex/docs/blob/089427470f04336dfcc100c4dcf6289d51bf0291/.topics/.schemas/core/evidence/tiinex.evidence.v1.schema.md)
  - Created At: 2026-09-08 13:31:00
  - Authors: Anchor; Sigma
  - Why: Preserve the exact local repository-bootstrap state after moving Playthings lineage/tooling into its own Workspace and before manufacturing the first full multi-workspace continuation package.
  - Summary: Minimal Tiinex/playthings bootstrap is materialized with migrated lineage, relevant tooling, legal/root files, and no runtime/package implementation.
  - Status: accepted/local

---

# Playthings Repository Bootstrap Evidence

## Preserved Material

- Material Description: local `Tiinex/playthings` Workspace bootstrap plus the exact frozen Site source baseline from which the split was made.
- Material Kind: repository/bootstrap evidence.
- Material Reference: current Playthings Workspace and carried Site Workspace.
- Represented Subject: source ownership transition from Site Playthings branch to separate Playthings repository.

## Preservation Act

- Preservation Method: copy the accepted Playthings subtree and Playthings-specific tooling into a new Workspace; retain exact lineage visual-source bytes; create repository identity/legal files; add a Playthings Workspace entrypoint; do not create runtime source or package configuration.
- Preservation Time Or State: immediately before full multi-workspace Handoff manufacture.
- Actor: Anchor; Sigma.
- Capture Conditions: source PNGs were moved/copied as filesystem bytes only; no image decode/resave or graphics regeneration occurred.

## Provenance

- Known Source: Sigma-reviewed Site Playthings source checkpoint `tiinex-site-playthings-full-source-2026-09-08-r4.zip`.
- Source SHA-256: `402f5addd7c333d8f0cb622646b985f649b2aa998e14750816553a0bed033ae9`.
- Prior Handoff Package SHA-256: `301f9f547d176c6fbd5e04f8f1335a1eea297e62a1d6ac1c3bbc244d592447bd`.
- Refactor Anchor Input: [002-1-refactor-anchor-package-boundary-input-01.md](002-1-refactor-anchor-package-boundary-input-01.md), SHA-256 `c693ebba07338eb942f4560282886272db8199f918c9bcb449a33f39e497050e`.
- Preservation Basis: Sigma approved the refined Site checkpoint and requested extraction into a standalone Playthings Workspace after Refactor Anchor confirmed package-boundary compatibility.
- Provenance Limits: this Evidence does not claim a remote `Tiinex/playthings` commit already exists or that the Site refactor branch has merged Core extraction.

## Fidelity And Loss

- Fidelity Notes: migrated lineage PNG bytes and Playthings tooling source bytes are preserved without content transformation.
- Known Losses: Python `__pycache__` output was intentionally omitted because it is generated cache material rather than source.
- Transformation: repository ownership/location changed; one historical Site Workspace relative link was retargeted to an explicit `site::` cross-workspace reference and dependent c14n-v2 integrity values were resealed transitively. Historical semantic claims were not rewritten.
- Uncertainty: future runtime public imports remain intentionally unresolved until Refactor Anchor publishes the Core consumer contract.

## Custody Or Storage Boundary

- Storage Or Custody State: local standalone Playthings Workspace.
- Reuse Boundary: use this Workspace as future Playthings planning/source authority; treat the carried Site Workspace as the frozen baseline used for extraction rather than future Playthings source ownership.
- Retention: durable bootstrap checkpoint.
- Permission Boundary: no remote Git mutation is implied.

## Supported Claim Or Question

- Supported Claim Or Question: whether a minimal standalone Playthings repository can carry all current Playthings lineage/tooling without starting runtime implementation and while remaining portable beside Site, Docs, and Business Workspaces.
- Evidence Role: repository extraction/bootstrap qualification.
- Target Artifact: [Playthings Core / Site Package Boundary](002-1-playthings-core-site-package-boundary-decision.trace.md).
- Review Context: pre-repository/bootstrap Handoff checkpoint.

## Evidence Material

- Material: standalone Playthings Workspace bootstrap and migrated Playthings lineage/tooling source.
- Material Kind: repository/bootstrap source set.
- Description: minimal repository state before first full multi-workspace Playthings Handoff manufacture.
- Attachment Reference: none; material is carried directly in the Playthings Workspace.

Before this Evidence and the final Handoff are added, the Playthings Workspace contains:

- top-level `README.md`, `LICENSE`, `NOTICE`, `.topics/`, and `tools/` only;
- 61 total files;
- 51 files under `.topics/viewer/playthings/`;
- 37 Tiinex trace artifacts under the Playthings lineage;
- 13 lineage-local PNG source assets;
- 6 Playthings tooling source/test files;
- no `src/` directory;
- no `package.json`;
- no repository-root `reference/` directory.

Root file digests at capture time:

- `README.md`: `76ec0d37f56ad9f80e40f200b433d4f48711f917c855ac939d584a2597aa2d43`.
- `LICENSE`: `aabf145b7fed81868402bc649e4575678def9562ca878f1604f60de75c81d289`.
- `NOTICE`: `97e91328d4606ba807a86c2a126154acbbb96a029ea97cccf89e9724db926b3f`.
- `.topics/.workspaces/tiinex-playthings.workspace.md`: `8319927b5d8335cda6cc66a36d31195fbab3c1afd84eed34fdb3b2a9539e9b3f`.

## Preservation And Fidelity

- Preservation State: migrated lineage/tooling bytes retained in the standalone Playthings Workspace; generated caches omitted.
- Fidelity Notes: no visual source was decoded, resaved, resized, cropped, repainted, or regenerated during repository extraction.
- Known Losses: generated Python cache output only.
- Transformation: repository relocation, explicit cross-workspace reference retarget, and c14n-v2 resealing of affected continuity descendants.
- Representation Limits: this Evidence qualifies repository/bootstrap state, not runtime behavior or future companion semantics.
- Storage Boundary: standalone local Playthings Workspace carried beside complete Site, Docs, and Business Workspaces.

## Interpretation Limits

- Does Not Prove: future npm publication, React integration, runtime behavior, Core API stability, or final companion-capability semantics.
- Not Yet Used As: runtime acceptance evidence.
- Must Not Be Treated As: authorization to resume old Site experiment implementation inside the new repository.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [Playthings Core / Site Package Boundary](002-1-playthings-core-site-package-boundary-decision.trace.md)
  - Value: Z_t9eA3XCSuERkK28092PbAj8fhjm2Qnj89jfxdzlbM

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:55R92yV8liHQQB0GFnEFlebOWboZy02vSgDzGrtxQws
