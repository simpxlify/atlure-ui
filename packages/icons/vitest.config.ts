import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const tokensSourceEntry = fileURLToPath(new URL("../tokens/src/index.ts", import.meta.url));

export default defineConfig({
  resolve: {
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: [
      { find: /^react-native$/, replacement: "react-native-web" },
      {
        find: /^react-native-svg$/,
        replacement: "react-native-svg/lib/module/ReactNativeSVG.web.js",
      },
      { find: /^@atlure\/tokens$/, replacement: tokensSourceEntry },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    server: {
      deps: {
        inline: ["lucide-react-native", "react-native-svg"],
      },
    },
  },
});
