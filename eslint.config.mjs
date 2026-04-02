import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default defineConfig([
  ...next,
  {
    languageOptions: {
      parser, // usa o parser do TypeScript
    },
    plugins: {
      "@typescript-eslint": tseslint, // registra o plugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  }
]);