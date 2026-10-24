import { Activity, Footprints, Lightbulb, Moon, NotebookPen, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  tankedagbok: Lightbulb,
  beteendeanalys: Footprints,
  exponeringstrappa: Activity,
  aktivitetsdagbok: NotebookPen,
  somndagbok: Moon,
};

export function TemplateIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? NotebookPen;
  return <Icon className={className} aria-hidden />;
}
