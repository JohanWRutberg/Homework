import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-8xl font-semibold text-brand-300 italic">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Sidan finns inte</h1>
      <p className="mt-3 text-ink-soft">
        Länken kan vara felskriven eller gammal. Hemuppgiften du letar efter finns säkert i
        biblioteket.
      </p>
      <Link href="/hemuppgifter" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        Till hemuppgifterna
      </Link>
    </section>
  );
}
