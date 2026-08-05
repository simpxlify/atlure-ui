import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { ErrorState } from "./error-state";

const onRetry = vi.fn();

describe("When an error state is shown", () => {
  it("announces itself and offers the retry the caller supplied", () => {
    onRetry.mockReset();
    render(
      <ErrorState
        title="Could not load sitters"
        message="Check your connection and try again."
        retryLabel="Try again"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /could not load sitters/i })).toBeTruthy();
    expect(screen.getByText("Check your connection and try again.")).toBeTruthy();

    press(screen.getByRole("button", { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
