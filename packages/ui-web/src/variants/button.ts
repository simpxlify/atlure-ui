import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex flex-row items-center justify-center gap-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-control-sm px-md text-sm',
        md: 'h-control-md px-lg text-base',
        lg: 'h-control-lg px-xl text-base',
        icon: 'h-control-icon w-control-icon px-0',
      },
      isFullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isFullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
