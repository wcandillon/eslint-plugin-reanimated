import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/js-function-in-worklet";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.join(__dirname, "fixtures"),
  },
});

const code = (name: string) =>
  fs.readFileSync(path.join(__dirname, name), "utf8");

ruleTester.run("js-function-in-worklet", rule, {
  valid: [
    {
      code: code("fixtures/valid/test1.txt"),
    },
  ],
  invalid: [
    {
      code: code("fixtures/invalid/test1.txt"),
      errors: [
        {
          messageId: "JSFunctionInWorkletMessage",
          data: {
            name: "bar",
          },
        },
        {
          messageId: "JSFunctionInWorkletMessage",
          data: {
            name: "bar",
          },
        },
      ],
    },
  ],
});
