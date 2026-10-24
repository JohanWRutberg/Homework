import { LifeBuoy, Phone } from "lucide-react";
import { crisisContacts } from "@/lib/site";

export function CrisisPanel() {
  return (
    <div role="alert" className="rounded-2xl border-2 border-brand-600 bg-brand-50 p-5">
      <p className="flex items-center gap-2 font-semibold text-ink">
        <LifeBuoy className="size-5 text-brand-700" aria-hidden />
        Det låter som att du har det jobbigt just nu
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Du förtjänar att prata med en människa om det här. AI-hjälpen kan inte stötta dig i det, men
        de här kan – dygnet runt:
      </p>
      <ul className="mt-4 grid gap-2">
        {crisisContacts.map((c) => (
          <li key={c.name}>
            <a
              href={c.href}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-brand-200 transition hover:ring-brand-500"
            >
              <Phone className="size-4 shrink-0 text-brand-700" aria-hidden />
              <span>
                <span className="block font-medium text-ink">{c.name}</span>
                <span className="block text-sm text-ink-soft">{c.detail}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">
        Berätta också för din behandlare vid nästa kontakt.
      </p>
    </div>
  );
}
