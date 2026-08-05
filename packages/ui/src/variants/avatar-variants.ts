import { cva, type VariantProps } from "class-variance-authority";

export const avatarRootVariants = cva("relative self-start");

export const avatarVariants = cva("items-center justify-center overflow-hidden bg-muted", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
    shape: {
      circle: "rounded-full",
      rounded: "rounded-lg",
    },
    hasRing: {
      true: "border-2 border-primary",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
    hasRing: false,
  },
});

export const avatarFallbackVariants = cva("font-semibold uppercase text-muted-foreground", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const avatarPresenceVariants = cva(
  "absolute bottom-0 right-0 rounded-full border-2 border-background",
  {
    variants: {
      size: {
        xs: "h-2 w-2",
        sm: "h-2.5 w-2.5",
        md: "h-3 w-3",
        lg: "h-3.5 w-3.5",
        xl: "h-4 w-4",
      },
      presence: {
        online: "bg-primary",
        offline: "bg-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      presence: "offline",
    },
  },
);

export const avatarGroupVariants = cva("flex-row items-center");

export const avatarGroupItemVariants = cva("", {
  variants: {
    size: {
      xs: "-ml-2",
      sm: "-ml-2.5",
      md: "-ml-3",
      lg: "-ml-4",
      xl: "-ml-5",
    },
    isFirst: {
      true: "ml-0",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    isFirst: false,
  },
});

export type AvatarVariantProps = VariantProps<typeof avatarVariants>;
export type AvatarFallbackVariantProps = VariantProps<typeof avatarFallbackVariants>;
export type AvatarPresenceVariantProps = VariantProps<typeof avatarPresenceVariants>;
export type AvatarGroupItemVariantProps = VariantProps<typeof avatarGroupItemVariants>;
