# Kända brister

Inget här är kritiskt enligt definitionen i M10. Listan finns för att den som tar över ska veta det vi vet.

| #   | Brist                                                                          | Påverkan                                                          | Varför den inte är åtgärdad                                                                                           |
| --- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Refresh-tokens ligger i API:ts minne                                           | Startar API:t om loggas alla kunder ut och får logga in igen      | API:t ägs av Kraftlys backend-team. I ett riktigt API: en tabell med utgångstid (`docs/security.md`, _Kända brister_) |
| 2   | Ingen visuell regressionstestning                                              | En CSS-ändring kan förstöra en vy utan att något test blir rött   | Storybook finns, och det är förutsättningen – nästa steg, men inte före `v1.0`. <Vad det skulle kosta>                |
| 3   | Ingen skärmläsare provad (VoiceOver, NVDA)                                     | Okänt hur portalen fungerar för de användare som behöver det mest | Ingen genomgång gjord. Kostar en genomgång per vy och verktyg – …                                                     |
| 4   | Byggtiderna i `docs/pipeline.md` är exempelvärden, inte avlästa i vårt Actions | Vinsten med npm-cachen är inte bevisad                            | Att mäta kostar en körning med och en utan cache, avläst i Actions – …                                                |
| …   | …                                                                              | …                                                                 | …                                                                                                                     |

## Vad vi hade gjort med två veckor till

1. Förbättrat valideringen i flyttanmälan så att samtliga fält ger tydliga och tillgängliga felmeddelanden.
2. Genomfört och dokumenterat tester med skärmläsare, till exempel NVDA, för att komplettera tangentbordstesterna.

## Kontroll av kritiska risker

Följande fyra kritiska risker har kontrollerats inför release.

| Kontroll                       | Resultat | Bevis                                                                                                                                                                                 |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pipeline på main               | klart    | De tre senaste körningarna på main visar status `success`.                                                                                                                            |
| Inloggning kan kringgås        | klart    | Ett anrop till `/api/v2/user` utan autentiseringstoken returnerade HTTP 401.                                                                                                          |
| Kunddata kan läcka             | klart    | `git grep` hittade inga träffar för `api_key`, `secret` eller `_sk_` i `src`. Production returnerar både `Content-Security-Policy` och `Strict-Transport-Security`.                   |
| Production kan rullas tillbaka | klart    | Rollback-workflow har körts manuellt på main och avslutats med status `success`. Körning: [Rollback #40983195212](https://github.com/Rabbit-89/Team-Ampere/actions/runs/40983195212). |

Kontrollerna visar att de fyra kritiska riskerna inte har identifierats vid denna genomgång.
