import { fireEvent } from "@testing-library/react";

export function press(element: Element): void {
  fireEvent.pointerDown(element, { pointerType: "mouse", button: 0, isPrimary: true });
  fireEvent.pointerUp(element, { pointerType: "mouse", button: 0, isPrimary: true });
  fireEvent.click(element);
}
