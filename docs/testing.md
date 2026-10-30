# Teststrategi – Kraftly Mina sidor

## Nivåer

Enhet (Vitest): Testas när ny logik och funktioner skapas eller ändras

Komponent (Vitest + Vue Testing Library): Testas när en komponent innehåller användarinteraktion, rendering av data eller viktig funktionalitet.
E2E (CPlaywright): Testas för kritiska användarflöden som sträcker sig över flera sidor eller komponenter, exempelvis inloggning, formulär och navigering.

## Karta: vad testas var

(tabellen från del 1, ifylld)

| Del av portalen            | Nivå(enhet / komponent / E2E) | Varför just där                                                                            | Finns test idag? |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ | ---------------- |
| Prisformattering           | Enhetstest                    | priset visade i engelska format men kund ville ha den i den svenska format                 | ja               |
| Förnamn i hälsning         | Enhetstest                    | För att det känns lite personligt.                                                         | ja               |
| Fakturastatus (förfallen?) | Enhetstest                    | Det försakra kund att veta att vad är det sista datum att betala faktura                   | ja               |
| Validering flyttanmälan    | Enhetstest                    |                                                                                            | ja               |
| StatusChip                 | Enhetstest                    | Kunden måste kunna se tydligt att vilka fakturor är betald eller obetald                   | nej              |
| Flyttanmälans formulär     | Enhetstest                    | Det måste vara tydligt labels i förmular så att kunden vet vad måste fyllas i i varje fält | Nej              |
| Förbrukningsdiagrammet     | komponent                     |                                                                                            | Nej              |
| Stores (user, consumption) | Enhetstest                    |                                                                                            | Nej              |
| API-klienten (api.js)      |                               |                                                                                            | Nej              |
| Inloggningsflödet          | E2E                           |                                                                                            | Nej              |
| Navigation mellan sidor    | E2E                           |                                                                                            | Nej              |

## Regler

- PR mergas bara när vi testat (om ny logik läggs till)
- En buggfix måste ha ett regressionstest
- Vi mockar API:et genom Modulmock (vi.mock) i komponenttester
- Täckning: Inget krav

## Regler

### 1. Vad testar vi inte, och varför? (Chart.js? CSS? Routerns interna beteende?)

Vi testar inte externa bibliotek som Chart.js eller Vue Router internt. Vi testar endast vår egen kod och integrationen mot dessa bibliotek.

### 2. Hur mockar vi API:et? Modulmock (vi.mock) i komponenttester, riktigt mock-API i E2E, eller något annat?

En regel, inte per test. Komponenttester använder modulmockning med vi.mock. E2E-tester använder Kraftlys mock-API.

### 3. Vad krävs för att en PR ska få mergas när det gäller test? Alla gröna är självklart. Måste ny logik ha nytt test? Måste en buggfix ha ett regressionstest? (Facits svar: ja på det senare – och det är en bra regel.)

PR mergas bara när alla relevanta tester är gröna. Ny logik ska ha relevanta tester. En buggfix ska alltid ha ett regressionstest som visar att buggen är fixad och inte kommer tillbaka.

### 4. Täckningskrav – ja eller nej? Ett vanligt reflexval är "80 % coverage". Vad garanterar det faktiskt? Vad garanterar det inte? Bestäm er, och skriv varför.

Vi sätter inget fast krav på en viss procent av testtäckningen, utan kräver att viktig logik har meningsfulla och relevanta tester.

### 5. Namngivning & placering. *.test.js bredvid koden eller i tests/? Testnamn på svenska eller engelska?

(Koden är på engelska. Testnamn läses av människor – bestäm.)

Vi lägger *.test.js i /src/utils/... så t.ex. format.test.js i samma mapp som format.js och vi kör koden på engelska

## Vad vi medvetet inte testar

…

## Kommandon

npm test · npm run test:run · (npm run cy:open)
