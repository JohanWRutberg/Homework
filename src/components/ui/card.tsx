import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-white shadow-[0_1px_0_rgba(26,22,20,0.04),0_12px_32px_-20px_rgba(26,22,20,0.25)]",
        className
      )}
      {...props}
    />
  );
}
