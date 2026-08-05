import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSheet } from "./use-sheet";

describe("When a sheet is controlled imperatively", () => {
  it("starts closed unless told otherwise", () => {
    const { result } = renderHook(() => useSheet());

    expect(result.current.isOpen).toBe(false);
  });

  it("starts open when asked to", () => {
    const { result } = renderHook(() => useSheet(true));

    expect(result.current.isOpen).toBe(true);
  });

  it("opens, closes and toggles", () => {
    const { result } = renderHook(() => useSheet());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });

  it("keeps open and close stable across renders so effects do not resubscribe", () => {
    const { result, rerender } = renderHook(() => useSheet());
    const { open, close } = result.current;

    rerender();

    expect(result.current.open).toBe(open);
    expect(result.current.close).toBe(close);
  });
});
