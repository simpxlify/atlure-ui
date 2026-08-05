export const PROGRESS_MIN = 0;
export const PROGRESS_MAX = 100;
export const PROGRESS_INDETERMINATE_DURATION = 1200;
export const PROGRESS_INDETERMINATE_WIDTH_RATIO = 0.4;

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return PROGRESS_MIN;

  return Math.min(Math.max(value, PROGRESS_MIN), PROGRESS_MAX);
}
