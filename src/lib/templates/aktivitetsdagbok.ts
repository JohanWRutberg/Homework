import { tenScale } from "./fields";
import type { HomeworkTemplate } from "./types";

export const aktivitetsdagbok: HomeworkTemplate = {
  slug: "aktivitetsdagbok",
  title: "Aktivitetsdagbok",
  category: "Beteende",
  summary: "Se sambandet mellan vad du gör och hur du mår – grunden i beteendeaktivering.",
  intro:
    "När vi mår dåligt gör vi ofta mindre av det som brukar ge energi och glädje, vilket i sin tur gör att vi mår sämre. Genom att registrera vad du gör och hur du mår kan du hitta aktiviteter som hjälper dig – och planera in mer av dem.",
  howTo: [
    "Skriv in aktiviteter under dagen, gärna i samband med att de händer.",
    "Ta med även vardagliga saker – att duscha, laga mat eller ringa någon räknas.",
    "Skatta hur du mådde, hur mycket glädje och hur stark känsla av att ha klarat något aktiviteten gav.",
  ],
  minutes: "2 min per aktivitet",
  sections: [
    {
      id: "aktiviteter",
      title: "Aktivitet",
      repeatable: { itemLabel: "Aktivitet", addLabel: "Lägg till aktivitet", min: 1, max: 40 },
      fields: [
        { id: "datum", type: "date", label: "Datum", help: "Vilken dag aktiviteten gjordes." },
        {
          id: "tid",
          type: "time",
          label: "Ungefärlig tid",
          help: "Ungefär när på dagen. Det behöver inte vara exakt.",
        },
        {
          id: "aktivitet",
          type: "text",
          label: "Vad gjorde du?",
          help: "Skriv kort vad du gjorde. Även vila, att ligga i sängen eller att titta på mobilen räknas som aktiviteter.",
          placeholder: "T.ex. promenad med hunden",
        },
        tenScale(
          "maende",
          "Mående",
          "Hur mådde du under aktiviteten? 0 = mycket dåligt, 10 = mycket bra.",
          "Mycket dåligt",
          "Mycket bra"
        ),
        tenScale(
          "gladje",
          "Glädje",
          "Hur mycket glädje, njutning eller välbehag gav aktiviteten? 0 = ingen alls, 10 = väldigt mycket.",
          "Ingen",
          "Väldigt mycket"
        ),
        tenScale(
          "bemastring",
          "Känsla av att klara något",
          "Hur mycket kändes det som att du åstadkom något? Att diska när man är trött kan ge hög poäng här, även om det inte är roligt.",
          "Ingen",
          "Väldigt mycket"
        ),
      ],
    },
  ],
  example: {
    aktiviteter: [
      {
        datum: "2026-10-14",
        tid: "08:30",
        aktivitet: "Låg kvar i sängen och scrollade",
        maende: "3",
        gladje: "1",
        bemastring: "0",
      },
      {
        datum: "2026-10-14",
        tid: "10:00",
        aktivitet: "Promenad runt sjön",
        maende: "6",
        gladje: "5",
        bemastring: "6",
      },
      {
        datum: "2026-10-14",
        tid: "17:30",
        aktivitet: "Lagade middag och ringde mamma",
        maende: "6",
        gladje: "6",
        bemastring: "5",
      },
    ],
  },
  aiContext:
    "Detta är en aktivitetsdagbok för beteendeaktivering (KBT vid nedstämdhet/depression). Patienten registrerar aktiviteter och skattar mående, glädje (njutning) och bemästring 0–10. Vanliga svårigheter: tror att bara ”meningsfulla” aktiviteter ska skrivas upp, blandar ihop glädje och bemästring.",
};
