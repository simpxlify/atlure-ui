import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Avatar } from "./avatar";
import { AvatarGroup } from "./avatar-group";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const SHAPES = ["circle", "rounded"] as const;

class PendingImageLoad {
  static instances: PendingImageLoad[] = [];

  onload: ((event: unknown) => void) | null = null;
  onerror: (() => void) | null = null;
  src = "";

  constructor() {
    PendingImageLoad.instances.push(this);
  }
}

function lastImageLoad(): PendingImageLoad {
  const image = PendingImageLoad.instances.at(-1);
  if (!image) throw new Error("no image load was started");
  return image;
}

beforeEach(() => {
  PendingImageLoad.instances = [];
  vi.stubGlobal("Image", PendingImageLoad);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("When an avatar has no image", () => {
  it("renders at most two uppercased initials taken from the name", () => {
    render(<Avatar src={null} name="Sarah Johnson" />);

    expect(screen.getByText("SJ")).toBeTruthy();
  });

  it("renders a single initial for a single-word name", () => {
    render(<Avatar name="cher" />);

    expect(screen.getByText("C")).toBeTruthy();
  });

  it("names the fallback for screen readers at every size and shape", () => {
    for (const size of SIZES) {
      for (const shape of SHAPES) {
        const { unmount } = render(<Avatar name="Ana Pereira" size={size} shape={shape} />);

        expect(screen.getByRole("img", { name: "Ana Pereira" })).toBeTruthy();
        expect(screen.getByText("AP")).toBeTruthy();

        unmount();
      }
    }
  });
});

describe("When an avatar image is loading", () => {
  it("covers the image with a busy skeleton until the load settles", async () => {
    render(<Avatar name="Ana Pereira" src="https://atlure.test/loading.jpg" />);

    expect(
      screen.getByRole("progressbar", { name: /loading the photo of ana pereira/i }),
    ).toBeTruthy();

    act(() => {
      lastImageLoad().onload?.({});
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("progressbar", { name: /loading the photo of ana pereira/i }),
      ).toBeNull();
    });

    expect(screen.getByAltText("Ana Pereira")).toBeTruthy();
    expect(screen.queryByText("AP")).toBeNull();
  });
});

describe("When an avatar image fails to load", () => {
  it("drops the image node and falls back to the initials", () => {
    render(<Avatar name="Ana Pereira" src="https://atlure.test/broken.jpg" />);

    expect(screen.getByAltText("Ana Pereira")).toBeTruthy();

    act(() => {
      lastImageLoad().onerror?.();
    });

    expect(screen.queryByAltText("Ana Pereira")).toBeNull();
    expect(screen.getByText("AP")).toBeTruthy();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("retries when the same avatar is given a different image", async () => {
    const { rerender } = render(<Avatar name="Ana Pereira" src="https://atlure.test/broken.jpg" />);

    act(() => {
      lastImageLoad().onerror?.();
    });

    expect(screen.getByText("AP")).toBeTruthy();

    rerender(<Avatar name="Ana Pereira" src="https://atlure.test/replacement.jpg" />);

    await waitFor(() => {
      expect(screen.getByAltText("Ana Pereira")).toBeTruthy();
    });
    expect(screen.queryByText("AP")).toBeNull();
  });
});

describe("When an avatar declares a presence", () => {
  it("exposes an online dot to screen readers", () => {
    render(<Avatar name="Ana Pereira" presence="online" />);

    expect(screen.getByLabelText("Ana Pereira is online")).toBeTruthy();
  });

  it("exposes an offline dot to screen readers", () => {
    render(<Avatar name="Ana Pereira" presence="offline" />);

    expect(screen.getByLabelText("Ana Pereira is offline")).toBeTruthy();
  });

  it("renders no presence dot when presence is none", () => {
    render(<Avatar name="Ana Pereira" presence="none" />);

    expect(screen.queryByLabelText(/is online/)).toBeNull();
    expect(screen.queryByLabelText(/is offline/)).toBeNull();
  });

  it("renders a presence dot at every size", () => {
    for (const size of SIZES) {
      const { unmount } = render(<Avatar name="Ana Pereira" size={size} presence="online" />);

      expect(screen.getByLabelText("Ana Pereira is online")).toBeTruthy();

      unmount();
    }
  });
});

describe("When an avatar group overflows", () => {
  it("renders only max avatars plus a labelled overflow count", () => {
    render(
      <AvatarGroup max={4}>
        {Array.from({ length: 7 }, (_, index) => (
          <Avatar key={index} name={`Sitter ${index}`} />
        ))}
      </AvatarGroup>,
    );

    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByLabelText("+3 more")).toBeTruthy();
    expect(screen.getByText("+3")).toBeTruthy();
  });

  it("renders no overflow node when the group fits within max", () => {
    render(
      <AvatarGroup max={4}>
        {Array.from({ length: 3 }, (_, index) => (
          <Avatar key={index} name={`Sitter ${index}`} />
        ))}
      </AvatarGroup>,
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.queryByLabelText(/ more$/)).toBeNull();
  });
});
