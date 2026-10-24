import { lowerFirst, sum, sumItems } from "./scoring";
import type { ScaleDefinition } from "./types";

export const CLINICAL_CUT_OFF = 21;

const SUBSCALES = [
  { name: "Tvätt", journalName: "tvätt", items: [5, 11, 17] },
  { name: "Kontroll", journalName: "kontroll", items: [2, 8, 14] },
  { name: "Ordning", journalName: "ordning", items: [3, 9, 15] },
  { name: "Samlande", journalName: "samlande", items: [1, 7, 13] },
  { name: "Tvångstankar", journalName: "tvångstankar", items: [6, 12, 18] },
  { name: "Neutralisering", journalName: "neutralisering", items: [4, 10, 16] },
] as const;

function subscaleOf(n: number): string {
  return SUBSCALES.find((s) => (s.items as readonly number[]).includes(n))!.name;
}

const ITEM_LABELS = [
  "Har samlat på sig så mycket saker att de är i vägen",
  "Kontrollerar saker oftare än nödvändigt",
  "Blir upprörd om saker inte är ordnade på rätt sätt",
  "Känner sig tvungen att räkna medan hen gör saker",
  "Svårt att röra vid saker som främlingar eller vissa personer rört",
  "Svårt att kontrollera sina egna tankar",
  "Samlar på saker som inte behövs",
  "Kontrollerar upprepade gånger dörrar, fönster, lådor m.m.",
  "Blir upprörd om andra ändrar hur saker är ordnade",
  "Känner att vissa siffror måste upprepas",
  "Måste tvätta sig för att hen känner sig smutsig eller förorenad",
  "Blir upprörd av obehagliga tankar som dyker upp mot ens vilja",
  "Undviker att slänga saker av rädsla att behöva dem senare",
  "Kontrollerar upprepade gånger gaskranar, vattenkranar och strömbrytare",
  "Behöver att saker är ordnade på ett speciellt sätt",
  "Känner att det finns goda och onda siffror",
  "Tvättar händerna oftare och längre än nödvändigt",
  "Får ofta obehagliga tankar och har svårt att bli av med dem",
];

export const ocir: ScaleDefinition = {
  slug: "oci-r",
  name: "OCI-R",
  fullName: "Obsessive-Compulsive Inventory – Revised",
  purpose: "Skattning av tvångssymtom senaste månaden",
  description:
    "Markera hur mycket patienten besvärats av respektive upplevelse den senaste månaden. Delskalorna räknas ut automatiskt.",
  reference:
    "Foa EB, Huppert JD, Leiberg S, et al. The Obsessive-Compulsive Inventory: development and validation of a short version. Psychol Assess 2002;14:485–496.",
  options: [
    { label: "Inte alls", value: 0 },
    { label: "Lite", value: 1 },
    { label: "Måttligt", value: 2 },
    { label: "Mycket", value: 3 },
    { label: "Extremt", value: 4 },
  ],
  items: ITEM_LABELS.map((label, i) => ({ n: i + 1, label, subscale: subscaleOf(i + 1) })),
  maxTotal: 72,
  norms: [
    "Totalpoäng 0–72, sex delskalor à 0–12.",
    `≥ ${CLINICAL_CUT_OFF} talar för kliniskt relevanta tvångssymtom.`,
  ],
  compute(scores) {
    const total = sum(scores);
    const subscales = SUBSCALES.map((s) => ({
      name: s.name,
      journalName: s.journalName,
      score: sumItems(scores, [...s.items]),
      max: 12,
    }));
    const below = total < CLINICAL_CUT_OFF;
    const interpretation = below
      ? "Under klinisk gräns"
      : "Över klinisk gräns (indikerar möjligen tvångssymtom)";

    const distribution = subscales.map((s) => `${s.journalName} ${s.score}`);
    const distributionText = `${distribution.slice(0, -1).join(", ")} samt ${distribution.at(-1)}`;

    const journalText =
      `Självskattning med OCI-R visar en totalpoäng på ${total} poäng (maxpoäng 72), vilket ligger ${lowerFirst(interpretation)}. ` +
      `Resultatet indikerar ${below ? "inga tydliga kliniskt signifikanta tvångssymtom" : "möjligen förekomst av kliniskt relevanta tvångssymtom"}. ` +
      `Symtombilden fördelar sig inom undersökta områden enligt följande: ${distributionText}.`;

    return {
      total,
      maxTotal: 72,
      subscales: subscales.map(({ name, score, max }) => ({ name, score, max })),
      interpretation,
      severity: below ? "none" : "severe",
      journalText,
      flags: [],
    };
  },
};
