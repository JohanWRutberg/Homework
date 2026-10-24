import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "flex w-fit items-center gap-2 text-xs font-semibold tracking-[0.18em] text-brand-800 uppercase before:h-px before:w-6 before:bg-brand-500",
        className
      )}
      {...props}
    />
  );
}
