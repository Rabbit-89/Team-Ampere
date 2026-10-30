# Kända brister

Listan beskriver kända brister och begränsningar i Kraftly-projektet som inte har åtgärdats inom ramen för kursprojektet. Syftet är att ge nästa team en tydlig bild av vad som återstår och vilka konsekvenser det kan få.

| #   | Brist                                                          | Påverkan                                                                                                                                                                                                                                                                                          | Varför den inte är åtgärdad                                                                                                                   |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ofullständig validering i flyttanmälan                         | Användaren får endast ett synligt felmeddelande för postnummer. Felaktiga eller saknade uppgifter i andra fält, till exempel ny adress, ort, inflyttningsdatum och avtal, får ingen tydlig återkoppling. Det kan göra det svårt för användaren att förstå vilka uppgifter som behöver korrigeras. | Bristen identifierades vid manuell testning. Den dokumenteras men åtgärdas inte inom ramen för M10.                                           |
| 2   | Skärmläsartestning med NVDA eller VoiceOver är inte verifierad | Vi vet inte fullt ut hur portalen upplevs av användare som använder skärmläsare.                                                                                                                                                                                                                  | Teamet har genomfört tangentbordstester med Tab och mellanslag, men någon dokumenterad testning med NVDA eller VoiceOver har inte bekräftats. |
| 3   | CORS tillåter `Access-Control-Allow-Origin: *`                 | API:t tillåter anrop från alla origins. Det är en bredare konfiguration än vad som normalt rekommenderas i en produktionsmiljö.                                                                                                                                                                   | En komplett lösning för central loggning och automatiska larm ingår inte i kursprojektet.                                                     |
| 4   | Kallstarter på Render                                          | Efter inaktivitet kan tjänsterna somna. Det första anropet efter inaktivitet kan därför ta längre tid och påverka användarupplevelsen.                                                                                                                                                            | Begränsningen beror på den valda hostingmiljön och är dokumenterad i projektets README.                                                       |

| 5 | npm-cachen ger ingen uppmätt tidsvinst | Den nuvarande cache-konfigurationen har inte visat någon förbättring av pipelinens totala körtid. | Mätningarna i `docs/pipeline.md` visar 58 sekunder utan cache och 63 sekunder med cache. |

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
