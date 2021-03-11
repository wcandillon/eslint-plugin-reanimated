import path from "path";
import fs from "fs";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/no-multiple-animated-style-usages";

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

ruleTester.run("no-multiple-animated-style-usages", rule, {
  valid,
  invalid: [
    {
      code: code("fixtures/invalid/multiple-animated-style.txt"),
      errors: [
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/multiple-animated-style-array.txt"),
      errors: [
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
      ],
    },
    {
      code: code("fixtures/invalid/multiple-animated-style-nested-props.txt"),
      errors: [
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
        {
          messageId: "NoMultipleAnimatedStyleUsagesMessage",
          data: {
            name: "style",
          },
        },
      ],
    },
    // {
    //   code: code(
    //     "fixtures/invalid/multiple-animated-style-precomposed-array.txt"
    //   ),
    //   errors: [
    //     {
    //       messageId: "NoMultipleAnimatedStyleUsagesMessage",
    //       data: {
    //         name: "style",
    //       },
    //     },
    //     {
    //       messageId: "NoMultipleAnimatedStyleUsagesMessage",
    //       data: {
    //         name: "style",
    //       },
    //     },
    //   ],
    // },
  ],
});
