import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const tokensSourceEntry = fileURLToPath(new URL("../tokens/src/index.ts", import.meta.url));
const typesSourceEntry = fileURLToPath(new URL("../types/src/index.ts", import.meta.url));
const gestureHandlerStub = fileURLToPath(
  new URL("./vitest-stubs/react-native-gesture-handler.tsx", import.meta.url),
);
const reanimatedStub = fileURLToPath(
  new URL("./vitest-stubs/react-native-reanimated.tsx", import.meta.url),
);

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: "react-native-web" },
      { find: /^@atlure\/tokens$/, replacement: tokensSourceEntry },
      { find: /^@atlure\/types$/, replacement: typesSourceEntry },
      { find: /^react-native-gesture-handler$/, replacement: gestureHandlerStub },
      { find: /^react-native-reanimated$/, replacement: reanimatedStub },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
  },
});
