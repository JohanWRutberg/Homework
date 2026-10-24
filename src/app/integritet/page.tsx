import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Integritet och säkerhet",
  description:
    "Hur Optimental Hemuppgifter hanterar det du skriver – kort sagt: vi sparar ingenting.",
};

const sections = [
  {
    title: "Vi sparar ingenting",
    body: [
      "Det du skriver i en hemuppgift finns bara i din webbläsare medan sidan är öppen. Det skickas inte till någon server och lagras inte i någon databas.",
      "När du laddar ner PDF:en skapas den direkt i din telefon eller dator. Stänger du sidan utan att ladda ner försvinner det du skrivit.",
      "Tänk på att en nedladdad PDF sparas i din enhet. Använder du en delad dator – radera filen när du är klar.",
    ],
  },
  {
    title: "Inga konton, inga kakor, ingen spårning",
    body: [
      "Du behöver inte logga in och vi vet inte vem du är. Sidan använder inga kakor (cookies), ingen analys och inga annonsverktyg.",
    ],
  },
  {
    title: "AI-hjälpen",
    body: [
      "När du trycker på ”Vad menas här?” visas först en förklaring som din behandlare har skrivit – helt utan AI.",
      "Om du väljer att ställa en fråga till AI-hjälpen skickas din fråga, tillsammans med vilken hemuppgift och vilket fält det gäller, till AI-tjänsten Claude från Anthropic för att ett svar ska kunna skapas. Det du har fyllt i i formuläret skickas aldrig med.",
      "Skriv därför inte ditt namn eller andra personuppgifter i frågan. Vi sparar inte frågorna eller svaren, och Anthropic använder inte innehåll från sitt API för att träna sina modeller.",
      "AI-hjälpen kan förklara och ställa följdfrågor, men den fyller inte i åt dig, ställer inga diagnoser och ersätter inte din behandlare. Svaren kan innehålla fel.",
    ],
  },
  {
    title: "Om du mår dåligt",
    body: [
      "Om du skriver något som tyder på att du har tankar på att skada dig själv slutar AI-hjälpen svara och visar istället var du kan få hjälp direkt: 112 vid akut fara, Mind Självmordslinjen 90101 och 1177 Vårdguiden.",
    ],
  },
  {
    title: "För behandlare",
    body: [
      "Rättningsmallarna räknar ut resultat och journaltext i din webbläsare. Inga svar eller resultat skickas eller sparas. Kopiera journaltexten till journalsystemet som vanligt.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Integritet och säkerhet"
        title={
          <>
            Det du skriver <span className="highlight italic">stannar hos dig.</span>
          </>
        }
      >
        Hemuppgifter handlar ofta om sådant som är personligt. Därför är tjänsten byggd så att vi
        inte behöver – och inte kan – spara det du skriver.
      </PageHeader>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {sections.map((s) => (
          <section key={s.title} className="border-b border-line py-8 first:pt-0 last:border-0">
            <h2 className="text-2xl font-semibold">{s.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-6 text-sm text-ink-muted">
          Frågor? Kontakta{" "}
          <a
            className="underline underline-offset-4 hover:text-ink"
            href={`mailto:${site.contactEmail}`}
          >
            {site.contactEmail}
          </a>
          .
        </p>
      </article>
    </>
  );
}
