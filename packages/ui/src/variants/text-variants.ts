import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "text-3xl font-bold",
      heading: "text-2xl font-bold",
      title: "text-xl font-semibold",
      subtitle: "text-lg font-medium",
      body: "text-base font-normal",
      caption: "text-sm font-normal",
      overline: "text-xs font-medium uppercase",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
  },
});

export type TextVariantProps = VariantProps<typeof textVariants>;
