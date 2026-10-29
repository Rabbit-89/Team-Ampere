# kraftly-portal (Mina sidor)

[![CI](https://github.com/Rabbit-89/Team-Ampere/actions/workflows/ci.yml/badge.svg)](https://github.com/Rabbit-89/Team-Ampere/actions/workflows/ci.yml)

Kundportal för Kraftly (Vue 3, Pinia, vue-router), levererad av Webbmakarna AB 2026-06-30 och sedan övertagen av Team Ampere. Appen är statiska filer bakom nginx, som också är proxy mot Kraftlys API.

## Adresser

| Miljö   | Adress                                  |
| ------- | --------------------------------------- |
| Prod    | https://kraftly-teamampere.onrender.com |
| Staging | https://team-ampere-main.onrender.com   |

Båda körs på Renders gratisnivå och somnar efter 15 minuters inaktivitet. Första anropet efter det kan ta upp till en minut.

## Kom igång

Du behöver Git och Docker (eller **Node 22** om du kör utan Docker; nyare versioner som Node 24 ger fel vid `npm ci` i Docker-bygget).

**1. Hämta koden och skapa din `.env`**

```
git clone https://github.com/Rabbit-89/Team-Ampere.git
cd Team-Ampere
cp .env.example .env
```

`.env` är bara för din dator och committas aldrig. Värdena i `.env.example` fungerar som de är lokalt.

**2a. Med Docker (rekommenderas)**

```
docker compose up --build
```

Öppna http://localhost:8080.

**2b. Utan Docker**

```
npm install
npm run api     # mock-API på localhost:4000 (låt det vara igång)
npm run dev     # i en ny terminal, öppna http://localhost:5173
```

För end-to-end-tester med Playwright, installera Chromium en gång:

```
npx playwright install chromium
npm run e2e:pw
```

Playwright startar själv mock-API:t och utvecklingsservern när testerna körs. Cypress finns också som beroende, men dess stora binär behövs inte för Playwright-testerna. Hoppa över nedladdningen av den vid installation med `CYPRESS_INSTALL_BINARY=0 npm install` (PowerShell: `$env:CYPRESS_INSTALL_BINARY=0; npm install`).

**3. Hur vet jag att det fungerar?**

- Inloggningssidan visas och du kan logga in, och dashboarden visas efteråt.
- `npm run test:run` ska vara grön.
- Inloggning lokalt: <FYLL I – vilka uppgifter fungerar mot mock-API:t? Testa på en färsk klon>.

## Hemligheter: var bor de och hur får jag dem?

| Vad                   | Var                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `API_KEY` lokalt      | Din egen `.env`. Vilket värde som helst fungerar mot mock-API:t.                           |
| `API_KEY` i molnet    | Render → tjänstens Environment. Läggs på av nginx på servern och når aldrig webbläsaren.   |
| Deploy hooks          | GitHub → Settings → Environments → `staging` / `production` → Secret `RENDER_DEPLOY_HOOK`. |
| Adresser till miljöer | Samma ställe, som Variables (`STAGING_URL`, `PROD_URL`).                                   |

Den riktiga teamnyckeln delas aldrig i en kanal eller i repot. Be nuvarande tech lead om den via direktmeddelande. Hela tabellen med varje variabel står i `docs/deploy.md`.

## Hur kommer en ändring till produktion, och hur rullar man tillbaka?

1. Varje ändring görs i en gren och går via en PR. Minst en annan teammedlem granskar. `main` är skyddad.
2. CI körs på PR:en (kvalitet, build, e2e, Storybook, Prestandabudget). Allt måste vara grönt för att kunna merga.
3. Vid merge till `main` byggs en image en gång, pushas till GHCR taggad med commitens sha, och deployas automatiskt till **staging**.
4. **Produktion** deployas med exakt samma image, men först efter att en reviewer godkänt i GitHub-miljön `production`.
5. Båda deployerna verifieras: jobbet väntar tills `/version.txt` visar rätt sha och kör sedan ett röktest.

**Rollback:** GitHub → Actions → **Rollback** → Run workflow. Välj miljö (`staging` eller `production`) och klistra in hela sha:n för en tidigare, fungerande version. Det tar ungefär 30 sekunder. Produktion kräver godkännande av en reviewer. Kontrollera efteråt att `<adress>/version.txt` visar den gamla sha:n. Mer i `docs/deploy.md`.

## Dokumentation

| Fil                                                   | Svarar på                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `docs/architecture.md`                                | Vad pratar med vad, var kör det, lagren i frontend                   |
| `docs/decisions/`                                     | Varför. Ett dokument per beslut, index i `docs/decisions/README.md`  |
| `docs/deploy.md`                                      | Hur en ändring når staging och prod, var hemligheterna bor, rollback |
| `docs/pipeline.md`                                    | Vad som krävs för att merga, vad man gör när `main` är röd           |
| `docs/containers.md`                                  | Dockerfile, imagens storlek, beslut om basimage                      |
| `docs/scaling.md`                                     | Belastningsmätningar och var flaskhalsen finns                       |
| `docs/testing.md`                                     | Vad som testas var                                                   |
| `docs/security.md`                                    | Inloggningen och OWASP-genomgången                                   |
| `docs/performance.md`                                 | Hur vi mäter, optimeringarna, budgeten i CI                          |
| `docs/accessibility.md`                               | Komponentbiblioteket och tangentbordsgenomgången                     |
| `docs/ai-in-pipeline.md`                              | AI-granskningen och vår regel för den                                |
| `docs/sustainability.md`                              | CO2-siffran och etikfallet                                           |
| `docs/readiness.md`                                   | Checklistan Produktionsfärdig app med status per rad                 |
| `docs/known-issues.md`                                | Vad som är känt trasigt eller medvetet ogjort                        |
| `docs/demo.md`                                        | Körschemat för slutdemon                                             |
| `docs/log.md` · `docs/milestones.md` · `docs/debt.md` | Loggen, milstolparna, skulden vi tog över                            |

## Kommandon

| Kommando                        | Gör                                    |
| ------------------------------- | -------------------------------------- |
| `npm run dev`                   | Utvecklingsserver (Vite)               |
| `npm run api`                   | Mock-API på port 4000                  |
| `npm run test:run`              | Alla tester en gång                    |
| `npm run test:a11y`             | Tillgänglighetstester (axe)            |
| `npm run e2e:pw`                | End-to-end-test (Playwright)           |
| `npm run lint` · `format:check` | Kodkvalitet                            |
| `npm run storybook`             | Komponentbiblioteket på localhost:6006 |
| `npm run build`                 | Produktionsbygge                       |

# Arbetsavtal

## Git

- Vi använder kortlivade funktionsgrenar.
- Alla ändringar i main går igenom en PR.
- Minst en teammedlem måste granska PR:n.

## Commits

Vi använder konventionella Commits.

## Kodgranskning

Granskningar bör vara respektfulla och konstruktiva.
PR:er bör vara små och lätta att granska.

## Kommunikation

- Vi kommunicerar i Teams.
- Vi ber om hjälp när vi är blockerade.
- Om en person skickar meddelandet, det måste svaras inom 2 timmar under veckodagar på dagtid.
- Vi ska ha en blameless work kultur, vi kommer att fokusera på fixa problemet.

## Mötestider

- Tisdag – på distans kl. 10:00
- Fredag – på distans kl. 10:00
- Vi lägger till fler mötestider vid behov.

## Definition of done för PR:er

- Vad ändrades?
- Varför?
- Hur testar man?
- Checklista
- Jag har kört appen och sett att buggen är borta
- Commit-meddelandet följer conventional commits
- Grenen utgår från färskt
- Ticketets "Klar när"-punkter är avbockade

## Tech lead-schema för rotationen

| **VECKA** | **TECH LEAD** |
| --------- | ------------- |
| 1-3       | Leo           |
| 4-6       | Rabbiya       |
| 7-9       | Jia           |
| 10-12     | Leo           |
