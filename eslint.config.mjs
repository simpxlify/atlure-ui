import typescriptParser from "@typescript-eslint/parser";

const HEX_LITERAL = "/#[0-9a-fA-F]{3,8}/";
const COLOR_FUNCTION = "/(rgba?|hsla?)\\s*\\(/";

const RAW_COLOR_MESSAGE =
  "Raw colours are banned outside packages/tokens/src/tokens.ts. Consume a token class such as bg-primary or text-foreground, or import from @atlure/tokens.";

const restrictedColorSyntax = [
  "error",
  { selector: `Literal[value=${HEX_LITERAL}]`, message: RAW_COLOR_MESSAGE },
  { selector: `Literal[value=${COLOR_FUNCTION}]`, message: RAW_COLOR_MESSAGE },
  { selector: `TemplateElement[value.raw=${HEX_LITERAL}]`, message: RAW_COLOR_MESSAGE },
  { selector: `TemplateElement[value.raw=${COLOR_FUNCTION}]`, message: RAW_COLOR_MESSAGE },
];

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/generated/**",
      "**/.build/**",
      "**/storybook-static/**",
      "**/*.d.ts",
      "packages/tailwind-preset/index.js",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-restricted-syntax": restrictedColorSyntax,
    },
  },
  {
    files: [
      "packages/tokens/src/tokens.ts",
      "packages/tokens/scripts/**",
      "packages/tokens/test/**",
      "apps/storybook-web/scripts/**",
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];
