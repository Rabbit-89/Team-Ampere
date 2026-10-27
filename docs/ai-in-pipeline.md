# AI i utvecklingsflödet

## Vad vi kopplade in

- Första riktiga PR var #92
- Tid från push till kommentar: ej mätt i detta flöde/inte registrerat i arbetsflödet
- Kostnad per granskning: ej mätt / inte beräknat i detta fall
- Var nyckeln ligger: i PR-beskrivningen, ändrade filer, relevanta komponenter och testfiler samt de riktiga a11y-/felhanteringskommentarerna i kontrollen
- Varför det inte är en required check: det är en kvalitetsgranskning som stödjer utvecklingen, men det är inte en blockerande CI-kontroll och det exekveras inte automatiskt som en required status check

## Utvärdering

Modell och period: GitHub Copilot / AI-review, PR #92 (Utvärdering av kommentaren i samband med kodgranskning)

| PR  | Punkten i några ord                               | Träff / miss / oavgjord | Varför                                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #92 | Testet använder jest-dom matchers utan import     | träff                   | Testet använder toBeInvalid och toHaveAccessibleDescription men importerar inte @testing-library/jest-dom/vitest.                                                                                                                                                                                               |
| #92 | submitMove saknar felhantering                    | träff                   | await submitMove(form) exekveras utan try/catch, så nätverks-/serverfel blir ohanterade promise-fel och användaren får ingen återkoppling                                                                                                                                                                       |
| #92 | Felmeddelande saknar fokus/live-region vid submit | oavgjord                | Kommentaren pekar på ett reellt tillgänlighetsproblem, men i kodändringen finns redan aria-invalid och aria-describedby på fälten. Det finns alltså en del av problemet i fixen, men inte hela lösningen. Det är inte en ren miss, men heller inte en fullständig "träff" så det blir bäst klassat som oavgjord |

Totalt: 3 punkter på 1 PR - 2 träffar, 0 missar, 1 oavgjord

## Två exempel

### Träff: Testmatchers saknas i testmiljön

> “Testet använder toBeInvalid och toHaveAccessibleDescription men importerar inte @testing-library/jest-dom/vitest.”

Detta var korrekt. I MoveFormView.a11y.test.js användes matchers utan att de var registrerade, vilket gör att testerna inte kan köra som tänkt. Det är exakt den typ av problem som AI-granskningen fångar bra: konkreta API-anrop i testet, fel konfiguration i testmiljön och tydlig reproducerbar konsekvens.

### Oavgjord: Fokus/live-region vid misslyckad validering

> “Flytta fokus till första ogiltiga fältet efter misslyckad validering, eller annonsera felen med role='alert' eller en sammanfattning.”

Det här är en relevant tillgänglighetskritik, men det är inte ett fullständigt “miss” i den meningen att koden är helt fel. I denna PR är fel kopplade till rätt fält via aria-describedby och aria-invalid, vilket är ett verkligt förbättringssteg. Men den fulla a11y-lösningen – att ge återkoppling i live-region och fokushantering – saknas fortfarande. Därför bör vi bedöma det som oavgjort/draw: rätt problem, men inte komplett löst i den här ändringen.

## Vår regel

- Vi litar på AI-kommentaren när den identifierar ett konkret kodproblem som är verifierbart i koden eller i en testmiljö.

- Vi accepterar inte en kommentar bara för att den “låter rätt” – vi kräver att den kan kopplas till koden, testet eller tillgänglighetskravet.

- Om vi inte håller med, svarar vi på kommentaren med motivering: vilka delar som redan är lösta, vilken risk som faktiskt finns, och varför vi anser att den inte är blockerande i detta PR.

- Om diffen är för stor för att AI:n ska kunna granska den månligt, begränsar vi bedömningen till de ändrade filerna med högst risk och den aktuella domänen.

- Om modellen byts ut, kör vi samma typ av bedömning igen och jämför mot tidigare resultat för att hålla processen konsekvent och undvika att en ny modell “får bättre” bara för att den är mer aggressiv i sina kommentarer.
