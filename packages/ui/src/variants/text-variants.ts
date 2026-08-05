import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("", {
  variants: {
    variant: {
      display: "text-3xl font-bold",
      h1: "text-2xl font-bold",
      h2: "text-xl font-semibold",
      h3: "text-lg font-semibold",
      body: "text-base font-normal",
      bodySm: "text-sm font-normal",
      label: "text-sm font-medium",
      caption: "text-xs font-normal",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      inverse: "text-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
  },
});

export type TextVariantProps = VariantProps<typeof textVariants>;
