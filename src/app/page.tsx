import {
  ArrowRight,
  ClipboardList,
  FileDown,
  Lock,
  MessageCircleQuestion,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { TemplateCard } from "@/components/homework/TemplateCard";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { templates } from "@/lib/templates";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    title: "Öppna din hemuppgift",
    text: "Din behandlare skickar en länk, eller så väljer du själv i biblioteket. Inget konto, ingen inloggning.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Fyll i – med hjälp på vägen",
    text: "Tryck på ”Vad menas här?” vid varje fråga. Se ett ifyllt exempel. Fråga AI-hjälpen om något är oklart.",
  },
  {
    icon: FileDown,
    title: "Ladda ner och ta med",
    text: "Spara som PDF i mobilen eller datorn och ta med till nästa besök. Ingenting sparas hos oss.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Två ingångar */}
      <section className="mx-auto -mt-6 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <EntryCard
            href="/hemuppgifter"
            icon={UserRound}
            eyebrow="För dig som går i behandling"
            title="Jag ska göra en hemuppgift"
            text="Tankedagbok, beteendeanalys, exponering, sömn och mer – med förklaringar och exempel."
            tone="light"
          />
          <EntryCard
            href="/behandlare"
            icon={Stethoscope}
            eyebrow="För psykologer och behandlare"
            title="Rätta skattningar och få journaltext"
            text="RAADS-14, GAD-7, MADRS-S och OCI-R. Klicka i svaren – få poäng, tolkning och färdig journaltext."
            tone="dark"
          />
        </div>
      </section>

      {/* Så fungerar det */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Eyebrow>Så fungerar det</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Tre steg. <span className="italic">Noll</span> krångel.
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-line bg-white/60 p-7"
            >
              <span className="absolute top-6 right-7 font-display text-5xl text-brand-200 italic">
                {i + 1}
              </span>
              <step.icon className="size-7 text-brand-700" aria-hidden />
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Integritet */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full border-[40px] border-brand-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-10 size-72 rounded-full border-[30px] border-white/5" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow className="text-brand-300">Integritet</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
              Det du skriver <span className="text-brand-400 italic">stannar hos dig.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              Dina svar finns bara i din webbläsare medan du fyller i. Vi har inga konton, ingen
              databas och inga kakor. När du stänger sidan är allt borta – om du inte själv laddat
              ner det.
            </p>
            <Link
              href="/integritet"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }), "group mt-8")}
            >
              Läs mer om integritet
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className="grid gap-4">
            {[
              { icon: Lock, text: "Inga inloggningar och inga användarkonton" },
              {
                icon: ShieldCheck,
                text: "Inget lagras på servern – PDF:en skapas i din egen enhet",
              },
              {
                icon: MessageCircleQuestion,
                text: "AI-hjälpen får bara din fråga – aldrig det du fyllt i",
              },
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-ink">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <span className="text-white/90">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bibliotek */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Biblioteket</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Hemuppgifter</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Beprövade KBT-övningar, omgjorda till formulär som fungerar i mobilen.
            </p>
          </div>
          <Link
            href="/hemuppgifter"
            className={cn(buttonVariants({ variant: "outline" }), "group self-start md:self-auto")}
          >
            Visa alla
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.slice(0, 3).map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line paper-grain">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-10 right-[8%] size-80 animate-blob rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] size-72 animate-blob rounded-full bg-brand-100 blur-3xl [animation-delay:-5s]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>Från Optimental</Eyebrow>
          <h1 className="mt-5 text-5xl leading-[1.02] font-semibold md:text-6xl lg:text-7xl">
            Hemuppgifter som <span className="highlight italic">blir gjorda.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Fyll i dina KBT-övningar direkt i mobilen. Få förklaringar på enkel svenska när något
            känns oklart – och ta med en snygg PDF till nästa besök.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/hemuppgifter" className={cn(buttonVariants({ size: "lg" }), "group")}>
              Hitta din hemuppgift
              <ArrowRight className="text-brand-400 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/behandlare" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Jag är behandlare
            </Link>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div
      className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:150ms]"
      aria-hidden
    >
      <div className="absolute -top-6 -left-6 size-24 rounded-full border-4 border-brand-300/60" />
      <div className="absolute -right-4 -bottom-8 size-32 rounded-full border-4 border-brand-400/40" />

      <div className="relative rotate-[-1.5deg] rounded-[2rem] border border-line bg-white p-6 shadow-2xl shadow-ink/10">
        <p className="text-xs font-semibold tracking-[0.18em] text-ink-muted uppercase">
          Tankedagbok
        </p>
        <p className="mt-3 font-display text-xl font-semibold">Automatisk tanke</p>
        <div className="mt-3 h-20 rounded-2xl border border-line bg-paper p-3 text-sm text-ink-muted">
          ”Hon är missnöjd med mig …”
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-ink" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-medium text-ink-soft">Hur mycket trodde du på tanken?</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-sand">
          <div className="h-2 w-[70%] rounded-full bg-brand-500" />
        </div>
      </div>

      <div className="bubble relative mt-8 ml-8 rotate-[1deg] border border-ink bg-ink p-5 text-sm leading-relaxed text-white shadow-xl">
        <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-brand-300">
          <MessageCircleQuestion className="size-4" /> Vad menas här?
        </p>
        En automatisk tanke är det som snabbt for genom huvudet – ofta utan att du valde att tänka
        den. Fråga dig: <em className="text-brand-200">”Vad sa jag till mig själv just då?”</em>
      </div>
    </div>
  );
}

function EntryCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  text,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  text: string;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 md:p-10",
        dark
          ? "bg-ink text-white shadow-xl shadow-ink/20"
          : "border border-line bg-white shadow-xl shadow-ink/5"
      )}
    >
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl",
          dark ? "bg-brand-500 text-ink" : "bg-brand-50 text-brand-700"
        )}
      >
        <Icon className="size-7" />
      </span>
      <p className={cn("mt-8 text-sm font-medium", dark ? "text-brand-300" : "text-brand-800")}>
        {eyebrow}
      </p>
      <h2 className={cn("mt-2 text-3xl font-semibold", dark && "text-white")}>{title}</h2>
      <p className={cn("mt-3 leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>{text}</p>
      <span className="mt-8 inline-flex items-center gap-2 font-medium">
        {dark ? "Till behandlarsidan" : "Till hemuppgifterna"}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
