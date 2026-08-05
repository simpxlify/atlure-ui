import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      if (isSubscribed) {
        setIsReducedMotion(isEnabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setIsReducedMotion,
    );

    return () => {
      isSubscribed = false;
      subscription?.remove();
    };
  }, []);

  return isReducedMotion;
}
