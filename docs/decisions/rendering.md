# Beslut: Hur ska Kraftlys portal renderas?

### **Datum:** 2026-10-12

### **Beslut:** Vi behåller SPA (Vue + Vite) och serverar det färdiga bygget statiskt via nginx. Vi inför varken SSR (Nuxt) eller SSG nu.

## Bakgrund

Kraftlys "Mina sidor" är en kundportal där kunden loggar in och ser sin elförbrukning. I dag är den en SPA: webbläsaren hämtar en tom HTML-sida plus JavaScript, och JavaScriptet bygger sedan sidan och hämtar data från API:t.

I vecka 8 har vi mätt och optimerat portalen för mobilkunder (iPhone 12 Pro, Fast 4G, cache av, median av tre). Våra optimeringar (hero-bilden som WebP, reserverad plats för diagrammet, lazy routes, Chart.js och lodash) gav:

| Mått                                | Före     | Efter   |
| ----------------------------------- | -------- | ------- |
| LCP (dashboard)                     | 9.1 s    | 0.58 s  |
| CLS (dashboard)                     | 0.03 s   | 0       |
| JavaScript, inloggningssidan (gzip) | 141.3 kB | 1.10 kB |

Frågan är om vi borde gå längre och byta renderingsmodell.

## Alternativ vi jämförde

|                                 | SPA (som i dag)                         | SSR (t.ex. Nuxt)                                            | SSG (statiskt)                                                 |
| ------------------------------- | --------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **Hur det fungerar**            | Webbläsaren bygger sidan med JavaScript | Servern bygger HTML för varje förfrågan                     | HTML byggs i förväg vid build                                  |
| **Första visningen**            | Väntar på JS innan något syns           | HTML finns direkt, snabbare första bild                     | HTML finns direkt, snabbast                                    |
| **Inloggad, personlig data**    | Fungerar naturligt, hämtas via API:t    | Fungerar, men servern måste hantera tokens och cookies      | Passar dåligt, datan är unik per kund och finns inte vid build |
| **Drift**                       | Bara statiska filer (nginx)             | Kräver en Node-server som körs hela tiden                   | Bara statiska filer                                            |
| **Kostnad och underhåll**       | Låg                                     | Högre (server, skalning, övervakning, fler säkerhetsrisker) | Låg                                                            |
| **Sökmotorer och delning**      | Svagare                                 | Starkt                                                      | Starkt                                                         |
| **Hur mycket måste skrivas om** | Inget                                   | Mycket (Nuxt, nytt flöde för inloggning)                    | Mycket för de sidor som är personliga                          |

## Våra tre frågor

**1. Ska sidan hittas eller delas?**
Nej. Portalen innehåller kundens egen förbrukning och är inte till för sökmotorer eller för att delas. Det är den vanligaste anledningen att välja SSR eller SSG, och den gäller inte här.

**2. Syns sidan innan man loggat in?**
Bara inloggningssidan syns, och den är ett enkelt formulär. Själva dashboarden kräver inloggning. Därför har SSR liten nytta för oss: det som är långsamt är den personliga datan, och den måste ändå hämtas från API:t efter inloggning.

**3. Är vi beredda att drifta en server?**
Inte i nuläget. I dag räcker en nginx-container med statiska filer, och staging körs enkelt på Render. SSR skulle kräva en Node-server med uppsikt och skalning, och dessutom ändra hur vi hanterar refresh token i httpOnly-cookie. Det vore en stor säkerhets- och driftsförändring för en liten vinst.

## Motivering

Våra optimeringar tog dashboarden under Googles gränser (LCP under 2,5 s och CLS under 0,1) utan att byta modell. Det långsamma hos oss var bilden, jumpen och JavaScriptet, inte själva SPA-modellen. Eftersom portalen är inloggad, personlig och inte ska hittas av sökmotorer är det som SSR ger oss litet, medan kostnaden i drift och komplexitet är stor. SSG passar de sidor som är likadana för alla, men våra viktiga sidor är personliga.

## Konsekvenser

- Vi har kvar enkel drift: statiska filer bakom nginx, som idag.
- Första visningen på riktigt långsamma mobiler kommer alltid att vara något långsammare än med SSR. Vi bevakar det med budgeten i CI (Lighthouse) så att vi märker om det försämras.
- Vi är tydliga med att vår budget mäter inloggningssidan i CI, medan dashboarden mäts för hand.

**Så här ompröver vi beslutet:**

- Om Kraftly vill ha publika sidor som ska hittas via Google (till exempel prisinformation eller en blogg). Då passar SSG eller SSR för de sidorna.
- Om LCP på dashboarden går över budgeten trots fler optimeringar.
- Om teamet får kapacitet och behov att drifta en server.
