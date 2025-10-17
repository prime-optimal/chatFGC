import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const browserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
);

const reactConfig = {
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooks,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs["jsx-runtime"].rules,
    ...reactHooks.configs.recommended.rules,
  },
};

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", ".netlify", ".vinxi", "convex"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: browserGlobals,
    },
    ...reactConfig,
  },
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: browserGlobals,
    },
    ...reactConfig,
  },
  {
    files: [
      "**/*.config.{js,ts}",
      "vitest.config.ts",
      "vite.config.js",
      "app.config.ts",
      "scripts/**/*.{js,ts}"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
