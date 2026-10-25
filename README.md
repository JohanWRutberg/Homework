# Optimental Hemuppgifter

Webbapp för Optimental (Marcus Engström) med två delar:

- **Hemuppgifter för patienter**: KBT-mallar som digitala formulär. Varje fält har knappen _”Vad menas här?”_ med en förklaring på enkel svenska, ett ifyllt exempel per mall och valfri AI-hjälp. Patienten laddar ner en PDF och tar med den till nästa besök.
- **Rättningsmallar för behandlare** (`/behandlare`): RAADS-14, GAD-7, MADRS-S och OCI-R. Behandlaren klickar i svaren och får totalpoäng, delskalor, tolkning och färdig journaltext att kopiera.

**Grundprincip: vi sparar ingenting.** Inga konton, ingen databas, inga kakor och ingen analys. Allt som fylls i lever i webbläsaren. PDF:en och journaltexten skapas på klienten.

## Kom igång

```bash
npm install
cp .env.example .env.local   # valfritt – lägg in ANTHROPIC_API_KEY för AI-hjälpen
npm run dev                  # http://localhost:3000
```

| Kommando         | Gör                                          |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Utvecklingsserver                            |
| `npm run build`  | Produktionsbygge                             |
| `npm test`       | Enhetstester (skattningar, mallar, AI-skydd) |
| `npm run check`  | Lint + typer + tester                        |
| `npm run format` | Prettier                                     |

CI (`.github/workflows/ci.yml`) kör lint, format, typer, tester och bygge på varje push och PR.

## Teknik

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript (strict), Zod, `@react-pdf/renderer` (PDF i webbläsaren) och `@anthropic-ai/sdk` (Claude Opus 5.5). Stilen bygger på optimental.vercel.app: samma orange, svart och logga, med Fraunces-serif i rubrikerna, en varm pappersbakgrund och pratbubblan från loggan som motiv för hjälpen.

```
src/
├─ app/
│  ├─ hemuppgifter/[slug]   Formulär per mall (statiskt genererade)
│  ├─ behandlare/[slug]     Rättningsmall per skattning
│  ├─ api/hjalp             AI-hjälpen (enda serverlogiken)
│  └─ integritet            Integritetstext
├─ lib/
│  ├─ templates/            Hemuppgiftsmallar som data (en fil per mall)
│  ├─ scales/               Skattningar: poäng, tolkning, journaltext (+ tester)
│  ├─ ai/                   Systemprompt, krisscreening, rate limit, schema
│  └─ pdf/                  PDF-layout och nedladdning
└─ proxy.ts                 Ger 404 för okända mallar/skattningar
```

## Lägga till innehåll

**Ny hemuppgift:** skapa `src/lib/templates/<namn>.ts` efter samma mönster som `tankedagbok.ts` och lägg till den i `src/lib/templates/index.ts`. Sidan, biblioteket, länken på behandlarsidan och PDF:en kommer med automatiskt. Varje fält behöver en `help`-text, och mallen ska ha ett `example` och en `aiContext` (behandlarens instruktion till AI:n). Testerna kontrollerar att exemplet matchar fälten.

**Ny skattning:** skapa `src/lib/scales/<namn>.ts` med items, svarsalternativ och en `compute()` som returnerar poäng, tolkning och journaltext. Lägg sedan till den i `src/lib/scales/index.ts` och skriv tester för gränsvärdena i `scales.test.ts`.

## AI-hjälpen

