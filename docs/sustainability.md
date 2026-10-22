## Etikfall: Chatta med Kraftly

**Situationen.**

Kraftly vill införa en AI-support i kundportalen. Kundens timförbrukning och fakturor skickas till en extern modell-API för att förklara fakturan. Produktägaren vill att teamet börjar utveckla funktionen i nästa sprint, trots att avtalet med leverantören inte är helt klart.

**Vårt beslut.**

Ja med villkor – vi kan stödja en AI-support, men vi börjar inte skicka kunddata till den externa tjänsten innan dataskyddet och villkoren har granskats.

**Varför.**

Timförbrukningen samlades in för fakturering och kan avslöja kundens vardagsmönster. Vi behöver följa principerna om ändamålsbegränsning och dataminimering. Kunden ska förstå vilka uppgifter som skickas till den externa leverantören och varför.

**Vad vi gör i stället / villkor.**

Vi skickar bara de uppgifter som behövs för att förklara fakturan, till exempel sammanställd förbrukning och fakturabelopp. Innan lansering ska ansvariga granska leverantörens villkor, behandlingsland, lagring och eventuell modellträning. Vi begränsar åtkomsten till loggar och bestämmer hur länge de sparas. Kunden ska informeras och kunna välja bort AI-supporten utan att förlora tillgången till vanlig kundservice. AI-svaren ska bygga på verifierbara fakturauppgifter och kunna hänvisa kunden till kundtjänst när svaret är osäkert.
