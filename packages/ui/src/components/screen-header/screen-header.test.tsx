import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { IconButton } from "../icon-button/icon-button";
import { Text } from "../text/text";
import { ScreenHeader } from "./screen-header";

const onBack = vi.fn();
const onShare = vi.fn();

describe("When a screen header has no back handler", () => {
  it("renders no back affordance", () => {
    onBack.mockReset();
    render(<ScreenHeader title="Luna's profile" />);

    expect(screen.queryByRole("button", { name: /go back/i })).toBeNull();
  });
});

describe("When a screen header has a back handler", () => {
  it("renders a back affordance announced as Go back and calls it once on press", () => {
    onBack.mockReset();
    render(<ScreenHeader onBack={onBack} title="Luna's profile" />);

    press(screen.getByRole("button", { name: /go back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe("When a screen header has a subtitle and trailing actions", () => {
  it("shows the title, the subtitle and every action", () => {
    onBack.mockReset();
    onShare.mockReset();
    render(
      <ScreenHeader
        onBack={onBack}
        right={
          <>
            <IconButton accessibilityLabel="Share" icon={<Text>s</Text>} onPress={onShare} />
            <IconButton accessibilityLabel="Report" icon={<Text>r</Text>} onPress={vi.fn()} />
          </>
        }
        subtitle="Golden retriever, 3 years old"
        title="Luna's profile"
      />,
    );

    expect(screen.getByText("Luna's profile")).toBeTruthy();
    expect(screen.getByText("Golden retriever, 3 years old")).toBeTruthy();

    press(screen.getByRole("button", { name: /share/i }));

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /report/i })).toBeTruthy();
  });
});

describe("When a screen header is given a safe-area top inset", () => {
  it("applies it as padding rather than requiring the caller to wrap the header", () => {
    const { container } = render(<ScreenHeader title="Schedule" topInset={47} />);

    expect(container.firstElementChild).toHaveStyle({ paddingTop: "47px" });
  });
});
