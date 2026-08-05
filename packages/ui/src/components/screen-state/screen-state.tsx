import type { ReactNode } from "react";

export type ScreenStatus = "loading" | "error" | "ready";

export interface ScreenStateProps {
  status: ScreenStatus;
  isEmpty?: boolean;
  loadingState: ReactNode;
  errorState: ReactNode;
  emptyState: ReactNode;
  children: ReactNode;
}

export function ScreenState({
  status,
  isEmpty = false,
  loadingState,
  errorState,
  emptyState,
  children,
}: ScreenStateProps) {
  if (status === "loading") {
    return loadingState;
  }

  if (status === "error") {
    return errorState;
  }

  if (isEmpty) {
    return emptyState;
  }

  return children;
}
