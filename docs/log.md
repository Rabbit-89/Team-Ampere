# 2026-08-28 · Boiler Room 1

### Jia

**Gjort:** Dokumenterat vårt beslut att använda Playwright för E2E-tester och skapat en PR för beslutet.

**Grönt:** -

**Kvar till M1-taggen tisdag:** Göra enhetstester för flyttanmälans formulär och statusChip.

**E2E:** valde Playwright · smoke + mockat test gröna: ja

**Fastnat på:** Idag var jag förvirrad över om flyttanmälans formulär ska testas som ett komponenttest eller ett enhetstest. AI:n gav förslag på komponenttest eftersom formuläret har interaktion med användaren. Men som jag förstår det ska vi inte testa riktig data eller hela användarflödet, utan funktionerna i formuläret, till exempel att ett felmeddelande visas när användaren skriver fel. Därför tänker jag att det ska vara ett enhetstest.

### Rabbiya

**Gjort:** Körde Cypress e2e test tillsammans med Jia. Skrev test om Stores/user.js .. Lyckades få den grön

**Grönt:** -

**Kvar till M1-taggen tisdag:** Flera enhetstester och komponentstester. Ska välja annan test att göra.

**E2E:** valde Playwright · smoke + mockat test gröna: ja

**Fastnat på:** Var osäkert på vart user.test.js ska ligga, men det löste sig när jag frågade Jonatan. Jag stötte på ett problem där npm test inte fångade upp några testfiler. Anledningen var att vitest varken var installerat som beroende eller tillagt under "scripts" i package.json.

### Leo

**Gjort:** Missade förmiddagens tillfälle men gjorde playwright-tester på eftermiddagen

**Grönt:** -

**Kvar till M1-taggen tisdag:** Fler enhetstester samt något komponentstest

**E2E:** valde Playwright · smoke + mockat test gröna: ja

**Fastnat på:** Inget jag sitter fast på. Ska ligga i och göra tester på måndag.

# 2026-08-31

### Jia

**Vad har jag gjort idag?**

Idag har jag gjort klart enhetstester för StatusChip och API-klienten. Det gick bra och båda testerna blev godkända.

**Vad var svårt?**

I början var jag förvirrad över skillnaden mellan komponenttester och enhetstester. Efter att ha gjort research och fått hjälp av AI förstår jag nu att enhetstester handlar om att testa en enskild funktion, medan komponenttester handlar om att testa en UI-komponents beteende och hur den fungerar i sitt sammanhang.

**Vilka hinder har jag?**

Inga hinder idag.

### Leo

**Vad har jag gjort idag?**

Idag har jag gjort komponentstest och E2E-test

**Kvar till M1-taggen tisdag:**

FIxa husky och lint-stage

**Vad var svårt?**

Fick ett par konflikter efter att jag skulle committa och merga mina tester men det löste sig.

**Vilka hinder har jag?**

Inga hinder idag.

### Rabbiya

**Vad har jag gjort idag?**

Föregående arbetsdag skrev jag testet för endast **load()**-funktionen för användardata i user.js. Idag utökade jag user.test.js med tester för **save()** funktionen, samt en test som hanterar **alert()**-anropet. Därefter skrev jag ett E2E-test för navigering mellan olika sidor i appen.

**Vad var svårt?**

När jag skrev testet för **save()** fick jag ett misslyckat test, och jag var till en början osäker på hur jag skulle testa **alert()**-anropet och varför det behövdes. Med hjälp av AI förstod jag att window.alert behöver mockas i testet, annars stör den riktiga webbläsarpopupen testkörningen — och att detta fortfarande räknas som ett enhetstest eftersom **alert()** bara är ett vanligt JavaScript-API, inte en Vue-komponent.

Att skriva E2E-testet var enklare, eftersom jag kunde navigera igenom hela flödet och se det visuellt i Playwrights UI. Det gjorde det lättare att upptäcka problem i testet och åtgärda dem direkt.

