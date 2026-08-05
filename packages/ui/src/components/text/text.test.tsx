import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockResolveTextClassName } = vi.hoisted(() => ({
  mockResolveTextClassName: vi.fn((_input: unknown) => "resolved-class"),
}));
vi.mock("./utils", () => ({
  resolveTextClassName: (input: unknown) => mockResolveTextClassName(input),
}));

import { TextClassProvider } from "./text-class-context";
import { Text } from "./text";

describe("When a text is rendered on its own", () => {
  it("shows its children and resolves classes from its own props only", () => {
    mockResolveTextClassName.mockClear();
    render(
      <Text variant="h1" tone="muted">
        Find a sitter
      </Text>,
    );

    expect(screen.getByText("Find a sitter")).toBeTruthy();
    expect(mockResolveTextClassName).toHaveBeenCalledWith({
      variant: "h1",
      tone: "muted",
      inheritedClassName: undefined,
      className: undefined,
    });
  });
});

describe("When a text sits inside a TextClassProvider", () => {
  it("resolves its classes against the inherited class", () => {
    mockResolveTextClassName.mockClear();
    render(
      <TextClassProvider className="text-primary-foreground">
        <Text>Book Luna</Text>
      </TextClassProvider>,
    );

    expect(mockResolveTextClassName).toHaveBeenCalledWith({
      variant: undefined,
      tone: undefined,
      inheritedClassName: "text-primary-foreground",
      className: undefined,
    });
  });
});
