import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ICON_NAMES } from "./icon-names.js";
import { iconSize } from "./icon-props.js";
import * as webEntry from "./web.js";

describe("When resolving the DOM entry", () => {
  it("defines every committed icon name", () => {
    const exports = webEntry as unknown as Record<string, unknown>;
    const missing = ICON_NAMES.filter((name) => exports[name] === undefined);

    expect(missing).toEqual([]);
  });
});

describe("When rendering a DOM icon with no explicit props", () => {
  it("falls back to the token icon size and a stroke width of 2", () => {
    const markup = renderToStaticMarkup(createElement(webEntry.Heart));

    expect(markup).toContain(`width="${iconSize.lg}"`);
    expect(markup).toContain(`height="${iconSize.lg}"`);
    expect(markup).toContain('stroke-width="2"');
  });
});