# 2026-09-01

### Jia

**Vad har jag gjort idag?**

Idag har jag gjort klart enhetstester för fakturastatus och prisformatering. Alla tester blev godkända.

**Vad var svårt?**

Det känns fortfarande svårt för mig att göra tester, men jag kan göra mer övning för att bli bättre på det. En annan sak som var lite svår var att förstå hur ESLint och pre-commit fungerar tillsammans och vad som behöver göras av hela teamet.

**Vilka hinder har jag?**

Inga hinder idag.

### Leo

**Vad har jag gjort idag?**

Installerade ES-lint, prettier och husky med pre-commits i repot.

**Vad var svårt?**

Mycket att göra, inte svårt i sig men lite information overload.

**Vilka hinder har jag?**

Inga hinder idag.

### Rabbiya

**Vad har jag gjort idag?**

Idag skrev jag en funktion och ett test för validateMove (validering av flyttanmälningsformuläret), samt en funktion och ett test för firstName (som extraherar förnamnet till hälsningen på dashboarden). Skrev en regression test. Skrev funnktionen ValidateEmail.js , skrev ett test för den.. och skrev test för ProfileView.

**Vad var svårt?**

Det svåraste idag var att skriva regression test och testet för validateMove. Formuläret har flera fält som ska valideras samtidigt (adress, postnummer, ort, datum, avtal), vilket gjorde det svårare att strukturera testerna jämfört med enklare funktioner som firstName.
Att förstå hur funkar ES-Lint var också lite svårt.
Att skriva en regression test var lite komplicerad och tog lite tid att förstå.

**Vilka hinder har jag?**

Inga hinder idag.

### Reflektion

Det vi är mest nöjda med är regressionstestet, eftersom användaren tidigare kunde skriva vad som helst i e-postfältet, till exempel sitt namn istället för en e-postadress, och det sparades ändå eftersom det inte fanns någon validering. Det var dokumenterat som en känd bugg i docs/debt.md.

Vi ska också visa vårt E2E-test för inloggningsflödet.

# 2026-09-03

### Jia & Rabbiya

**Vad har jag gjort idag?**

Idag har jag arbetat med CI och GitHub Actions. Jag har testat workflowet efter att vi lade till build-jobbet och upptäckte och fixade problem med Prettier-formatet i ci.yml. Efter att vi pushade ändringarna körde CI igen och build-jobbet blev godkänt. Jag har också börjat arbeta med E2E-jobbet och förstått hur Playwright kan köras som ett eget jobb i CI.

**Vad var svårt?**

Det var lite svårt att förstå varför GitHub Actions först visade att processen hade avbrutits. Jag behövde gå igenom loggarna för att förstå skillnaden mellan ett riktigt fel och att ett workflow har blivit cancelled. Det var också lite svårt att förstå hur E2E-jobbet ska kopplas till quality och build, och om det ska köras parallellt eller med needs:.

**Vilka hinder har jag?**

Inga större hinder idag. Jag behöver fortfarande öva mer på CI, GitHub Actions och E2E-tester för att känna mig mer säker på hur allt hänger ihop.

### Leo

Sjukledighet

# 2026-09-04

### Jia, Rabbiya, Leo

**vad gjorde vi?**

Vi skapade en ny branch och lägg till extra rad i ci.yml filen och lagd CI-badge överst i README som visar passing . Sen vi skapade en pull request. Den var röd för att det var några formatting fel, extra rad i yaml filen. Vi fixade den och sen var PR grön. vi tog skärmdump av den merge knapp som var låst.

**vad var svårt?**

Vi försökte att testa fel i pipeline genom att skriva några syntaxfel men de fixade sig själv när vi sparade ändringar.

**PR Röd**

**rad:** github/workflow/ci.yml rad: 62, 63

**Fel:** Det var en formatting fel. Några extra tom rad.

