import { cssInterop } from "nativewind";

type InteropTarget = Parameters<typeof cssInterop>[0];

export function registerIconInterop(iconComponents: readonly unknown[]) {
  for (const iconComponent of iconComponents) {
    cssInterop(iconComponent as InteropTarget, {
      className: {
        target: "style",
        nativeStyleToProp: { color: true },
      },
    });
  }
}
