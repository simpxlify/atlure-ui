import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const packageRoot = process.cwd();

const resolveUnderConditions = (conditions: readonly string[]) =>
  execFileSync(
    process.execPath,
    [
      ...conditions.map((condition) => `--conditions=${condition}`),
      "--input-type=module",
      "-e",
      "process.stdout.write(import.meta.resolve('@atlure/icons'))",
    ],
    { cwd: packageRoot, encoding: "utf8" },
  );

describe("When a bundler resolves the package", () => {
  it("sends the react-native condition to the native entry and everything else to the DOM entry", () => {
    expect(resolveUnderConditions(["react-native"])).toMatch(/dist\/native\.js$/);
    expect(resolveUnderConditions([])).toMatch(/dist\/web\.js$/);
  });
});
