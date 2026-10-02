# Säkerhet

## Autentisering

API v2 använder Bearer-token för autentisering.

Skyddade API-anrop skickar access-token i följande header:

```http
Authorization: Bearer <accessToken>
```

Access-token hämtas efter inloggning och skickas med av frontend vid API-anrop.
Frontendens route guard skickar utloggade användare till /login. Detta är endast en UX-åtgärd. Den faktiska säkerheten och åtkomstkontrollen hanteras av API:t.

## Anrop utan autentisering

Skyddade endpoints ska neka anrop som saknar en giltig access-token.

Test:
curl -s -o /dev/null -w "%{http_code}\n" \
https://team-ampere-main.onrender.com/api/v2/invoices

Resultat:
401

Det visar att API:t inte lämnar ut data från den skyddade endpointen utan autentisering.

## Autentiserade anrop

En giltig JWT access-token hämtades via login-endpointen och skickades i Authorization-headern.

Test:
curl -i \
-H "Authorization: Bearer $TOKEN" \
https://team-ampere-main.onrender.com/api/v2/invoices

Resultat:
200

Det visar att ett korrekt autentiserat anrop kan komma åt den skyddade endpointen.

## Klientstyrda identifierare

API:t ska inte använda klientstyrda identifierare, till exempel customerNo, för att välja vilken skyddad data som ska returneras.

Följande anrop testades:
curl -s \
-H "Authorization: Bearer $TOKEN" \
"https://team-ampere-main.onrender.com/api/v2/invoices?customerNo=K-999999"

Resultatet jämfördes med:
curl -s \
-H "Authorization: Bearer $TOKEN" \
"https://team-ampere-main.onrender.com/api/v2/invoices"

Båda anropen returnerade samma fakturadata.
Det visar att det tillagda customerNo- parametern inte påverkar vilken fakturadata API:t returnerar.

## OWASP-genomgång

### A01: Broken Access Control

Skyddade API-endpoints kräver autentisering. Anrop utan en giltig token nekas med 401 Unauthorized.
Frontendens route guard ska inte betraktas som en säkerhetsgräns. Den används för UX. API:t ansvarar för att upprätthålla åtkomstkontrollen.

### A02: Cryptographic Failures

Access-token skickas i Authorization: Bearer-headern och inte som en query parameter.
Tokens och lösenord ska inte finnas i källkod, dokumentation, commits eller loggar.

### A05: Security Misconfiguration

API:t nekar anrop utan en giltig autentiseringstoken.
Säkerhetskonfigurationene testades mot staging-miljön och ett oautentiserat anrop returnerade 401.

### A07: Identification and Authentication Failures

API:t använder JWT access-token för autentiserade anrop.
Följande tester genomfördes:

Igen token - 401
Ogiltig eller utgången token - 401
Giltig JWT - 200'

### A09: Security Logging an Monitoring Failures

Misslyckade autentiseringförsök loggas av API:t så att nekade anrop kan undersökas.
Känsliga uppgifter, såsom lösenord och access-token, ska inte skrivas till applikationsloggar.

## Sammanfattning an säkerhetstester

| Kontroll                                    | Resultat |
| ------------------------------------------- | -------- |
| Skyddad endpoint utan token                 | `401`    |
| Ogiltig/utgången token                      | `401`    |
| Giltig JWT                                  | `200`    |
| Påverkar `customerNo` fakturadatan?         | Nej      |
| Route guard skickar utloggade till `/login` | Ja       |
| API:t upprätthåller autentisering           | Ja       |

## Slutsats

Staging-API:t kräver autentisering för den skyddade invoices-endpointen. Frontend skickar access-token med Bearer-authentication, medan API:t ansvarar för att upprätthålla åtkonstkontrollen.

Tester visar också att en klientstyrd customerNo-queryparameter inte ändrar den fakturadata som API:t returnerar.
