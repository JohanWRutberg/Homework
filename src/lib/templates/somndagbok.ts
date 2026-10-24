import type { HomeworkTemplate } from "./types";

export const somndagbok: HomeworkTemplate = {
  slug: "somndagbok",
  title: "Sömndagbok",
  category: "Sömn och vardag",
  summary: "Kartlägg dina sovvanor natt för natt – grunden för all sömnbehandling.",
  intro:
    "Det är svårt att minnas hur man sovit över flera veckor. En sömndagbok ger dig och din behandlare en tydlig bild av dina sovvanor, och gör det möjligt att se vad som påverkar sömnen.",
  howTo: [
    "Fyll i varje morgon, helst inom en timme efter att du stigit upp.",
    "Uppskatta tiderna – titta inte på klockan under natten, det kan störa sömnen.",
    "Fyll i även nätter som gått bra.",
  ],
  minutes: "2 min per morgon",
  sections: [
    {
      id: "natter",
      title: "Natt",
      repeatable: { itemLabel: "Natt", addLabel: "Lägg till natt", min: 1, max: 28 },
      fields: [
        {
          id: "datum",
          type: "date",
          label: "Datum (morgonen)",
          help: "Datumet för morgonen då du fyller i.",
        },
        {
          id: "i_sang",
          type: "time",
          label: "Gick i säng",
          help: "När du lade dig i sängen, även om du läste eller tittade på mobilen en stund.",
        },
        {
          id: "slackte",
          type: "time",
          label: "Släckte för att sova",
          help: "När du släckte och försökte somna.",
        },
        {
          id: "insomning",
          type: "number",
          min: 0,
          max: 600,
          unit: "min",
          label: "Tid att somna",
          help: "Ungefär hur många minuter det tog från att du släckte tills du somnade. En uppskattning räcker.",
        },
        {
          id: "uppvaknanden",
          type: "number",
          min: 0,
          max: 30,
          label: "Antal uppvaknanden",
          help: "Hur många gånger du vaknade under natten som du minns.",
        },
        {
          id: "vaken_tid",
          type: "number",
          min: 0,
          max: 600,
          unit: "min",
          label: "Vaken tid under natten",
          help: "Ungefär hur många minuter du sammanlagt var vaken mellan att du somnat och din sista uppvakning.",
        },
        {
          id: "vaknade",
          type: "time",
          label: "Vaknade sista gången",
          help: "När du vaknade för sista gången, innan du steg upp.",
        },
        {
          id: "steg_upp",
          type: "time",
          label: "Steg upp",
          help: "När du faktiskt klev upp ur sängen för dagen.",
        },
        {
          id: "kvalitet",
          type: "scale",
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Mycket dålig",
          maxLabel: "Mycket bra",
          label: "Sömnkvalitet",
          help: "Hur bra tycker du att du sov totalt sett? 1 = mycket dåligt, 5 = mycket bra.",
        },
        {
          id: "kommentar",
          type: "text",
          label: "Övrigt",
          help: "Sådant som kan ha påverkat sömnen: tupplur, kaffe efter kl. 15, alkohol, träning sent, sömnmedel, stress.",
          placeholder: "T.ex. kaffe kl. 16, tupplur 20 min",
        },
      ],
    },
  ],
  example: {
    natter: [
      {
        datum: "2026-10-15",
        i_sang: "22:30",
        slackte: "23:15",
        insomning: "45",
        uppvaknanden: "2",
        vaken_tid: "40",
        vaknade: "05:50",
        steg_upp: "07:00",
        kvalitet: "2",
        kommentar: "Kaffe kl. 16. Låg och tänkte på jobbet.",
      },
    ],
  },
  aiContext:
    "Detta är en sömndagbok (KBT för insomni, KBT-I). Patienten registrerar tider och skattningar varje morgon. Vanliga svårigheter: skillnaden mellan att gå i säng och att släcka, skillnaden mellan sista uppvaknande och att stiga upp, att man ska uppskatta och inte klockkolla. Ge inga råd om sömnmedel eller medicinering.",
};
