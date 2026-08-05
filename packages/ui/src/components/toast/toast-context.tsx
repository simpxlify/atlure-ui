import { createContext } from "react";

import type { ToastVariantProps } from "../../variants/toast-variants";

export type ToastVariant = NonNullable<ToastVariantProps["variant"]>;

export interface ToastRequest {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface QueuedToast extends ToastRequest {
  id: string;
}

export interface ToastQueue {
  toasts: readonly QueuedToast[];
  show: (toast: ToastRequest) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastQueue | null>(null);

export const MISSING_TOAST_PROVIDER_MESSAGE =
  "No <ToastProvider> found. Render <ToastProvider> once at the app root so toasts have somewhere to queue.";
