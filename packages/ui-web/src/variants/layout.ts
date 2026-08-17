import { cva, type VariantProps } from 'class-variance-authority';

export const containerVariants = cva('mx-auto w-full px-md md:px-lg', {
  variants: {
    width: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    },
    size: {
      prose: 'max-w-prose',
      default: 'max-w-screen-xl',
      wide: 'max-w-screen-2xl',
    },
  },
  defaultVariants: {
    width: 'xl',
  },
});

export const sectionVariants = cva('py-2xl md:py-3xl', {
  variants: {
    tone: {
      default: 'bg-background text-foreground',
      muted: 'bg-muted text-foreground',
      primary: 'bg-primary text-primary-foreground',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export const gridVariants = cva('grid gap-md', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export const proseClassName =
  'max-w-prose text-base leading-relaxed text-foreground ' +
  '[&_h1]:mt-2xl [&_h1]:mb-lg [&_h1]:text-3xl [&_h1]:font-semibold ' +
  '[&_h2]:mt-xl [&_h2]:mb-md [&_h2]:text-2xl [&_h2]:font-semibold ' +
  '[&_h3]:mt-lg [&_h3]:mb-sm [&_h3]:text-xl [&_h3]:font-semibold ' +
  '[&_p]:mb-md ' +
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_ul]:mb-md [&_ul]:list-disc [&_ul]:pl-xl ' +
  '[&_ol]:mb-md [&_ol]:list-decimal [&_ol]:pl-xl ' +
  '[&_li]:mb-xs ' +
  '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-md [&_blockquote]:italic ' +
  '[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-xs [&_code]:py-0 [&_code]:text-sm';

export const visuallyHiddenClassName =
  'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0_0_0_0)] [clip-path:inset(50%)]';

export const stackVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    shouldWrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    shouldWrap: false,
  },
});

export type ContainerVariantProps = VariantProps<typeof containerVariants>;

export type StackVariantProps = VariantProps<typeof stackVariants>;

export type SectionVariantProps = VariantProps<typeof sectionVariants>;

export type GridVariantProps = VariantProps<typeof gridVariants>;
