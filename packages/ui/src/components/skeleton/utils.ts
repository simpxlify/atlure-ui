export interface SkeletonAnimationInput {
  isAnimated: boolean;
  isReducedMotion: boolean;
}

export function shouldAnimateSkeleton({
  isAnimated,
  isReducedMotion,
}: SkeletonAnimationInput): boolean {
  return isAnimated && !isReducedMotion;
}
