import { describe, expect, it, vi } from "vitest";

const { mockCssInterop } = vi.hoisted(() => ({ mockCssInterop: vi.fn() }));
vi.mock("nativewind", () => ({
  cssInterop: (...args: unknown[]) => mockCssInterop(...args),
}));

import { ICON_NAMES } from "./icon-names.js";
import * as nativeEntry from "./native.js";
import * as webEntry from "./web.js";

const iconNamesIn = (entry: unknown) =>
  Object.keys(entry as Record<string, unknown>)
    .filter((key) => (ICON_NAMES as readonly string[]).includes(key))
    .sort();

describe("When resolving the React Native entry", () => {
  it("defines every committed icon name", () => {
    const exports = nativeEntry as unknown as Record<string, unknown>;
    const missing = ICON_NAMES.filter((name) => exports[name] === undefined);

    expect(missing).toEqual([]);
  });

  it("exposes the same icon surface as the DOM entry", () => {
    expect(iconNamesIn(nativeEntry)).toEqual(iconNamesIn(webEntry));
  });
});

describe("When the React Native entry is imported", () => {
  it("registers a className interop mapping colour onto every icon", () => {
    expect(mockCssInterop).toHaveBeenCalledTimes(ICON_NAMES.length);
    expect(mockCssInterop).toHaveBeenCalledWith(expect.anything(), {
      className: { target: "style", nativeStyleToProp: { color: true } },
    });
  });
});
