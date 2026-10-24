"use client";

import { useState } from "react";
import { CATEGORIES, type Category, type HomeworkTemplate } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./TemplateCard";

export function Library({ templates }: { templates: HomeworkTemplate[] }) {
  const [category, setCategory] = useState<Category | null>(null);
  const available = CATEGORIES.filter((c) => templates.some((t) => t.category === c));
  const visible = category ? templates.filter((t) => t.category === category) : templates;

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrera på kategori">
        {[null, ...available].map((c) => (
          <button
            key={c ?? "alla"}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === c
                ? "bg-ink text-paper"
                : "border border-line bg-white text-ink-soft hover:border-ink/30 hover:text-ink"
            )}
          >
            {c ?? "Alla"}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <TemplateCard key={t.slug} template={t} />
        ))}
      </div>
    </>
  );
}
