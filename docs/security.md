# Säkerhet – Team Ampere

## Hotbilden i en mening

Portalen hanterar kundinformation, förbrukningsdata och fakturor. En angripare skulle kunna försöka komma åt en annan kunds data genom att anropa API:t direkt eller manipulera information som skickas från klienten.

## Autentiseringen (M6)

Användaren loggar in via `/api/v2/auth/login` och får en access token. Token skickas sedan med API-anropen som:

`Authorization: Bearer <token>`

Access token lagras i minnet via `src/services/token.js` och används av `api.js` när API-anrop görs.

Frontend har även en route guard som skickar användaren till `/login` om det saknas en access token. Route guarden är endast ett UX-skydd. Den riktiga åtkomstkontrollen sker i API:t, där anrop utan giltig token returnerar `401 Unauthorized`.

Refresh-flödet använder `/api/v2/auth/refresh` för att försöka få en ny access token när det finns en aktiv session.

---

## OWASP Top 10 – genomgång

| #   | Risk                                  | Gäller oss? | Vad vi hittade                                                                                                                                | Vad vi gjorde                                                                                                                               | Kontroll                                                                                                                                             |
| --- | ------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control                 | Ja          | Vi kontrollerade om kunden kunde påverka vilken kunds data som hämtas genom att skicka exempelvis `customerNo`.                               | API v2 kräver en giltig Bearer-token. Data väljs från den autentiserade användaren och inte från `customerNo` som skickas av klienten.      | `curl` utan token ger `401`. Vi testade även `/api/v2/invoices?customerNo=K-999999` och fick samma data som utan query-parametern.                   |
| A02 | Security Misconfiguration             | Ja          | CORS tillåter `Access-Control-Allow-Origin: *`. Detta är en bred konfiguration som inte är lämplig för en produktionsmiljö.                   | Vi har dokumenterat detta som en känd begränsning i kursprojektet. API:t kräver fortfarande en giltig Bearer-token.                         | Kontrolleras med `curl -I` mot staging och genom att kontrollera CORS-konfigurationen i API:t.                                                       |
| A03 | Software Supply Chain Failures        | Delvis      | Projektet använder externa npm-paket och beroenden.                                                                                           | Beroenden hanteras via `package.json` och lockfil. Ändringar går via Git/PR och CI.                                                         | Kontrolleras genom CI och vid behov `npm audit`.                                                                                                     |
| A04 | Cryptographic Failures                | Nej         | Vi hittade inga tydliga problem med kryptering. Access token skickas i `Authorization`-headern och lagras i minnet på klienten.               | Token läggs inte in i källkod eller dokumentation. Kommunikation mot staging sker via HTTPS.                                                | Kontrolleras genom att inspektera API-anrop och staging-URL.                                                                                         |
| A05 | Injection (XSS för oss)               | Ja          | Vi hittade ingen användning av `v-html`, `innerHTML` eller `eval()` för API-data.                                                             | API-data renderas som vanlig text i Vue och vi behövde därför ingen särskild XSS-fix.                                                       | Playwright-test skickar `<script>` och `<img onerror>` som API-data. Testet passerade och innehållet renderades som text utan att JavaScript kördes. |
| A06 | Insecure Design                       | Ja          | En risk är att klienten försöker välja vilken kunds data som ska hämtas genom parametrar som `customerNo`.                                    | API v2 använder autentiseringen för att bestämma vilken data användaren får se. Klientens `customerNo` används inte för att välja fakturor. | Test med `customerNo=K-999999` gav samma resultat som ett vanligt anrop.                                                                             |
| A07 | Authentication Failures               | Ja          | API:t ska inte acceptera anrop utan giltig autentisering.                                                                                     | API:t kontrollerar Bearer-token och returnerar `401 Unauthorized` när token saknas eller är ogiltig.                                        | `curl` utan token gav `401`. Ett autentiserat anrop med giltig token gav `200`. Playwright-testet utan token gav `401`.                              |
| A08 | Software/Data Integrity Failures      | Delvis      | Vi har inte hittat någon klientfunktion som ska kunna ändra skyddad data utan autentisering.                                                  | API-anropen skyddas av Bearer-token.                                                                                                        | Kontrolleras genom API-test och CI-tester.                                                                                                           |
| A09 | Logging & Alerting Failures           | Delvis      | API:t loggar bland annat misslyckade autentiseringsförsök, men vi har ingen fullständig produktionslösning för central loggning och alerting. | Befintlig logging används i kursprojektet för felsökning och kontroll.                                                                      | Kontrolleras genom serverloggar vid exempelvis `401 Unauthorized`.                                                                                   |
| A10 | Mishandling of Exceptional Conditions | Ja          | API:t returnerar HTTP-statuskoder vid felaktiga eller saknade autentiseringsuppgifter.                                                        | Felaktiga autentiseringsförsök returnerar `401` istället för att ge åtkomst till data.                                                      | Testat med `curl` utan token och med Playwright.                                                                                                     |

