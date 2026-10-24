import { Eyebrow } from "@/components/ui/eyebrow";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line paper-grain">
      <div className="mx-auto max-w-6xl animate-fade-up px-4 pt-14 pb-12 sm:px-6 md:pt-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold md:text-6xl">{title}</h1>
        {children && (
          <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{children}</div>
        )}
      </div>
    </section>
  );
}
