import { cva, type VariantProps } from "class-variance-authority";

export const skeletonVariants = cva("bg-muted", {
  variants: {
    shape: {
      line: "h-4 w-full rounded-sm",
      title: "h-6 w-2/3 rounded-sm",
      block: "h-24 w-full rounded-lg",
      circle: "h-10 w-10 rounded-full",
    },
  },
  defaultVariants: {
    shape: "line",
  },
});

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
