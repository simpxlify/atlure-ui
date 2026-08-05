export const SHEET_ANIMATION_DURATION = 220;
export const SHEET_DISMISS_HEIGHT_RATIO = 0.7;
export const SHEET_PAN_ACTIVATION_DISTANCE = 8;
export const DEFAULT_SHEET_SNAP_POINTS = [0.5] as const;

export function sheetAnimationDuration(isReducedMotion: boolean): number {
  return isReducedMotion ? 0 : SHEET_ANIMATION_DURATION;
}

export function resolveSnapHeights(
  snapPoints: readonly number[],
  containerHeight: number,
): number[] {
  const heights = snapPoints
    .filter((point) => point > 0)
    .map((point) => Math.min(point, 1) * containerHeight)
    .sort((left, right) => left - right);

  return heights.length > 0 ? heights : [containerHeight * DEFAULT_SHEET_SNAP_POINTS[0]];
}

export interface SnapRelease {
  index: number;
  shouldDismiss: boolean;
}

export function resolveSnapRelease({
  activeIndex,
  dragDistance,
  snapHeights,
  dismissHeightRatio = SHEET_DISMISS_HEIGHT_RATIO,
}: {
  activeIndex: number;
  dragDistance: number;
  snapHeights: readonly number[];
  dismissHeightRatio?: number;
}): SnapRelease {
  const smallestHeight = snapHeights[0] ?? 0;
  const currentHeight = snapHeights[activeIndex] ?? smallestHeight;
  const releasedHeight = currentHeight - dragDistance;

  if (releasedHeight < smallestHeight * dismissHeightRatio) {
    return { index: activeIndex, shouldDismiss: true };
  }

  const nearestIndex = snapHeights.reduce(
    (nearest, height, index) =>
      Math.abs(height - releasedHeight) < Math.abs((snapHeights[nearest] ?? 0) - releasedHeight)
        ? index
        : nearest,
    0,
  );

  return { index: nearestIndex, shouldDismiss: false };
}
