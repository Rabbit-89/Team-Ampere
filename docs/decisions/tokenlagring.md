# Beslut: var lagrar vi access token?

### Beslut :

Access token ligger i minnet, i en `ref` i `src/services/token.js`, och skickas som `Authorization: Bearer` i `api.js`. Den skrivs aldrig till localStorage eller sessionStorage. Refresh token ligger i en httpOnly-cookie som API:t sätter, och den används bara mot `/api/v2/auth/refresh`. Vid 401 och vid appstart ber klienten om en ny access token, så en omladdning (F5) loggar inte ut användaren.

**Alternativen och varför vi valde bort dem:**

- **localStorage:** Enklast, och token överlever omladdning. Men all JavaScript på sidan kan läsa den, så ett enda XSS-hål (eller ett komprometterat npm-paket) gör att token kan stjälas och användas var som helst. Det är samma sorts hål vi utnyttjade i hackerlabben, och det var också vad den gamla `kraftly_logged_in`-flaggan visade: allt i localStorage går att läsa och ändra av klienten.
- **Cookie för dataanrop:** httpOnly gör att JavaScript inte kan läsa den, vilket är en fördel. Men webbläsaren skickar den automatiskt, så vi får CSRF-risk och måste lita på SameSite eller CSRF-token. Vi ville att dataanrop ska bäras av token, inte av en cookie (därför togs `credentials: 'include'` bort från dataanropen).
- **Minne (valt):** Token kan inte läsas från localStorage och försvinner när fliken stängs. Priset är sämre användarupplevelse: utan refresh loggas man ut vid F5. Det löser vi med refresh-cookien, som inte går att läsa från JS och som bara kan användas mot en enda endpoint.
