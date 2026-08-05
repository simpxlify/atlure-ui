import { spacing } from "@atlure/tokens";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";

import { cn } from "../../lib/cn";
import {
  sheetBackdropClassName,
  sheetContainerClassName,
  sheetContentClassName,
  sheetHandleClassName,
} from "../../variants/sheet-variants";
import { useReducedMotion } from "../skeleton/hooks/use-reduced-motion";
import {
  DEFAULT_SHEET_SNAP_POINTS,
  resolveSnapHeights,
  resolveSnapRelease,
  sheetAnimationDuration,
  SHEET_PAN_ACTIVATION_DISTANCE,
} from "./utils";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  backdropAccessibilityLabel: string;
  accessibilityLabel?: string;
  snapPoints?: readonly number[];
  bottomInset?: number;
  className?: string;
  children: ReactNode;
}

export function Sheet({
  isOpen,
  onClose,
  backdropAccessibilityLabel,
  accessibilityLabel,
  snapPoints = DEFAULT_SHEET_SNAP_POINTS,
  bottomInset = 0,
  className,
  children,
}: SheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const isReducedMotion = useReducedMotion();
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const translateY = useRef(new Animated.Value(windowHeight)).current;

  const snapHeights = useMemo(
    () => resolveSnapHeights(snapPoints, windowHeight),
    [snapPoints, windowHeight],
  );
  const sheetHeight = snapHeights[activeSnapIndex] ?? snapHeights[0];
  const animationDuration = sheetAnimationDuration(isReducedMotion);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : windowHeight,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [isOpen, animationDuration, translateY, windowHeight]);

  useEffect(() => {
    if (!isOpen || Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });

    return () => subscription.remove();
  }, [isOpen, onClose]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dy) > SHEET_PAN_ACTIVATION_DISTANCE,
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_event, gesture) => {
          const release = resolveSnapRelease({
            activeIndex: activeSnapIndex,
            dragDistance: gesture.dy,
            snapHeights,
          });

          if (release.shouldDismiss) {
            onClose();
            return;
          }

          setActiveSnapIndex(release.index);
          Animated.timing(translateY, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
        },
      }),
    [activeSnapIndex, animationDuration, onClose, snapHeights, translateY],
  );

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View className={sheetContainerClassName}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backdropAccessibilityLabel}
          className={sheetBackdropClassName}
          onPress={onClose}
        />
        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          className={cn(sheetContentClassName, className)}
          style={{
            height: sheetHeight,
            paddingBottom: spacing.md + bottomInset,
            transform: [{ translateY }],
          }}
          {...panResponder.panHandlers}
        >
          <View className={sheetHandleClassName} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
