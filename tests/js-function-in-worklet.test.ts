import path from "path";

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import rule from "../src/rules/js-function-in-worklet";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.join(__dirname, "fixtures"),
  },
});

ruleTester.run("js-function-in-worklet", rule, {
  valid: [
    {
      code: `
function bar() {
  "worklet";
  return true;  
}

useAnimatedStyle(() => {
  bar();
});`,
    },
  ],
  invalid: [
    {
      code: `
function bar() {
  return true;  
}

useAnimatedStyle(() => {
  bar();
});

useAnimatedReaction(() => 1, () => {
  bar();
});
`,
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
