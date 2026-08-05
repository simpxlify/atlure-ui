import assert from "node:assert/strict";
import { it } from "node:test";

const codes = [
  "not-found",
  "unauthenticated",
  "forbidden",
  "validation-failed",
  "conflict",
  "rate-limited",
  "unavailable",
  "timed-out",
  "cancelled",
  "unknown",
];

it("errorMessageKey maps every ErrorCode to errors.<code>", async () => {
  const { errorMessageKey } = await import("../dist/index.js");
  for (const code of codes) {
    assert.equal(errorMessageKey(code), `errors.${code}`);
  }
});
