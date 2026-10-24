import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper shadow-sm hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-md",
        accent:
          "bg-brand-500 text-ink shadow-sm hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-md",
        outline: "border border-ink/15 bg-white/70 text-ink hover:border-ink/40 hover:bg-white",
        ghost: "text-ink-soft hover:bg-sand hover:text-ink",
        soft: "bg-brand-50 text-brand-900 hover:bg-brand-100",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & ButtonVariantProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
