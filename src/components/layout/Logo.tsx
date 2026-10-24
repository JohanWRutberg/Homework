import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Till startsidan"
    >
      <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 transition-transform duration-300 group-hover:-rotate-3">
        <Image
          src="/images/optimental-logo.jpg"
          alt=""
          fill
          sizes="48px"
          className="object-contain p-0.5"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn("text-lg font-bold tracking-tight", inverted ? "text-white" : "text-ink")}
        >
          Opti<span className="text-brand-500">mental</span>
        </span>
        <span
          className={cn(
            "mt-1 font-display text-[0.8rem] italic",
            inverted ? "text-white/60" : "text-ink-muted"
          )}
        >
          Hemuppgifter
        </span>
      </span>
    </Link>
  );
}
