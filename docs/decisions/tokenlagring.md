# Beslut: Var lagrar vi access token?

**Datum:** 2026-10-06 · **Beslut:** Access token lagras i minnet (en `ref` i `src/services/token.js`), medan refresh token lagras i en httpOnly-cookie som API:t sätter.

## Bakgrund

Vi behövde bestämma hur vi skulle lagra och hantera tokens för användarens autentisering. Lösningen behövde skydda access token från att kunna läsas av JavaScript, samtidigt som användaren skulle kunna behålla sin inloggning efter en sidomladdning (F5).

Den tidigare `kraftly_logged_in`-flaggan i localStorage visade att information i localStorage kan läsas och ändras av klienten. Vi ville därför undvika att lagra känsliga tokens där.

## Alternativ vi jämförde

|                         | Minne + httpOnly-cookie (valt)                                               | localStorage                                              | Cookie för dataanrop                                                       |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| Åtkomst från JavaScript | Access token lagras i minnet och refresh token kan inte läsas av JavaScript. | JavaScript kan läsa och ändra token.                      | En httpOnly-cookie kan inte läsas av JavaScript.                           |
| Säkerhet                | Minskar risken att access token stjäls genom XSS.                            | XSS kan läsa och stjäla token.                            | Kräver hänsyn till CSRF eftersom webbläsaren skickar cookies automatiskt.  |
| Sidomladdning (F5)      | Refresh token används för att hämta en ny access token.                      | Token finns kvar efter omladdning.                        | Cookien finns kvar efter omladdning.                                       |
| Konsekvens              | Kräver ett separat refresh-flöde.                                            | Enklare att implementera men innebär större risk vid XSS. | Kräver att vi hanterar CSRF-skydd, till exempel SameSite eller CSRF-token. |

## Motivering

Vi valde att lagra access token i minnet eftersom den då inte behöver sparas i localStorage eller sessionStorage, där JavaScript kan läsa den.

Refresh token lagras i en httpOnly-cookie som API:t sätter. Den används endast vid anrop till `/api/v2/auth/refresh`.

Access token skickas i `Authorization: Bearer`-headern via `api.js`. Vid appstart och när API:t svarar med 401 kan klienten begära en ny access token.

På så sätt kan användaren behålla sin inloggning efter en sidomladdning utan att access token behöver lagras permanent i webbläsaren.

## Konsekvenser

- Access token försvinner när fliken stängs eller sidan laddas om, men kan hämtas igen med hjälp av refresh token.
- Vi behöver ett separat refresh-flöde för att användaren ska kunna behålla sin inloggning efter en sidomladdning.
- Dataanrop använder `Authorization: Bearer` i stället för cookies, vilket innebär att `credentials: 'include'` inte behövs för dessa anrop.
- Vi undviker att lagra access token i localStorage och sessionStorage, vilket minskar risken att token stjäls genom XSS.

**Omprövas om** backend inte längre kan hantera refresh token via en httpOnly-cookie, eller om nya säkerhetskrav innebär att vi behöver utvärdera ett annat sätt att hantera access token och refresh token.