# 2026-09-07

## New Tech Lead: Rabbiya

vecka 1-3: **Leo**

vecka 3-9: **Rabbiya**

1. Vi gjorde minst 15 tester (enhets, komponent och e2e tester) och vi har valt Playwright som e2e verktyg.

2. Vi har skapat en pipeline där det finns 3 jobb:

   1. Quality
   2. Build
   3. E2E - (Alla ska köra parallelt.)

3. Vi har även diskuterat om protokoll om main ska vara rött. Tech Lead ska ansvaras för kolla att main är grön efter merge inom 30 minuter. Om Tech Lead är inte tillgängligt då den person som ska merga vara ansvar för den.

# 2026-09-11

### Jia

**Vad har jag gjort idag?**

Idag har jag fortsatt att arbeta med Docker och containers. Jag fixade problemet med Docker Compose och Nginx så att frontend kan startas med docker compose up --build och öppnas på localhost:8080.

Jag testade Docker images och jämförde en naiv build med en multi-stage-build. Den naiva imagen var 1,52 GB och multi-stage-imagen var 43,7 MB. Jag dokumenterade resultaten i docs/containers.md.

Jag skrev dokumentation om hur man kör projektet, hur mock-API:t fungerar, hur webbläsaren når API:t, vad som körs i CI och vilka begränsningar som finns. Jag förberedde även ett PR för ändringarna.

**Vad var svårt?**

Det som var svårt idag var att förstå varför frontend-containern inte startade. Nginx kunde inte hitta api som upstream. Efter att jag startade om Docker Compose kunde frontend startas korrekt.

### Rabbiya

**Vad har jag gjort idag?**

Implementerade en multi-stage Dockerfile med Node för build-steget och nginx som serveringssteg.
Lade till .dockerignore.
Konfigurerade nginx.conf med SPA-fallback så att exempelvis /fakturor fungerar även vid omladdning och inte ger 404.
Kontrollerade Docker-imagens storlek med docker image ls och verifierade att den är under 100 MB.
Jag kunde inte ta skärmdumpen av docker image ls till docs/containers.md, så detta behöver kompletteras.

**vad var svårt**
Det var svårt att förstå hur docker funkar, tog lite tid att förstå hur man starta docker.

### Leo

**Vad har jag gjort idag?**

Läste på mer om docker och fick en liten genomgång av mina kollegor/klasskamrater.

# 2026-09-15

### Jia, Leo, Rabbiya

Vi hade en teamdiskussion om våra tre beslut för Docker-uppsättningen. Under diskussionen ändrade vi Beslut 2.

Tidigare: api-servicen använde image: node:22-alpine direkt i Compose-filen och monterade in ./mock-api-mappen som en bind mount i containern.

Nu: vi bestämde att mock-API:t ska ha sitt eget Dockerfile istället för bind mount. Koden byggs nu in i en egen image via build: ./mock-api, så imagen blir självständig och innehåller allt den behöver för att köras – oavsett vilken maskin man startar den på.

### Leo

**Vad jag har gjort idag?**

Jag skapade en temporär mapp där jag klonade repot för att testa docker compose up --build och allting gick som det skulle.

**Vad var svårt?**

Ingenting egentligen, allt flöt på som det skulle.

# 2026-09-17

### Jia

**Vad har jag gjort idag?**

Arbetade med M4-uppgiften Spår 1 om att flytta API-nyckeln från frontendkoden.
Uppdaterade src/services/api.js så att API-nyckeln inte längre ligger direkt i frontendkoden.
Lade till miljövariabler via .env och .env.example.
Uppdaterade .gitignore och .dockerignore så att .env inte committas eller kopieras till Docker-builden.
Uppdaterade mock-api/server.js så att API:t kräver en giltig X-Api-Key.
Lade till stöd för PORT från miljön.
Uppdaterade nginx.conf till en template där API_URL, API_KEY och PORT sätts när containern startar.
Uppdaterade Docker-konfigurationen och testade docker compose up --build.
Felsökte E2E-testerna i GitHub Actions. Build och image gick igenom, men E2E behövde justeras eftersom /api/user nu kräver API-nyckel.
Ändrade Playwrights health check till /healthz och identifierade att mock-API:t behöver en /healthz endpoint.

