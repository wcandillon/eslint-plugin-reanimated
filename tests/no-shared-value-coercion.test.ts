import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/no-shared-value-coercion";

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

ruleTester.run("no-shared-value-coercion", rule, {
  valid,
  invalid: [
    {
      code: code("fixtures/invalid/shared-value-coercion-conditional.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-if.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-and.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-and-right.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-or.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-or-right.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionBooleanMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/shared-value-coercion-template-literal.txt"),
      errors: [
        {
          messageId: "NoSharedValueCoercionStringMessage",
          data: {
            name: "foo",
          },
        },
      ],
    },
  ],
});
