import { spacing } from "@atlure/tokens";
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, View } from "react-native";

import { Portal } from "../../lib/portal";
import { toastViewportClassName } from "../../variants/toast-variants";
import { Toast } from "./toast";
import { type QueuedToast, ToastContext, type ToastRequest } from "./toast-context";
import { TOAST_DEFAULT_DURATION } from "./utils";

export interface ToastProviderProps {
  children: ReactNode;
  bottomInset?: number;
}

export function ToastProvider({ children, bottomInset = 0 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<QueuedToast[]>([]);
  const idPrefix = useId();
  const nextIdRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((queued) => queued.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (request: ToastRequest) => {
      nextIdRef.current += 1;
      const id = `${idPrefix}${nextIdRef.current}`;

      setToasts((queued) => [...queued, { ...request, id }]);
      AccessibilityInfo.announceForAccessibility(request.message);

      return id;
    },
    [idPrefix],
  );

  const queue = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);
  const visibleToast = toasts[0] ?? null;

  useEffect(() => {
    if (visibleToast === null) return;

    const duration = visibleToast.duration ?? TOAST_DEFAULT_DURATION;
    const timeout = setTimeout(() => dismiss(visibleToast.id), duration);

    return () => clearTimeout(timeout);
  }, [visibleToast, dismiss]);

  return (
    <ToastContext.Provider value={queue}>
      {children}
      {visibleToast === null ? null : (
        <Portal>
          <View
            className={toastViewportClassName}
            style={{ paddingBottom: spacing.md + bottomInset }}
            pointerEvents="box-none"
          >
            <Toast
              message={visibleToast.message}
              variant={visibleToast.variant}
              onDismiss={() => dismiss(visibleToast.id)}
            />
          </View>
        </Portal>
      )}
    </ToastContext.Provider>
  );
}
