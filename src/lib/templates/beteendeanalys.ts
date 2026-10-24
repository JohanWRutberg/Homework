import type { HomeworkTemplate } from "./types";

export const beteendeanalys: HomeworkTemplate = {
  slug: "beteendeanalys",
  title: "Beteendeanalys (ABC)",
  category: "Beteende",
  summary: "Förstå vad som utlöser ett beteende och vad det leder till – på kort och lång sikt.",
  intro:
    "Allt vi gör har en funktion. Ofta ger ett beteende lättnad på kort sikt men gör saker svårare på lång sikt. Med en ABC-analys kartlägger du vad som händer före (A), vad du gör (B) och vad det leder till (C).",
  howTo: [
    "Välj ett beteende du vill förstå bättre, till exempel att skjuta upp saker, undvika eller äta när du är stressad.",
    "Fyll i en analys varje gång beteendet händer, gärna samma dag.",
    "Var nyfiken snarare än kritisk – målet är att förstå, inte att döma dig själv.",
  ],
  minutes: "5–10 min per tillfälle",
  sections: [
    {
      id: "analyser",
      title: "Tillfälle",
      repeatable: { itemLabel: "Tillfälle", addLabel: "Lägg till tillfälle", min: 1, max: 10 },
      fields: [
        {
          id: "a_situation",
          type: "textarea",
          label: "A – Vad hände precis innan?",
          help: "A står för det som kom före beteendet: var du var, vad som hände, vilken tid det var, vem du var med. Både yttre saker (ett sms, en tid på dygnet) och inre (trött, hungrig) räknas.",
          placeholder: "T.ex. klockan 21, ensam hemma, trött efter jobbet …",
        },
        {
          id: "tankar_kanslor",
          type: "textarea",
          label: "Tankar och känslor i stunden",
          help: "Vad tänkte och kände du precis innan du gjorde det du gjorde? Även kroppsliga känslor räknas, som oro i magen eller spänningar.",
        },
        {
          id: "b_beteende",
          type: "textarea",
          label: "B – Vad gjorde du?",
          help: "B står för beteende: det du konkret gjorde (eller lät bli att göra). Beskriv det så att någon annan skulle kunna se det på film.",
          placeholder:
            "T.ex. scrollade på mobilen i två timmar istället för att börja med rapporten",
        },
        {
          id: "c_kort",
          type: "textarea",
          label: "C – Vad hände direkt efteråt?",
          help: "C står för konsekvens. Vad hände de närmaste minuterna? Ofta blir det en lättnad eller något skönt – det är just därför beteendet är svårt att ändra.",
        },
        {
          id: "c_lang",
          type: "textarea",
          label: "C – Vad leder det till på längre sikt?",
          help: "Hur påverkas du dagen efter, eller om det fortsätter så här i månader? Tänk på mående, relationer, jobb eller det du tycker är viktigt i livet.",
        },
        {
          id: "alternativ",
          type: "textarea",
          label: "Vad skulle du kunna göra annorlunda nästa gång?",
          help: "Ett litet, konkret steg räcker. Vad skulle vara ett alternativt beteende i samma situation?",
        },
      ],
    },
  ],
  example: {
    analyser: [
      {
        a_situation: "Söndag kväll kl. 20. Skulle börja förbereda en presentation till måndag.",
        tankar_kanslor: "”Det här kommer bli dåligt ändå.” Klump i magen, rastlös och trött.",
        b_beteende: "Satte på en serie och tittade tre avsnitt. Öppnade aldrig datorn.",
        c_kort: "Slapp obehaget. Kändes skönt och avslappnat en stund.",
        c_lang:
          "Sov dåligt av stress. Presentationen blev ihopsnickrad på morgonen och jag kände mig ännu mer osäker. Tanken ”jag klarar inte sånt här” blev starkare.",
        alternativ:
          "Sätta en timer på 15 minuter och bara göra första bilden. Sedan får jag titta på serien.",
      },
    ],
  },
  aiContext:
    "Detta är en funktionell beteendeanalys (ABC/SORK) inom KBT. Patienten ska förstå sambandet mellan utlösande situation (A), beteende (B) och konsekvenser (C) på kort och lång sikt. Vanliga svårigheter: skriver känslor istället för beteende i B, missar att kortsiktiga konsekvenser ofta är positiva (förstärkning), blandar ihop A och C.",
};
