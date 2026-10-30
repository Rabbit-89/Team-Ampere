# Beslut: feature flags

**Datum:** 2026-09-24  
**Beslut:** Vi använder körtidsflaggor för funktioner som ska kunna aktiveras eller stängas av per miljö utan att bygga om applikationen.

## Bakgrund

Vi behövde förbereda Norge-expansionen i portalen utan att visa funktionen för svenska kunder i produktion. Funktionen ska kunna visas i staging för testning, medan den kan vara avstängd i produktion tills expansionen är klar.

Därför behövde vi en lösning där samma Docker-image kan användas i olika miljöer och där funktionen kan styras med en miljövariabel.

## Alternativ vi jämförde

| Alternativ                            | Hur                                                                | Bryter det mot "bygg en gång"? | Nackdel                                                   |
| ------------------------------------- | ------------------------------------------------------------------ | ------------------------------ | --------------------------------------------------------- |
| Långlivad branch                      | Ha Norge-funktionen i en separat branch och mergea senare          | Ja                             | Risk för merge-konflikter och att miljöerna får olika kod |
| Byggtidsflagga (`VITE_...`)           | Flaggan bestäms när applikationen byggs                            | Ja                             | Kräver en ny build för att ändra flaggan                  |
| Körtidsflagga (`config.js` vid start) | `config.js` skrivs när containern startar och läser miljövariabler | Nej                            | Kräver runtime-konfiguration per miljö                    |

## Motivering

Vi valde körtidsflagga eftersom samma image kan användas i staging och produktion och konfigurationen kan ändras utan att applikationen behöver byggas om.

För Norge använder vi miljövariabeln `FEATURE_NORWAY`. När containern startar skriver `40-runtime-config.sh` en `config.js` med rätt värde för den aktuella miljön.

Flaggan läses sedan på ett ställe i `src/utils/features.js`. Det gör att komponenterna inte behöver läsa `window.__KRAFTLY__` direkt.

Det passar vårt krav på att kunna ha Norge-funktionen på i staging men av i produktion.

## Konsekvenser

Körtidskonfigurationen innebär att varje miljö behöver konfigureras separat. Vi behöver därför kontrollera miljövariablerna i Render när en feature ska aktiveras eller stängas av.

En flagga som saknas eller har ett annat värde än exakt `true` behandlas som avstängd. Det minskar risken att en funktion råkar aktiveras i produktion.

När Norge-funktionen inte längre behövs ska feature flaggen och den tillhörande koden tas bort. Teamet behöver därför hålla reda på vilka flaggor som finns och rensa bort gamla flaggor.

Konfigurationen innehåller endast publika feature flag-värden och inga hemligheter eller API-nycklar.

## Omprövas om

Vi behöver ompröva beslutet om:

- Vi inte längre behöver aktivera eller stänga av funktioner separat i staging och produktion.
- Körtidskonfigurationen inte fungerar som förväntat eller orsakar problem vid deployment.
- Antalet feature flags ökar så mycket att det blir svårt att hålla reda på vilka funktioner som är aktiverade i olika miljöer.
- Vi behöver en mer avancerad lösning för feature flags, till exempel för att styra funktioner för olika användargrupper.
