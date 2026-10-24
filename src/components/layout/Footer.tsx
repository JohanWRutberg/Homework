import { ExternalLink, Mail, ShieldCheck } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { crisisContacts, site } from "@/lib/site";
import { Logo } from "./Logo";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white/70 print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverted />
            <p className="max-w-sm text-sm leading-relaxed">
              Hemuppgifter och skattningar som är lätta att förstå och fylla i. Allt du skriver
              stannar i din webbläsare.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/80 ring-1 ring-white/10">
              <ShieldCheck className="size-3.5 text-brand-400" />
              Inga konton · inga kakor · inget sparas
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">Sidor</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/hemuppgifter" className="hover:text-brand-300">
                  Hemuppgifter
                </Link>
              </li>
              <li>
                <Link href="/behandlare" className="hover:text-brand-300">
                  För behandlare
                </Link>
              </li>
              <li>
                <Link href="/integritet" className="hover:text-brand-300">
                  Integritet och säkerhet
                </Link>
              </li>
              <li>
                <a
                  href={site.mainSite}
                  className="inline-flex items-center gap-1.5 hover:text-brand-300"
                >
                  Optimental.se <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="inline-flex items-center gap-1.5 hover:text-brand-300"
                >
                  <Mail className="size-3.5" /> {site.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">
              Behöver du hjälp nu?
            </h2>
            <ul className="space-y-2.5 text-sm">
              {crisisContacts.map((c) => (
                <li key={c.name}>
                  <a href={c.href} className="hover:text-brand-300">
                    <span className="font-medium text-white">{c.name}</span>
                    <span className="block text-white/60">{c.detail}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © <CurrentYear /> Optimental. Alla rättigheter förbehållna.
          </p>
          <p>Utvecklad av JoRu</p>
        </div>
      </div>
    </footer>
  );
}
