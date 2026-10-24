import { sum, sumItems } from "./scoring";
import type { ScaleDefinition } from "./types";

const MENTALIZING = "Mentaliseringssvårigheter";
const SOCIAL_ANXIETY = "Social ångest";
const SENSORY = "Sensorisk reaktivitet";

const MENTALIZING_ITEMS = [1, 4, 9, 11, 12, 13, 14];
const SOCIAL_ANXIETY_ITEMS = [3, 5, 6, 8];
const SENSORY_ITEMS = [2, 7, 10];

export const CUT_OFF = 14;

export const raads14: ScaleDefinition = {
  slug: "raads-14",
  name: "RAADS-14",
  fullName: "RAADS-14 Screen",
  purpose: "Screening för autismspektrumdrag hos vuxna",
  description:
    "Förkortad version av Ritvo Autism and Asperger Diagnostic Scale-Revised. Markera det svarsalternativ patienten kryssat för varje fråga – fråga 6 vänds automatiskt.",
  reference:
    "Eriksson JM, Andersen LM, Bejerot S. RAADS-14 Screen: Validity of a screening tool for Autism Spectrum Disorder in an adult psychiatric population. Molecular Autism 2013;4:49.",
  options: [
    { label: "Stämmer nu och när jag var ung", short: "Nu och som ung", value: 3 },
    { label: "Stämmer bara nu", short: "Bara nu", value: 2 },
    { label: "Stämmer bara på hur jag var före 16 års ålder", short: "Bara före 16", value: 1 },
    { label: "Aldrig stämt", short: "Aldrig", value: 0 },
  ],
  items: [
    { n: 1, label: "Svårt att förstå hur andra känner i samtal", subscale: MENTALIZING },
    { n: 2, label: "Vissa material känns mycket obehagliga mot huden", subscale: SENSORY },
    { n: 3, label: "Svårt att klara grupparbeten och fungera i grupp", subscale: SOCIAL_ANXIETY },
    { n: 4, label: "Svårt att föreställa sig vad andra förväntar sig", subscale: MENTALIZING },
    { n: 5, label: "Vet ofta inte hur man ska bete sig socialt", subscale: SOCIAL_ANXIETY },
    { n: 6, label: "Bra på att småprata och kallprata", subscale: SOCIAL_ANXIETY, reversed: true },
    { n: 7, label: "Behöver vara för sig själv vid överväldigande intryck", subscale: SENSORY },
    { n: 8, label: "Hur man skaffar vänner och umgås är obegripligt", subscale: SOCIAL_ANXIETY },
    {
      n: 9,
      label: "Svårt att veta när det är ens tur att tala eller lyssna",
      subscale: MENTALIZING,
    },
    { n: 10, label: "Håller för öronen för att stänga ute obehagliga ljud", subscale: SENSORY },
    {
      n: 11,
      label: "Svårt att avläsa ansiktsuttryck, gester och kroppsspråk",
      subscale: MENTALIZING,
    },
    { n: 12, label: "Fokuserar mer på detaljerna än på helheten", subscale: MENTALIZING },
    { n: 13, label: "Uppfattar saker bokstavligt och missförstår ofta", subscale: MENTALIZING },
    {
      n: 14,
      label: "Blir mycket upprörd när invanda sätt plötsligt ändras",
      subscale: MENTALIZING,
    },
  ],
  maxTotal: 42,
  norms: [
    "Totalpoäng 0–42. Fråga 6 är omvänd.",
    `Cut-off ≥ ${CUT_OFF} talar för autismspektrumdrag och motiverar vidare utredning.`,
  ],
  compute(scores) {
    const mentalizing = sumItems(scores, MENTALIZING_ITEMS);
    const socialAnxiety = sumItems(scores, SOCIAL_ANXIETY_ITEMS);
    const sensory = sumItems(scores, SENSORY_ITEMS);
    const total = sum([mentalizing, socialAnxiety, sensory]);
    const aboveCutOff = total >= CUT_OFF;

    const interpretation = aboveCutOff
      ? `Över cut-off (≥ ${CUT_OFF})`
      : `Under cut-off (${CUT_OFF} poäng)`;

    const journalText =
      `RAADS-14 genomfördes. Resultat: ${MENTALIZING} = ${mentalizing}, ${SOCIAL_ANXIETY} = ${socialAnxiety}, ${SENSORY} = ${sensory}. Totalpoäng = ${total}. ` +
      (aboveCutOff
        ? "Resultatet ligger över cut-off (≥14) och indikerar förekomst av autismspektrumdrag. Vidare utredning rekommenderas."
        : "Resultatet ligger under cut-off (14 poäng) och talar inte för tydliga autismspektrumdrag enligt detta instrument. Resultatet bör tolkas i relation till övrig anamnes och klinisk bedömning.");

    return {
      total,
      maxTotal: 42,
      subscales: [
        { name: MENTALIZING, score: mentalizing, max: MENTALIZING_ITEMS.length * 3 },
        { name: SOCIAL_ANXIETY, score: socialAnxiety, max: SOCIAL_ANXIETY_ITEMS.length * 3 },
        { name: SENSORY, score: sensory, max: SENSORY_ITEMS.length * 3 },
      ],
      interpretation,
      severity: aboveCutOff ? "severe" : "none",
      journalText,
      flags: [],
    };
  },
};
