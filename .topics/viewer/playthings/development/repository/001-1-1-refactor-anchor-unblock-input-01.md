Ja — två omgångar är bättre. Det gör att vi inte blockerar Playthings-testningen på hela Tiinex-refaktorn, och samtidigt slipper vi bygga en temporär integration som vi ändå river två turns senare. :P

Jag skulle lägga upp det så här:

### Omgång 1 — “Playthings unblock”

Målet är att **Playthings Anchor kan fortsätta mot den nya arkitekturen**, utan att behöva en legacy-version av Site.

Jag gör då `core → app → site` till en verklig fungerande kedja:

* **Core**

  * riktig `@tiinex/core` package-boundary
  * host-neutral artifact/schema/lineage/relation projections
  * Companion Resource Resolver + provider-contract
  * artifact-local companions
  * schema-local companions
  * schema-Parent → Root fallback
  * deterministic override/append/ambiguity-regler
  * browser-safe exports separerade från Node-specifikt material
  * samma merge-compatible `src/...`-struktur

* **App**

  * `@tiinex/app`
  * Viewer/application foundation ovanpå Core
  * React som peer dependency
  * Verse host/mount contract
  * companion-provider composition
  * lazy-load-gräns för externa Verses
  * ingen Site-internal dependency

* **Site**

  * görs till tunn deployment
  * konsumerar App/Core som riktiga dependencies
  * Site-specifika providers/overrides/config
  * Playthings kan mountas/lazy-loadas genom den nya Verse-gränsen
  * inga dubbla implementationskopior av Core/App

Jag gör dessutom **minsta nödvändiga Business/Docs-continuity i samma omgång**, så vi inte skapar nya repos med lösa historiska ben. Jag tänker inte vänta med den delen till slutet och sedan försöka retrofitta Parent/initiative-samband.

När den omgången är klar ska Playthings Anchor kunna få ett konkret consumer-contract ungefär:

```text
@tiinex/core
    ↓
qualified artifact/schema/workspace projections

@tiinex/app
    ↓
Verse host + React mount + companion provider composition

@tiinex/playthings
    ↓
Playthings-specific projection/presentation

Tiinex/site
    ↓
deployment config + overrides + lazy loading
```

Det är min **första leveransgräns**.

---

### Omgång 2 — “full reconciliation”

När Playthings kan fortsätta testar vi inte sönder dess tempo medan jag gör resten.

Då tar jag:

**Business / Docs → Core → App → Site → Chrome → VS Code**, med VS Code sist precis som du föreslår.

Där ingår bland annat:

* full Business initiative/task reconciliation
* truthful current lineages i Core/App/Site
* kvalificerad reduktion av gammalt Site-skräp
* bara aktuella durable frontiers kvar i respektive `.topics`
* Chrome-host scaffold mot App/Core
* evolve-delivery boundary design
* npm/public package contracts och exact version provenance
* package/install/build-flöden
* till sist VS Code:

  * bort med `shared-core`
  * `@tiinex/core` via normal dependency
  * inga commitbara copies
  * fortsatt Major 013 UX/validation/manufacture-arbete
  * ny VSIX först när den nya Core-kedjan är kvalificerad

### Hur jag tänker leverera till dig

Jag vill göra det väldigt enkelt för dig att landa.

För varje repo jag färdigställer får du ett **repo-specifikt full-source Handoff package** snarare än en stor Frankenstein-zip som du ska sortera manuellt.

Så ungefär:

```text
Business handoff
Docs handoff
Core handoff
App handoff
Site handoff
Chrome handoff
VS Code handoff + VSIX
```

Och dependency-versionerna i paketen ska redan hänga ihop.

Före npm-publicering kan jag testa exakt samma arkitektur med lokala packade npm-tarballs / installerat `node_modules`-material. Alltså inte:

```text
../../core/src/...
```

och inte symlänkade source-imports som råkar fungera på min maskin.

I stället testar vi i princip det slutliga distributionssättet:

```text
npm pack @tiinex/core-source
        ↓
core-x.y.z.tgz

npm install ../core-x.y.z.tgz
        ↓
node_modules/@tiinex/core
```

Sedan kan samma dependency bytas från den lokala tarballen till den publicerade exakta npm-versionen utan arkitekturförändring.

Det är särskilt viktigt för Site/App/Playthings, annars är det väldigt lätt att tro att package-boundaryn fungerar när Node egentligen har råkat nå source genom workspace-layouten.

---

Och jag ser en bra ytterligare gate för **Omgång 1**:

Jag tänker bygga en liten adversarial fixture med ungefär:

```text
Workspace
  .topics/
    task.md
    task.playthings.portrait.png

    .relations/
      relation.md
      relation.playthings.props.png

Site override
App default
Playthings schema companion
Core Root fallback
```

och verifiera att exakt samma resolver ger:

* artifact override rätt
* Relation-artifact fungerar oavsett `.relations`-mappnamnet
* Site override där den ska vinna
* Playthings exact-schema vinner över mindre specifik default
* schema Parent fallback fungerar
* append slots kombineras deterministiskt
* conflicting single-value companions failar stängt

Om det klarar den fixture:n är Playthings-integrationen byggd på en riktig generell grund och inte på dess happy path.

Så ja: **jag gör Omgång 1 först och stannar vid en faktisk Playthings-unblock checkpoint.** Därefter gör jag fullstädningen och lämnar VS Code till sist.

Det borde också innebära att du kan börja landa de första repona inom betydligt färre återkopplingsrundor än om jag försöker göra hela separationen + VSIX samtidigt. :P
