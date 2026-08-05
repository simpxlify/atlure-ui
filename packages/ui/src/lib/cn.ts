import { controlHeight, textareaHeight } from "@atlure/tokens";
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const controlHeightClassValues = Object.keys(controlHeight).map((scaleKey) => `control-${scaleKey}`);
const textareaHeightClassValues = Object.keys(textareaHeight).map(
  (scaleKey) => `textarea-${scaleKey}`,
);
const heightClassValues = [...controlHeightClassValues, ...textareaHeightClassValues];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      h: [{ h: heightClassValues }],
      "min-h": [{ "min-h": heightClassValues }],
    },
  },
});

export function cn(...classValues: ClassValue[]): string {
  return twMerge(clsx(classValues));
}
