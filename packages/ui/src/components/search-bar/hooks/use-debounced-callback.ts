import { useCallback, useEffect, useRef } from "react";

export interface DebouncedCallback<TValue> {
  schedule: (value: TValue) => void;
  flush: (value: TValue) => void;
}

export function useDebouncedCallback<TValue>(
  callback: ((value: TValue) => void) | undefined,
  delayMs: number,
): DebouncedCallback<TValue> {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCallbackRef = useRef(callback);

  useEffect(() => {
    latestCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const schedule = useCallback(
    (value: TValue) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => latestCallbackRef.current?.(value), delayMs);
    },
    [delayMs],
  );

  const flush = useCallback((value: TValue) => {
    clearTimeout(timeoutRef.current);
    latestCallbackRef.current?.(value);
  }, []);

  return { schedule, flush };
}
