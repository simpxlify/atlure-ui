import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Pressable,
  type PressableProps,
  ScrollView,
  View,
  type ViewProps,
} from "react-native";

import { cn } from "../../lib/cn";
import {
  tabsContentVariants,
  tabsIndicatorClassName,
  tabsIndicatorHeight,
  tabsListClassName,
  tabsTriggerLabelVariants,
  tabsTriggerVariants,
} from "../../variants/tabs-variants";
import { Text } from "../text/text";
import { TabsProvider, useTabsControl, type TabsTriggerLayout } from "./tabs-context";

const indicatorTransitionDurationMs = 180;

export interface TabsProps extends Omit<ViewProps, "children"> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...viewProps
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const activeValue = value ?? uncontrolledValue;

  const [activatedValues, setActivatedValues] = useState<ReadonlySet<string>>(
    () => new Set([activeValue]),
  );
  const [triggerLayouts, setTriggerLayouts] = useState<ReadonlyMap<string, TabsTriggerLayout>>(
    () => new Map(),
  );

  useEffect(() => {
    setActivatedValues((previous) =>
      previous.has(activeValue) ? previous : new Set(previous).add(activeValue),
    );
  }, [activeValue]);

  const select = useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [value, onValueChange],
  );

  const reportTriggerLayout = useCallback((triggerValue: string, layout: TabsTriggerLayout) => {
    setTriggerLayouts((previous) => {
      const existing = previous.get(triggerValue);

      if (existing?.x === layout.x && existing.width === layout.width) {
        return previous;
      }

      return new Map(previous).set(triggerValue, layout);
    });
  }, []);

  const control = useMemo(
    () => ({
      activeValue,
      hasBeenActivated: (candidate: string) => activatedValues.has(candidate),
      select,
      triggerLayouts,
      reportTriggerLayout,
    }),
    [activeValue, activatedValues, select, triggerLayouts, reportTriggerLayout],
  );

  return (
    <View className={cn("flex-1 flex-col", className)} {...viewProps}>
      <TabsProvider control={control}>{children}</TabsProvider>
    </View>
  );
}

export interface TabsListProps extends Omit<ViewProps, "children"> {
  accessibilityLabel: string;
  isScrollable?: boolean;
  children: ReactNode;
}

export function TabsList({
  accessibilityLabel,
  isScrollable = true,
  className,
  children,
  ...viewProps
}: TabsListProps) {
  const control = useTabsControl();
  const indicatorOffset = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const activeLayout = control?.triggerLayouts.get(control.activeValue);

  useEffect(() => {
    if (activeLayout === undefined) {
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(indicatorOffset, {
        toValue: activeLayout.x,
        duration: indicatorTransitionDurationMs,
        useNativeDriver: false,
      }),
      Animated.timing(indicatorWidth, {
        toValue: activeLayout.width,
        duration: indicatorTransitionDurationMs,
        useNativeDriver: false,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [activeLayout, indicatorOffset, indicatorWidth]);

  const list = (
    <View
      accessibilityRole="tablist"
      role="tablist"
      accessibilityLabel={accessibilityLabel}
      className={cn(tabsListClassName, className)}
      {...viewProps}
    >
      {children}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          height: tabsIndicatorHeight,
          left: indicatorOffset,
          width: indicatorWidth,
        }}
      >
        <View className={tabsIndicatorClassName} />
      </Animated.View>
    </View>
  );

  if (!isScrollable) {
    return list;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {list}
    </ScrollView>
  );
}

export interface TabsTriggerProps
  extends Omit<
    PressableProps,
    "children" | "disabled" | "onPress" | "accessibilityState" | "accessibilityRole"
  > {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export function TabsTrigger({
  value,
  label,
  isDisabled = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: TabsTriggerProps) {
  const control = useTabsControl();
  const isActive = control?.activeValue === value;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: isActive, disabled: isDisabled }}
      aria-selected={isActive}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onPress={() => control?.select(value)}
      onLayout={(event) => {
        const { x, width } = event.nativeEvent.layout;
        control?.reportTriggerLayout(value, { x, width });
      }}
      className={cn(tabsTriggerVariants({ isDisabled }), className)}
      {...pressableProps}
    >
      <Text className={tabsTriggerLabelVariants({ isActive })}>{label}</Text>
    </Pressable>
  );
}

export interface TabsContentProps extends Omit<ViewProps, "children"> {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children, ...viewProps }: TabsContentProps) {
  const control = useTabsControl();

  if (control?.hasBeenActivated(value) !== true) {
    return null;
  }

  const isActive = control.activeValue === value;

  return (
    <View
      role="tabpanel"
      aria-hidden={!isActive}
      className={cn(tabsContentVariants({ isActive }), className)}
      {...viewProps}
    >
      {children}
    </View>
  );
}