---

## Headers vi sätter

Staging kan kontrolleras med: curl -I https://team-ampere-main.onrender.com och curl -I https://team-ampere-main.onrender.com/api/v2/invoices
Resultatet visar följande headers:

```bash
jiasun@jiadeMacBook-Air Team-Ampere % curl -I https://team-ampere-main.onrender.com
HTTP/2 200
date: Fri, 02 Oct 2026 12:36:06 GMT
content-type: text/html
cache-control: no-cache
etag: W/"6abf8f59-1db"
last-modified: Fri, 02 Oct 2026 11:02:49 GMT
rndr-id: c3036832-4874-4b4d
server: cloudflare
vary: Accept-Encoding
x-render-origin-server: nginx/1.31.6
cf-cache-status: DYNAMIC
cf-ray: a443bfeb0a8146ab-ARN
alt-svc: h3=":443"; ma=86400

jiasun@jiadeMacBook-Air Team-Ampere % curl -I https://team-ampere-main.onrender.com/api/v2/invoices
HTTP/2 401
date: Fri, 02 Oct 2026 12:36:15 GMT
content-type: application/json; charset=utf-8
alt-svc: h3=":443"; ma=86400
etag: W/"1d-V8zcz0YQQt8vle5rLhgyE9VCNj0"
rndr-id: b498d52d-40fd-4e34
server: cloudflare
vary: Accept-Encoding
via: 1.1 Caddy
www-authenticate: Bearer
x-render-origin-server: nginx/1.31.6
cf-cache-status: DYNAMIC
cf-ray: a443c06c9f5beff6-ARN'
```

CORS-konfigurationen i API:t innehåller bland annat:
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: *
CORS-headerna sätts av Express i mock-API:t. De är inte en nginx-konfiguration.

Access-Control-Allow-Origin: * är en medvetet kvarlämnad begränsning i kursprojektet. I en produktionsmiljö bör tillåtna origins begränsas till de domäner som faktiskt behöver åtkomst.

## Kända brister (medvetet kvar)

1. Bred CORS-konfiguration

API:t använder:

Access-Control-Allow-Origin: *

Det innebär att alla origins tillåts av CORS. Detta är bredare än vad som normalt rekommenderas i produktion.

Vi har valt att inte ändra detta inom ramen för kursprojektet eftersom API:t fortfarande kräver en giltig Bearer-token för åtkomst.

2. Mock-API och kursmiljö

Projektet använder ett mock-API och testdata. Autentiseringen och säkerhetslösningarna är därför anpassade för kursprojektet och ska inte betraktas som en komplett produktionslösning.

3. Begränsad logging och alerting

API:t loggar autentiseringsfel, men vi har ingen komplett central loggning, övervakning eller automatisk alerting som i en produktionsmiljö.
