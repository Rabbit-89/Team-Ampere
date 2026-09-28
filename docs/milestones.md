# M3

[x] Multi-stage Dockerfile i repots rot: byggsteg med Node, serveringssteg med nginx. Ingen Node och ingen node_modules i den färdiga imagen

[x] .dockerignore med minst node_modules, dist och .git

[x] nginx.conf med SPA-fallback – omladdning på /fakturor ger appen, inte 404

[x] Imagen är under 100 MB – skärmdump av docker image ls i docs/containers.md. Har du två storlekskolumner gäller DISK USAGE, den första

[x] docker compose up --build från ett rent klon startar frontend (localhost:8080) och mock-API, och man kan logga in och se dashboarden

[x] docker build som eget jobb i CI (image), grönt på main, med imagens storlek i loggen

[x] docs/containers.md enligt mallen från workshopen: hur man kör, storlekstabell med uppmätta siffror (minst naiv vs. multi-stage), tre beslut (basimage · hur mock-API:t körs · hur browsern når API:t), vad som körs i CI, kända begränsningar

[x] README Getting started omskriven: ett sätt med Docker, ett utan – och npm start-felet borta (skulden från M0)

[x] Logg i docs/log.md: en post per arbetsdag, inklusive vem som gjorde vad. Ny tech lead presenterad i loggen

# M4

[x] Nyckeln ut ur koden: ingen API-nyckel i src/ och inga hemligheter i VITE_-variabler. Appen anropar /api relativt, och nginx lägger på X-Api-Key från miljön (nginx.conf.template)

[x] Den gamla nyckeln är död – och ni har bevisat det: curl mot test-API:t med nyckeln från api.js ger 401, och utskriften står i docs/deploy.md. Teamets nya nyckel finns bara i Render

[x] Lokalt fungerar som förut: .env.example i repot, .env i .gitignore och .dockerignore. Från en ren klon: cp .env.example .env + docker compose up --build → man kan logga in

[x] Bygg en gång: pipelinen bygger imagen en gång per commit och pushar den till GHCR taggad med commitens sha – bara från main, aldrig från en PR

[x] Automatisk deploy till staging: merge till main deployar till Render via deploy hook. Hooken ligger som secret i GitHub-miljön staging, adressen som variable. Ingen klickar i Render för att släppa en version

[x] Verifierad deploy: deploy-jobbet väntar tills /version.txt visar commitens sha och gör sedan ett röktest mot /api – jobbet blir rött om något av dem misslyckas

[x] Miljökonfig via variabler: API_URL och API_KEY sätts i Render, inte i imagen. Samma image kör lokalt i compose
docs/deploy.md enligt mallen från workshopen (flöde, miljöer, var varje variabel bor, nyckeln, rollback, uppmätta tider, kända begränsningar) + beslutsdokument docs/decisions/hosting.md med minst tre jämförda alternativ

[x] README med staging-adressen och Kom igång som börjar med cp .env.example .env · logg i docs/log.md, en post per arbetsdag, med vem som gjorde vad

# M5

- [x] **Produktion skild från staging:** en egen Render-tjänst på egen adress, APP_ENV=production, ingen miljöbanner. Samma image som staging: version.txt visar samma sha på båda efter en deploy

- [x] **Godkännande före prod:** GitHub-miljön production har required reviewers (hela teamet) och Prevent self-review. Jobbet deploy-production har needs: på staging-jobbet, deployar ghcr.io/…:<sha> via hook, väntar på /version.txt och gör ett röktest som blir rött om flaggan är på i prod

- [x] **Norge-stödet bakom en feature flag:** en synlig förändring på översikten, styrd av FEATURE_NORWAY som containern läser vid start. På i staging, av i prod. Två tester: flaggan och komponenten.

Bevis:

```
rwaqa@hpi7 MINGW64 ~/Desktop/Rabbiya repos/Team-Ampere (add/m5_milestones)
$ curl https://team-ampere-main.onrender.com/config.js
window.__KRAFTLY__ = {
  env: 'lokal',
  features: { norway: true }
}

rwaqa@hpi7 MINGW64 ~/Desktop/Rabbiya repos/Team-Ampere (add/m5_milestones)
$ curl https://kraftly-teamampere.onrender.com/config.js
window.__KRAFTLY__ = {
  env: 'production',
  features: { norway: false }
}
```

-[x] **Beslutsdokument docs/decisions/feature-flags.md:** minst tre alternativ (branch, byggtidsflagga, körtidsflagga), motivering, och när flaggan ska bort

-[x] **Cache-headers konfigurerade och verifierade:** /assets/ med public, max-age=31536000, immutable, index.html/config.js/version.txt med no-cache.

### Bevis:

## Före

![alt text](<Screenshot 2026-09-24 152336.png>)

## Efter

![alt text](<Screenshot 2026-09-24 155741.png>)

-[x] **Rollback genomförd i praktiken:** rollback.yml med val av miljö, körd mot staging.

### Bevis:

**länk till Actions-körningen:**
https://github.com/Rabbit-89/Team-Ampere/actions/runs/36407473030

**Tiden från start till ✅ https://team-ampere-main.onrender.com kör 28b22e1b71535d717c1cf77ff10c580b6d7ca385 igen :** 30s

-[x] **docs/scaling.md enligt mallen från workshopen:** era mätvärden (autocannon, tre anrop, req/s + p99, kommandot ni körde), vad de säger om flaskhalsen, vad ni gjorde,

- **Startsidan är det snabbast :** 8411 anrop/sekund, p99 är 18ms. Nginx visar statisk filen och nästan ingen jobb för servern.
- **JS-filen är lite långammare:** bara 887 anrop/sekund och p99 på 83ms. Kankse filen är stor (vi såg 347 MB/s i genomströmning).
- **/api/user har lägst genomströmning** (709 anrop/sekund). Node gör riktig jobb för varje anrop, till skillnad från nginx som bara skickar en fil.
- **Så flaskhalsen är :** API.et (Node)

- **INTE flaskhalsan :** nginx/startsidan - den klara mycket hög belastning utan problem.

varför (inte) Kubernetes, och regeln för flagga kontra rollback med tider. Granskas muntligt på avstämningen

-[x] **Adresserna:** prod-raden i miljötabellen i docs/deploy.md och prod-adressen i README.
