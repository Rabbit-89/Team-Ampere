# Tillgänglighet

_Mål: WCAG 2.2 nivå AA. Kontrollerat med axe i komponenttesterna, Storybooks Accessibility-flik
och en genomgång med tangentbordet. Storybook och axe körs lokalt (i pipelinen: M9)._

## Komponentbiblioteket

| Komponent | Ersätter                 | API                                                                       |
| --------- | ------------------------ | ------------------------------------------------------------------------- |
| `KButton` | BaseButton, AppButton, … | `variant`: primary · secondary · text, `type`, `block`, texten är en slot |

    npm run storybook    # komponenterna med stories, fliken Accessibility
    npm run test:a11y    # axe-testerna (filerna *.a11y.test.js)

## Vad vi åtgärdade

| Brist                                                                                                       | Var                                                                        | Hittades med                                                             | Åtgärd (PR)                                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Gamla och otillgängliga knappar                                                                             | App.vue, DashboardView, InvoicesView, LoginView, MoveFormView, ProfileView | Inventering med grep                                                     | Ersatta med KButton eller riktiga knappar/länkar; gamla knappkomponenter borttagna                                  |
| Fält med bara placeholder (E-postadress, Lösenord)                                                          | LoginView                                                                  | kodläsning och getByLabelText – **inte** axe (axe godkänner placeholder) | Verifierade kopplingen `<label for>`/`id`; axe- och `getByLabelText`-test (#84)                                     |
| Fält utan label och utan placeholder (Namn, E-postadress, Adress)                                           | ProfileView                                                                | kodläsning (axe-regeln `label` fäller dessa)                             | Kopplade varje fält till en synlig `<label for>` med matchande `id` (#84)                                           |
| Fält med bara placeholder (Ny adress, Postnummer, Ort, Inflyttningsdatum) och `<select>` utan label (Avtal) | MoveFormView                                                               | kodläsning                                                               | Kopplade varje fält och `<select>` till en synlig `<label for>` med matchande `id` (#84)                            |
| E2E-test hittade fälten via `getByPlaceholder`                                                              | e2e/*.spec.js (4 filer)                                                    | kodläsning (`grep`)                                                      | Ersatte `getByPlaceholder` med `getByLabel` (#84)                                                                   |     | Fokusmarkering saknades eller var borttagen | `src/assets/styles.css` | Manuell tangentbordstestning | Lade till tydlig fokusmarkering med `:focus-visible` |
| Fel språk angivet för sidan                                                                                 | `index.html`                                                               | Kodgranskning                                                            | Ändrade `lang="en"` till `lang="sv"`                                                                                |
| Generisk sidtitel                                                                                           | `index.html`                                                               | Kodgranskning                                                            | Ändrade sidtiteln från `Vite App` till `Kraftly`                                                                    |
| Logotyp saknade alternativtext                                                                              | `src/App.vue`                                                              | Kodgranskning                                                            | Lade till `alt="Kraftly"`                                                                                           |
| För låg kontrast på hjälpt text                                                                             | `src/assets/styles.css`                                                    | Kontrastkontroll                                                         | Ändrade `.hint` från `#b8c0cf` till `#596579`; kontrasten mot vit bakgrund förbättrades från cirka 1,9:1 till 5,8:1 |
| Tabellrubriker saknade uttrycklig kolumnkoppling                                                            | `src/views/InvoicesView.vue`                                               | Kodgranskning                                                            | Lade till `thead`, `tbody` och `scope="col"` på tabellrubrikerna                                                    |

## Tangentbordsgenomgång

| Vy             | Vad vi testade             | Före                                             | Efter                                 |
| -------------- | -------------------------- | ------------------------------------------------ | ------------------------------------- |
| Översikt       | Nå Fler spartips           | nås inte (div)                                   | ✅ nås, Enter och mellanslag fungerar |
| Login          | Logga in                   | Fokus med Tab, Enter och mellanslag              | Fungerar                              |
| Mina uppgifter | Spara ändringar, Återställ | Fokus med Tab och aktivering                     | Fungerar                              |
| Flyttanmälan   | Skicka flyttanmälan        | Fokus med Tab och formulärskick                  | Fungerar                              |
| Översikt       | Fler spartips              | Fokus med Tab, Enter och mellanslag; alert visas | Fungerar                              |
| Fakturor       | Ladda ner                  | Fokus med Tab och aktivering                     | Fungerar                              |
| Navigation     | Logga ut                   | Fokus med Tab och aktivering                     | Fungerar                              |

## Vad axe inte hittar

Axe kan inte verifiera all funktionalitet med tangentbordet eller om användarflöden fungerar korrekt. Därför kompletteras automatiska tester med manuell tangentbordstestning.

## Kända brister

Skärmläsare har inte testats manuellt. De automatiserade tillgänglighetstesterna med axe ersätter inte manuella tester med skärmläsare.

Vid 200 % zoom kan knapparna hittas genom att scrolla eller flytta vyn. Ingen text klipptes av vid testningen. Det behöver fortfarande säkerställas att alla relevanta funktioner är tillgängliga och användbara vid denna zoomnivå.
