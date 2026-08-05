import { describe, expect, it } from "vitest";

import { formatDuration } from "./duration";

describe("When formatting a duration under an hour", () => {
  it("renders minutes in the locale's own abbreviation", () => {
    expect(formatDuration(45, "en-IE")).toBe("45 mins");
    expect(formatDuration(45, "pl-PL")).toBe("45 min");
  });
});

describe("When formatting a duration of an hour or more", () => {
  it("splits hours from the remaining minutes", () => {
    expect(formatDuration(90, "en-IE")).toBe("1 hr 30 mins");
  });

  it("omits the minutes on a whole number of hours and pluralises the unit", () => {
    expect(formatDuration(60, "en-IE")).toBe("1 hr");
    expect(formatDuration(120, "en-IE")).toBe("2 hrs");
  });

  it("localises both units rather than hard-coding English", () => {
    expect(formatDuration(90, "de-DE")).toBe("1 Std. 30 Min.");
  });
});
