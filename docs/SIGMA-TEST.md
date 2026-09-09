# Sigma-test — efter Turn 2

**Nu:** avvakta. Det här paketet ber dig inte testa direkt.

```text
Turn 2 landar
      ↓
host + Playthings kopplas ihop
      ↓
riktigt browser-test grönt
      ↓
SIGMA TESTAR
```

## Förberedelsen gör vi först

Rätt Anchor behöver kontrollera `TURN-2-HOST-BOUNDARY.md`, särskilt gamla footern, tangentbordsfokus och browser-testets ändrade kontrollnamn.

Core/App/Site i detta paket är **read-only återställningsunderlag**. Skriv inte över dina nyare Turn-2-repon med dem.

Använd en separat test-Workspace. Starta den integrerade Viewer-vägen från den kvalificerade host-versionen. Paketet innehåller inte en fristående app eller godkända standardbilder som jag kan lova visas automatiskt.

## Testkort — ett mönster åt gången

| Gör | Förvänta dig |
| --- | --- |
| Viewer → Playthings | Presentationen fyller fönstret. Gamla headern/footern syns inte och går inte att tabba till. |
| Root Gate → åter till Viewer | Du kommer ut. Din laddade Workspace finns kvar. |
| Replay → pausa → spola bakåt | Artefakter visas vid sin deklarerade tid. Framtida schema-kunskap får inte läcka. |
| Följ en gren och en senare förgrening | Relation till tidigare material är begriplig. Ghost är presentation av tidigare frontier, inte en ny artefakt. |
| Välj samma artefakt med schema-grafik och lokal override | Rätt Core-resolverad companion används. Konflikt visas inte som en godtycklig vinnare. |
| Uppdatera test-Workspace medan historien är pausad | Tidspositionen bevaras. Stabil layout behålls, annars får du en tydlig återbyggnads-/begränsningssignal. |
| Root Gate → minska rörelse | Historien går fortfarande att läsa utan att följa all kamerarörelse. |
| Root Gate → byt Verse | Endast hostens verkliga val visas. Utan sådan lista går du via Viewer. |

**Teknik/skills:** ska inte exponeras innan en kvalificerad historisk introduktion. I den nu burna host-versionen är denna UI avsiktligt avstängd; avsaknad är inte bevis på att integrationen är färdig.

**Companions:** behöver verkliga, kvalificerade PNG-resurser från din test-Workspace/provider. Utan sådana visas ärlig fallback-grafik. Diagnostiska färgrutor i automatiska tester är inte produktens slutliga bilder.

## Din återkoppling

```text
Förstår lineage?       JA / NEJ
Rätt grafik?          JA / NEJ
Rätt tid?             JA / NEJ
Full yta, ingen footer? JA / NEJ
Lätt att lämna/byta?   JA / NEJ

Det som kändes konstigt:
[en skärmbild eller en mening]
```

Commit/push och upplevelsetest är separata checkpoint-handlingar. **npm publish ingår inte.**