**Vad var svårt?**

Docker-builden för mock-API:t misslyckades eftersom Husky kördes under npm ci --omit=dev.
Löste detta genom att använda --ignore-scripts.
E2E-testet fick senare timeout eftersom /healthz saknades i mock-API:t.

### Rabbiya

**Vad har jag gjort idag?**

Skapade en ny fork,
ändrade Rulesets (lägg till Image → GHCR)
i concurrency ändrade cancel-in-progress: true till cancel-in-progress: ${{ github.event_name == 'pull_request' }}
Lägg workflow_dispatch:under on:
ersätt jobb image med 2 två jobb publish och deploy-staging
mergat branchen M4 pipeline till main

**vad var svårt**

Pipeline är rött. Jag tror att det kommer att vara grön efter spår 3 är klart

### Leo

**Vad har jag gjort idag?**

Självstudier

# 2026-09-21

### Jia

**Vad har jag gjort idag?**

Självstudier

### Rabbiya

**Vad har jag gjort idag?**

försökte att fixa fel vid staging tillsammans med Leo

**vad var svårt**

Pipeline är rött. Det var något problemet med API kanske

### Leo

**Vad har jag gjort idag?**

Försökte lösa ett fel med staging tillsammans med Rabbiya

**Vad var svårt**

Vi fick rött och hade svårt att hitta problemet

# 2026-09-22

### Jia

**Vad har jag gjort idag?**

Fixat milestones.md och Readme.md

### Rabbiya

**Vad har jag gjort idag?**

Skapat en ny branch och skapade dokument filer
Deploy.md
Decisions/hosting.md

### Leo

**Vad har jag gjort idag?**

Skrivit daily log.

# 2026-09-24

### Rabbiya

Skapade produktion miljön. Och deployade web service produktion på Render.
Ändringar i produktion miljön.. Kräver godkänd innan det går ut.
Lägg till jobbet produktion i workflows.
Körde curl utan Cache-control och sen lägg till Cache-control.
Körde autocannon och gjorde mätningar latens (hur lång tid varje anrop tog, som percentiler) och genomströmning (hur många anrop och byte per sekund servern hann med)
Skapade scaling.md och lägg till siffror från mätningarna i en tabell

### Jia

Implementerade en runtime feature flag för Norge.
Lade till config.js, runtime-konfiguration och isEnabled() för att styra flaggan per miljö.
Lade till NorwayNotice på dashboarden och skrev tester för feature flaggen och komponenten.
Fixade testmiljön genom att lägga till @testing-library/vue och @testing-library/jest-dom.
Körte tester och lint, och skapade PR för ändringarna.
Konfigurerade FEATURE_NORWAY=true i staging och verifierade config.js med curl.
Verifierade att Norge-flaggan är av i production.
Skrev beslutdokumentet docs/decisions/feature-flags.md om varför vi valde runtime-konfiguration framför build-time-konfiguration.

### Leo

Självstudier

# 2026-09-28

### Rabbiya

**Vad har jag gjort idag?**

Gjorde Rollback igen.. kollade på tiden, skrev den i milestones.md
Skrev M5 DoD i milestones.md

# 2026-09-29

### Rabbiya

**Vad har jag gjort idag?**

Skrev regler om feature flag i scaling.md

### Jia

**Vad har jag gjort idag?**

Möte med teamet och självstudier

### Leo

**Vad har jag gjort idag?**

Jobbar med Volt's repo och gör failtester samt skrivit daily log.

## checkpoint

- lektion checkppoint
