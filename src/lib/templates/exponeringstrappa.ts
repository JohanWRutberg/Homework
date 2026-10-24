import { percentScale } from "./fields";
import type { HomeworkTemplate } from "./types";

export const exponeringstrappa: HomeworkTemplate = {
  slug: "exponeringstrappa",
  title: "Exponeringstrappa",
  category: "Ångest och exponering",
  summary: "Bryt ner något du undviker i små steg och närma dig det i din egen takt.",
  intro:
    "När vi undviker det som känns obehagligt minskar ångesten för stunden, men rädslan växer på sikt. Exponering betyder att du gradvis och planerat närmar dig det du är rädd för. Kroppen och hjärnan lär sig då att ångesten går över av sig själv.",
  howTo: [
    "Börja med att beskriva ditt mål – vad vill du kunna göra?",
    "Skriv sedan steg från lättast till svårast. Det lättaste steget ska kännas utmanande men görbart.",
    "Öva på ett steg i taget och stanna kvar tills ångesten har börjat sjunka.",
    "Logga varje övningstillfälle längre ner.",
  ],
  minutes: "15 min att planera, sedan löpande",
  sections: [
    {
      id: "mal",
      title: "Mitt mål",
      fields: [
        {
          id: "mal",
          type: "textarea",
          label: "Vad vill du kunna göra?",
          help: "Beskriv målet så konkret som möjligt, så att du vet när du nått det. ”Må bättre” är svårt att mäta – ”åka buss till jobbet själv” är lättare.",
          placeholder: "T.ex. kunna handla i en full mataffär en lördag",
        },
        {
          id: "undvikanden",
          type: "textarea",
          label: "Vad brukar du göra för att slippa ångesten?",
          help: "Skriv sådant du gör för att undvika eller dämpa obehaget, även små saker – till exempel att ha med någon, hålla i mobilen eller gå när det är minst folk. De kallas säkerhetsbeteenden.",
        },
      ],
    },
    {
      id: "steg",
      title: "Steg",
      description: "Från lättast till svårast.",
      repeatable: { itemLabel: "Steg", addLabel: "Lägg till steg", min: 3, max: 12 },
      fields: [
        {
          id: "beskrivning",
          type: "text",
          label: "Beskrivning av steget",
          help: "Ett konkret moment du kan öva på. Gör gärna stegen små – det är bättre med många små steg än få stora.",
          placeholder: "T.ex. gå in i affären en vardagskväll och köpa en sak",
        },
        percentScale(
          "forvantad",
          "Förväntad ångest",
          "Hur mycket ångest tror du att steget skulle ge, från 0 (ingen alls) till 100 (värsta tänkbara)?",
          "Ingen",
          "Värsta tänkbara"
        ),
      ],
    },
    {
      id: "ovningar",
      title: "Övningslogg",
      description: "Fyll i efter varje övning.",
      repeatable: { itemLabel: "Övning", addLabel: "Logga övning", min: 1, max: 20 },
      fields: [
        {
          id: "datum",
          type: "date",
          label: "Datum",
          help: "Vilken dag du övade. Försök öva flera gånger i veckan – regelbundenhet gör stor skillnad.",
        },
        {
          id: "steg",
          type: "text",
          label: "Vilket steg övade du på?",
          help: "Skriv stegets nummer eller en kort beskrivning.",
        },
        percentScale(
          "angest_fore",
          "Ångest före",
          "Hur mycket ångest kände du precis innan du började, 0–100?",
          "Ingen",
          "Värsta tänkbara"
        ),
        percentScale(
          "angest_max",
          "Högsta ångest",
          "Den starkaste ångesten under övningen, 0–100.",
          "Ingen",
          "Värsta tänkbara"
        ),
        percentScale(
          "angest_efter",
          "Ångest i slutet",
          "Hur mycket ångest kände du när du avslutade övningen, 0–100?",
          "Ingen",
          "Värsta tänkbara"
        ),
        {
          id: "larde",
          type: "textarea",
          label: "Vad lärde du dig?",
          help: "Hände det du var rädd för? Gick ångesten ner av sig själv? Vad överraskade dig?",
        },
      ],
    },
  ],
  example: {
    mal: [
      {
        mal: "Kunna handla i en full mataffär en lördag förmiddag, ensam.",
        undvikanden:
          "Handlar bara sent på kvällen, tar med min sambo, har hörlurar i, går ut om det blir kö.",
      },
    ],
    steg: [
      { beskrivning: "Gå in i den lilla affären en vardagskväll och köpa en sak", forvantad: "20" },
      { beskrivning: "Handla för en hel vecka en vardagskväll, utan hörlurar", forvantad: "40" },
      { beskrivning: "Handla en vardag kl. 17 när det är mer folk", forvantad: "60" },
      { beskrivning: "Handla lördag förmiddag med sambo som väntar utanför", forvantad: "75" },
      { beskrivning: "Handla lördag förmiddag helt själv och ställa mig i kö", forvantad: "90" },
    ],
    ovningar: [
      {
        datum: "2026-10-12",
        steg: "Steg 1",
        angest_fore: "40",
        angest_max: "50",
        angest_efter: "15",
        larde:
          "Det var jobbigast precis vid dörren. Efter några minuter tänkte jag nästan inte på det.",
      },
    ],
  },
  aiContext:
    "Detta är en exponeringstrappa (gradvis exponering inom KBT för ångest och undvikande). Patienten ska formulera ett konkret mål, identifiera säkerhetsbeteenden, bygga en trappa av steg från lätt till svårt med skattad förväntad ångest (0–100) och logga övningar. Uppmuntra små, konkreta steg. Ge aldrig råd om att exponera sig för verkligt farliga situationer, och föreslå inte specifika steg åt patienten – hjälp dem att komma fram till sina egna.",
};
