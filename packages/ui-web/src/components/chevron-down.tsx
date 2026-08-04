import type { SVGProps } from 'react';
import { cn } from '../lib/cn';

export type ChevronDownProps = SVGProps<SVGSVGElement>;

export function ChevronDown({ className, ...props }: ChevronDownProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
