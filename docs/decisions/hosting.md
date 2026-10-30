# Beslut: Hosting av Team-Ampere (Kraftly)

**Datum:** 2026-09-22 · **Beslut:** Vi använder Render för staging med två separata webbtjänster som kör Docker-images för frontend/nginx och mock-API.

## Bakgrund

Vår app består av två containrar som kommunicerar via en nyckel som hanteras på servern:

- **web (nginx):** Serverar den byggda Vue-appen, proxar `/api/*` vidare och lägger till headern `X-Api-Key` (se `nginx.conf.template`).
- **api (mock-API):** Svarar bara på anrop som innehåller rätt `X-Api-Key`.

Lokalt körs båda containrarna med `docker compose`. I molnet behövde vi en plattform som kunde köra våra Dockerfiler, hantera miljövariabler (`API_URL`, `API_KEY`) per tjänst och integreras med GitHub Actions så att ändringar på `main` kan deployas automatiskt efter godkända tester.

## Alternativ vi jämförde

|                          | Render (valt)                                                                                                                                           | Azure Container Apps                                                     | Vercel / Netlify                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Kör våra Docker-images?  | Ja, via Dockerfile eller en färdig image från GHCR.                                                                                                     | Ja, kan köra images från GHCR.                                           | Inte lämpligt för vår lösning med en generell nginx-container och ett separat API. |
| Kostnad och registrering | Free-nivå finns, men kort kan krävas för kontoverifiering. Betald Starter-nivå kostar enligt vår dåvarande jämförelse cirka 7 USD per tjänst och månad. | Har en free tier, men kräver ett Azure-konto och kort vid registrering.  | Kostnadsmodell och begränsningar skiljer sig mellan tjänsterna.                    |
| Hantering av hemligheter | Miljövariabler per tjänst i Render Environment.                                                                                                         | Miljövariabler eller secrets, med möjlighet att använda Azure Key Vault. | Inte utvärderat för vår Docker-baserade lösning.                                   |
| Kallstart                | Free-tjänster kan somna efter inaktivitet och behöver tid för att vakna.                                                                                | Consumption plan kan skala till noll och få kallstart.                   | Inte direkt jämförbart med vår nuvarande containerlösning.                         |
| Leverantörsspecifik kod  | Framför allt deploy-hooken och hur image-URL:en skickas till Render.                                                                                    | Kräver plattformsspecifika Azure-kommandon och secret-hantering.         | Skulle kräva en annan lösning för hosting och API-drift.                           |

## Motivering

Vi valde Render eftersom det var enkelt att komma igång med i en liten grupp och eftersom plattformen kunde köra våra befintliga Docker-images.

Nästan hela lösningen bygger på vanlig Docker-teknik och är därför inte beroende av Render. Vi använder två Dockerfiler och miljövariabler (`PORT`, `API_URL`, `API_KEY`) som läses när containrarna startar.

Den del som är specifik för Render är deploy-hooken i GitHub Actions (`ci.yml`). Om vi skulle byta plattform behöver vi framför allt ersätta detta steg med motsvarande deploy-mekanism hos den nya leverantören.

Render hade också ett enkelt gränssnitt för att hantera miljövariabler, vilket underlättade felsökning och integration med GitHub Actions.

## Konsekvenser

- Vi kan använda samma Docker-images lokalt och i staging.
- Frontend och mock-API körs som två separata webbtjänster.
- Miljövariabler och hemligheter hanteras separat för respektive tjänst.
- CI kan bygga och publicera images till GHCR och därefter starta en deploy via Render.
- Free-tjänster kan somna efter inaktivitet, vilket innebär att den första förfrågan kan ta längre tid.
- Staging har inte samma krav på tillgänglighet, övervakning och redundans som en riktig produktionsmiljö.
- Mock-API:t sparar inte data permanent, vilket innebär att information kan försvinna vid omstart.
- En riktig produktionslösning behöver bland annat riktig autentisering, permanent datalagring och tillräcklig övervakning.

**Omprövas om**:

- Vi behöver högre tillgänglighet eller redundans än vad vår nuvarande Render-konfiguration erbjuder.
- Kostnaden för Render ökar eller blir högre än motsvarande lösningar hos andra leverantörer.
- Vi behöver funktioner för skalning, övervakning eller säkerhet som vår nuvarande hostinglösning inte kan erbjuda.
- Vi behöver flytta från staging med mock-API till en riktig produktionsmiljö med ett separat backend och en permanent databas.
