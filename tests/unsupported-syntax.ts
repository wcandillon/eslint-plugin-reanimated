import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/unsupported-syntax";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.join(__dirname, "fixtures"),
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const code = (name: string) =>
  fs.readFileSync(path.join(__dirname, name), "utf8");
const VALID = "fixtures/valid";
const files = fs.readdirSync(path.join(__dirname, VALID));
const valid = files.map((file) => ({
  code: code(path.join(VALID, file)),
}));

/*
ruleTester.run("unsupported-syntax", rule, {
  valid,
  invalid: [],
});
*/
