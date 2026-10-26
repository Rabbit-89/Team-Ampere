# Hållbarhet och etik

## Siffrorna

Uppmätt 2026-10-23 med `scripts/co2.mjs` (co2.js 0.19.0, Sustainable Web Design-modellen v4). Efter M7-bygget är från `main` (`6924cc1`); före M7-bygget är från taggen `M6` (`a344390`).

|                     | kB per besök | g CO2e per besök (SE) | kg CO2e per månad (SE) | kg CO2e per månad (globalt) |
| ------------------- | -----------: | --------------------: | ---------------------: | --------------------------: |
| Före M7 (taggen M6) |        6 879 |                 0,408 |                   52,2 |                       126,9 |
| Efter M7 (main)     |          269 |                 0,016 |                    2,0 |                         5,0 |

**Elmix (co2.js):** Sverige 35,89 g CO2e/kWh (SWE) · globalt 472,94 g CO2e/kWh (WORLD)

**Energi:** 10,3 kWh per månad (34,4 GB × 0,30 kWh/GB)

**Antaganden:** 40 000 kunder × 3,2 sessioner = 128 000 besök/månad · andel förstabesök 100 %

**Obs:** tillverkningen av enheter, nät och datacenter räknas alltid med SWD v4:s globala 494 g CO2e/kWh – bara driften får landets mix.

## Metoden och vad vi inte räknar

- Vi mätte den okomprimerade storleken på `dist/index.html` och allt under `dist/assets/` med skriptet.

- Alla besök räknas som förstabesök och utsläppen beräknas med svensk elmix på 35,89 g CO2e/kWh.

- Trafikantagandet är 40 000 kunder × 3,2 sessioner per kund och månad, där 3,2 är skriptets standard eftersom vi saknar uppmätta sessionsdata.

- Vi räknar inte med gzip/brotli, återbesök från cache eller API- och backendarbete; tillverkningen av servrar, nät och enheter beräknas med global elmix oavsett land.

## Etikfall: Chatta med Kraftly

**Situationen.**

Kraftly vill införa en AI-support i kundportalen. Kundens timförbrukning och fakturor skickas till en extern modell-API för att förklara fakturan. Produktägaren vill att teamet börjar utveckla funktionen i nästa sprint, trots att avtalet med leverantören inte är helt klart.

**Vårt beslut.**

Ja med villkor – vi kan stödja en AI-support, men vi börjar inte skicka kunddata till den externa tjänsten innan dataskyddet och villkoren har granskats.

**Varför.**

Timförbrukningen samlades in för fakturering och kan avslöja kundens vardagsmönster. Vi behöver följa principerna om ändamålsbegränsning och dataminimering. Kunden ska förstå vilka uppgifter som skickas till den externa leverantören och varför.

**Vad vi gör i stället / villkor.**

Vi skickar bara de uppgifter som behövs för att förklara fakturan, till exempel sammanställd förbrukning och fakturabelopp. Innan lansering ska ansvariga granska leverantörens villkor, behandlingsland, lagring och eventuell modellträning. Vi begränsar åtkomsten till loggar och bestämmer hur länge de sparas. Kunden ska informeras och kunna välja bort AI-supporten utan att förlora tillgången till vanlig kundservice. AI-svaren ska bygga på verifierbara fakturauppgifter och kunna hänvisa kunden till kundtjänst när svaret är osäkert.
