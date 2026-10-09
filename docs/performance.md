# Prestanda

## Så mäter vi

Dashboarden: Chrome DevTools → Performance → Local metrics, lokal produktionsbuild, enhetsläge iPhone 12 Pro, Fast 4G, cache av och median av tre mätningar.

`/login`: Lighthouse CI i pipelinen.

JavaScript: gzip-storlekar från `npm run build`. Vi använder `npx vite-bundle-visualizer` för att identifiera stora moduler och beroenden.

Vi ändrar en sak i taget och mäter efter varje optimering.

## Budgeten

| Mått       | Budget  | Var                      | Varför just den    |
| ---------- | ------- | ------------------------ | ------------------ |
| LCP        | ≤ 2,5 s | `/login` i Lighthouse CI |                    |
| CLS        | ≤ 0,1   | `/login` i Lighthouse CI |                    |
| JavaScript |         | `/login` i CI,           | Vi ligger på ...KB |

## Optimeringarna

### 1. Hero-bilden

**Problem:** Hero-bilden var stor och bidrog till långsam LCP.

**Ändring:** Vi konverterade bilden från PNG till WebP, skalade om den till 1200 px bredd och tog bort den gamla PNG-filen. Bildens dimensioner anges i HTML och `fetchpriority="high"` används för att prioritera laddningen.

| Mått           |  Före |  Efter |
| -------------- | ----: | -----: |
| LCP, Dashboard | 9,1 s | 1,12 s |
| CLS, Dashboard |  0,03 |   0,03 |

PR: https://github.com/Rabbit-89/Team-Ampere/pull/73

### 2. Lazy routes

**Problem:** JavaScript för flera vyer låg i samma huvud-chunk, vilket innebar att mer kod än nödvändigt kunde behöva laddas vid start.

**Ändring:** Vi ändrade de statiska imports i `src/router/index.js` till lazy imports. Därmed kan varje vy laddas separat när den behövs.

| Mått              |      Före |    Efter |
| ----------------- | --------: | -------: |
| Huvud-chunk, gzip | 141,31 kB | 40,11 kB |

I den senaste produktionsbuilden är huvud-chunken 40,12 kB gzip. Vyerna byggs som separata JavaScript-chunks, bland annat `LoginView`, `DashboardView`, `InvoicesView`, `MoveFormView` och `ProfileView`.

PR: https://github.com/Rabbit-89/Team-Ampere/pull/75

### 3. Ta bort Lodash

**Problem:** Lodash användes för `debounce` i `DashboardView.vue`, men hela paketet bidrog till bundle-storleken.

**Ändring:** Vi skapade en egen `debounce`-funktion i `src/utils/debounce.js` och tog bort Lodash som direkt beroende till applikationen.

| Mått                |      Före |    Efter |
| ------------------- | --------: | -------: |
| DashboardView, gzip | 100,07 kB | 72,84 kB |

Lodash kan fortfarande finnas indirekt via utvecklings- och testverktyg, men används inte längre i applikationens källkod.

PR: https://github.com/Rabbit-89/Team-Ampere/pull/75

### 4. Optimera Chart.js

**Problem:** Importen `chart.js/auto` inkluderade fler Chart.js-komponenter än vad stapeldiagrammet behövde.

**Ändring:** Vi ersatte `chart.js/auto` med selektiva imports från `chart.js` och registrerade endast de komponenter som behövs för stapeldiagrammet: `BarController`, `BarElement`, `CategoryScale`, `LinearScale` och `Tooltip`. Vi uppdaterade även testets mock.

| Mått                |     Före |    Efter |
| ------------------- | -------: | -------: |
| DashboardView, gzip | 72,84 kB | 51,67 kB |

Efter ändringarna passerade alla 24 tester utan misslyckade tester.

PR: https://github.com/Rabbit-89/Team-Ampere/pull/75

## Flaskhalsen vi inte äger

I staging visar nätverksfliken drygt en halv sekunds väntan på `/api/v2/consumption`. Staging använder Kraftlys test-API, så fördröjningen ligger utanför vår kontroll och räknas inte som en av våra tre optimeringar.
