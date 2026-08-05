import { controlHeight } from "@atlure/tokens";

export const MIN_TOUCH_TARGET_SIZE = 44;

export type ControlSize = keyof typeof controlHeight;

export function touchTargetHitSlopForSize(sizePx: number): number {
  return Math.max(0, Math.ceil((MIN_TOUCH_TARGET_SIZE - sizePx) / 2));
}

export function touchTargetHitSlop(size: ControlSize): number {
  return touchTargetHitSlopForSize(controlHeight[size]);
}
