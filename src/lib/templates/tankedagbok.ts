import { percentScale } from "./fields";
import type { HomeworkTemplate } from "./types";

export const tankedagbok: HomeworkTemplate = {
  slug: "tankedagbok",
  title: "Tankedagbok",
  category: "Tankar och känslor",
  summary: "Fånga automatiska tankar och pröva om det finns andra sätt att se på situationen.",
  intro:
    "Våra tankar påverkar hur vi mår. Ofta dyker tankar upp så snabbt att vi inte ens märker dem – de kallas automatiska tankar. Genom att skriva ner dem kan du börja se mönster och pröva om tanken verkligen stämmer.",
  howTo: [
    "Fyll i så snart som möjligt efter att du märkt att ditt mående förändrades.",
    "Börja med situationen och känslan – tanken är ofta lättast att hitta efteråt.",
    "Det finns inga rätt eller fel svar. Skriv med dina egna ord.",
    "Det räcker gott med en eller två situationer per dag.",
  ],
  minutes: "5–10 min per situation",
  sections: [
    {
      id: "situationer",
      title: "Situation",
      repeatable: { itemLabel: "Situation", addLabel: "Lägg till situation", min: 1, max: 10 },
      fields: [
        {
          id: "situation",
          type: "textarea",
          label: "Vad hände?",
          help: "Beskriv kort var du var, vad du gjorde och vem du var med när du märkte att du började må annorlunda. Skriv som en kamera hade sett det – bara fakta, inte vad du tyckte om det.",
          placeholder: "T.ex. satt vid köksbordet och läste ett sms från min chef …",
        },
        {
          id: "kansla",
          type: "text",
          label: "Vilken känsla fick du?",
          help: "En känsla brukar gå att säga med ett ord: ledsen, arg, rädd, orolig, skamsen, nedstämd, irriterad. Om du skriver en hel mening är det ofta en tanke istället.",
          placeholder: "T.ex. orolig",
        },
        percentScale(
          "kansla_styrka",
          "Hur stark var känslan?",
          "Hur starkt kändes det, från 0 (inte alls) till 100 (det starkaste du kan tänka dig). Det finns inget rätt svar – gissa hellre än att hoppa över."
        ),
        {
          id: "tanke",
          type: "textarea",
          label: "Automatisk tanke",
          help: "En automatisk tanke är det som snabbt for genom huvudet i situationen – ofta utan att du valde att tänka den. Fråga dig: ”Vad sa jag till mig själv just då?” eller ”Vad var jag rädd skulle hända?”.",
          placeholder: "T.ex. ”Hon är missnöjd med mig, jag kommer att få sparken.”",
        },
        percentScale(
          "tanke_trovardighet",
          "Hur mycket trodde du på tanken?",
          "Hur sann kändes tanken i stunden, från 0 (inte alls sann) till 100 (helt säkert sann)?"
        ),
        {
          id: "for",
          type: "textarea",
          label: "Vad talar för att tanken stämmer?",
          help: "Skriv sådant som faktiskt hänt eller som du vet säkert – inte bara känslor. ”Det känns så” räknas inte som bevis här.",
        },
        {
          id: "emot",
          type: "textarea",
          label: "Vad talar emot att tanken stämmer?",
          help: "Finns det något som inte passar med tanken? Har det varit på ett annat sätt tidigare? Vad skulle en god vän säga om du berättade det här?",
        },
        {
          id: "alternativ",
          type: "textarea",
          label: "Ett annat sätt att se på det",
          help: "Försök formulera en tanke som tar hänsyn till både det som talar för och emot. Den behöver inte vara positiv – bara mer balanserad och realistisk.",
        },
        percentScale(
          "kansla_efter",
          "Hur stark är känslan nu?",
          "Skatta samma känsla som tidigare igen, 0–100. Det är helt vanligt att den bara sjunker lite – det är också ett resultat."
        ),
      ],
    },
  ],
  example: {
    situationer: [
      {
        situation:
          "Tisdag kväll, satt i soffan. Fick ett sms från min chef: ”Kan vi ses en stund i morgon bitti?”",
        kansla: "Orolig",
        kansla_styrka: "80",
        tanke: "Jag har gjort något fel och kommer att få sparken.",
        tanke_trovardighet: "70",
        for: "Hon skrev inte vad det gällde. Jag missade en deadline för två veckor sedan.",
        emot: "Hon sa förra veckan att projektet gick bra. Hon brukar boka möten på det här sättet med alla. Jag har aldrig fått klagomål på mitt jobb.",
        alternativ:
          "Mötet kan handla om många saker, till exempel planering. Även om det gäller deadlinen är det något vi kan prata om.",
        kansla_efter: "45",
      },
    ],
  },
  aiContext:
    "Detta är en kognitiv tankedagbok (KBT). Patienten tränar på att skilja på situation, känsla och tanke och på att pröva automatiska tankar. Vanliga svårigheter: blandar ihop känslor och tankar, skriver tolkningar i situationsfältet, tror att den alternativa tanken måste vara positiv.",
};
