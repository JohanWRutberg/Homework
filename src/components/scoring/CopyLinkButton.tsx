"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyLinkButton({ path, className }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
        copied ? "bg-emerald-100 text-emerald-900" : "bg-sand text-ink hover:bg-brand-100",
        className
      )}
    >
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? "Länk kopierad" : "Kopiera länk"}
    </button>
  );
}
