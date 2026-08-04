import assert from "node:assert/strict";
import { it } from "node:test";

it("compiles to a loadable module with no runtime surface", async () => {
  const module = await import("../dist/index.js");
  assert.deepEqual(Object.keys(module), []);
});