- **Testläge utan kostnad:** i `npm run dev` utan nyckel körs AI-hjälpen i testläge med förskrivna svar som bygger på mallens egna texter. Skriv `#kris` eller `#fel` i en fråga för att prova kris- och felflödet. `AI_MODEL=mock` aktiverar testläget även i ett produktionsbygge.
- **Riktiga modeller:** sätt `ANTHROPIC_API_KEY` och välj modell med `AI_MODEL` (`claude-haiku-5-5`, `claude-sonnet-5-5` eller `claude-opus-5-5`; standard är Sonnet 5.5). Ett felstavat modellnamn stoppar bygget med ett tydligt fel.
- **Jämföra modeller:** i `npm run dev`, eller med `AI_MODEL_SWITCHER=1` i en preview-miljö, finns en modellväljare i chatten, och varje svar märks med vilken modell som svarade. Servern godtar bara modeller från väljaren, så en klient kan aldrig välja en dyrare modell i skarp drift.
- **Kostnadsuppföljning:** varje anrop loggar modell och antal tokens in och ut, aldrig innehåll.
- Inställningarna läses **vid bygget** för de statiska sidorna. Bygg om (Vercel: _Redeploy_) när du ändrar dem.
- ”Vad menas här?” visar först behandlarens egen förklaring, utan AI. AI:n används bara när patienten själv ställer en fråga.
- **Patientens ifyllda svar skickas aldrig.** Systemprompten byggs enbart av mallens text. Det enda som går till Anthropic är patientens fråga, plus vilken mall och vilket fält det gäller.
- Kristriage sker i två steg. En ordlistescreening körs i webbläsaren och på servern innan något skickas, och modellen är dessutom instruerad att svara `[KRIS]`. I båda fallen visas 112, Mind Självmordslinjen 90101 och 1177 i stället för ett svar.
- Skydd: zod-validering, max 600 tecken per fråga och max 10 meddelanden, same-origin-kontroll, rate limit (20 frågor per 10 min och klient) och `max_tokens`-tak. Sonnet och Opus har dessutom server-side fallback vid nekat svar; Haiku 5.5 saknar det stödet. Innehåll loggas aldrig.
- Alla modeller körs med `effort: "low"`, vilket ger snabba och korta svar.

## Driftsättning (Vercel)

1. Importera repot i Vercel. Region: välj **Stockholm (arn1)** eller Frankfurt (fra1) under _Settings → Functions_.
2. Miljövariabler: `ANTHROPIC_API_KEY` (valfri), `AI_MODEL` (valfri, se ovan) och `NEXT_PUBLIC_SITE_URL` (den publika adressen). Sätt `AI_MODEL_SWITCHER=1` bara för _Preview_-miljön.
3. **Rekommenderat:** lägg en rate limit-regel i _Vercel Firewall_ för `/api/hjalp`, till exempel 30 anrop per minut och IP. Rate limiten i koden gäller per serverinstans.
4. Sätt en månadsbudget och en larmgräns i Anthropic Console.

## Säkerhet och dataskydd – checklista

- [x] Inga patientdata lagras. Ingen databas, inga kakor, ingen analys.
- [x] Strikta säkerhetsheaders: CSP, HSTS, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer` och Permissions-Policy.
- [x] Behandlarsidorna indexeras inte (`noindex` och `robots.txt`).
- [ ] **Teckna Anthropics kommersiella villkor/DPA** innan AI-hjälpen slås på skarpt, och be om _Zero Data Retention_ för organisationen. Anthropic tränar inte på API-data, men frågorna kan innehålla hälsorelaterad information.
- [ ] Låt Marcus granska alla `help`-texter, exempel och `aiContext`. De är skrivna som ett utkast och ska godkännas kliniskt.
- [ ] Bekräfta att formulärtexter och item-beskrivningar för skattningarna får användas. Appen visar korta egna sammanfattningar av items, inte de fullständiga frågetexterna.

## Rättningar jämfört med Excel-mallen

Journaltexterna följer Marcus formler ordagrant, med de här rättningarna:

1. **RAADS-14:** formeln jämförde cellen med texten ”Totalpoäng” (`B20`) i stället för poängen (`C20`). I Google Sheets är text alltid ”större” än tal, så mallen skrev **alltid** ”över cut-off” oavsett poäng. Det är rättat och testat (13 p ger under, 14 p ger över).
2. **MADRS-S:** delpoängen lästes från `B2:B10`, det vill säga fråga 2–9 plus totalen, i stället för fråga 1–9. Texten blev också ”…depressiva symtom symtom” vid låga poäng.
3. **GAD-7 och OCI-R:** tolkningen fick stor bokstav mitt i meningen (”motsvarande Minimal ångest”).
4. **MADRS-S, livslust:** grenen ”avsaknad av livslust” (> 6) kan aldrig nås, eftersom itemet går 0–6. Den är oförändrad men bör ses över av Marcus.
