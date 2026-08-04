import { controlHeight } from "@atlure/tokens";
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const controlHeightClassValues = Object.keys(controlHeight).map((scaleKey) => `control-${scaleKey}`);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      h: [{ h: controlHeightClassValues }],
      "min-h": [{ "min-h": controlHeightClassValues }],
    },
  },
});

export function cn(...classValues: ClassValue[]): string {
  return twMerge(clsx(classValues));
}
