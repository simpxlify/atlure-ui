import { type ReactNode, useEffect, useId } from "react";
import { BackHandler, Modal, Platform, Pressable, View } from "react-native";

import { cn } from "../../lib/cn";
import { Portal, usePortalRegistry } from "../../lib/portal";
import {
  dialogContentClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogOverlayClassName,
  dialogTitleClassName,
} from "../../variants/dialog-variants";
import { overlayBackdropClassName } from "../../variants/overlay-variants";
import { Text } from "../text/text";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  backdropAccessibilityLabel?: string;
  accessibilityLabel?: string;
  isDismissible?: boolean;
  className?: string;
  children: ReactNode;
}

export function Dialog({
  isOpen,
  onClose,
  backdropAccessibilityLabel,
  accessibilityLabel,
  isDismissible = true,
  className,
  children,
}: DialogProps) {
  const { activeOverlayId, requestSlot, releaseSlot } = usePortalRegistry();
  const overlayId = useId();

  useEffect(() => {
    if (!isOpen) return;

    requestSlot(overlayId);
    return () => releaseSlot(overlayId);
  }, [isOpen, overlayId, requestSlot, releaseSlot]);

  const isVisible = isOpen && activeOverlayId === overlayId;

  useEffect(() => {
    if (!isVisible || !isDismissible || Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });

    return () => subscription.remove();
  }, [isVisible, isDismissible, onClose]);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={isDismissible ? onClose : undefined}
      >
        <View className={dialogOverlayClassName}>
          {isDismissible ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={backdropAccessibilityLabel}
              className={overlayBackdropClassName}
              onPress={onClose}
            />
          ) : (
            <View className={overlayBackdropClassName} />
          )}
          <View
            accessibilityViewIsModal
            accessibilityLabel={accessibilityLabel}
            className={cn(dialogContentClassName, className)}
          >
            {children}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <View className={cn(dialogHeaderClassName, className)}>{children}</View>;
}

export function DialogTitle({ className, children }: { className?: string; children: string }) {
  return (
    <Text role="heading" aria-level={2} className={cn(dialogTitleClassName, className)}>
      {children}
    </Text>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  return <Text className={cn(dialogDescriptionClassName, className)}>{children}</Text>;
}

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <View className={className}>{children}</View>;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <View className={cn(dialogFooterClassName, className)}>{children}</View>;
}
