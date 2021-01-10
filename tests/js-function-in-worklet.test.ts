import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/js-function-in-worklet";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.join(__dirname, "fixtures"),
    sourceType: "module",
  },
});

const code = (name: string) =>
  fs.readFileSync(path.join(__dirname, name), "utf8");

ruleTester.run("js-function-in-worklet", rule, {
  valid: [
    {
      code: code("fixtures/valid/test1.txt"),
    },
    {
      code: code("fixtures/valid/test2.txt"),
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
    {
      code: code("fixtures/invalid/test2.txt"),
      errors: [
        {
          messageId: "JSFunctionInWorkletMessage",
          data: {
            name: "mix",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/test3.txt"),
      errors: [
        {
          messageId: "JSFunctionInWorkletMessage",
          data: {
            name: "parse",
          },
        },
      ],
    },
  ],
});
