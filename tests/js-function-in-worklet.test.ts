import { ESLintUtils } from '@typescript-eslint/experimental-utils';

import rule from "../src/rules/js-function-in-worklet";

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname + "/fixtures",
  },
});

ruleTester.run('js-function-in-worklet', rule, {
  valid: [
    {
      code: "function foo() { 'worklet'; return true; } foo();",
      options: []
    }
  ],
  invalid: []
});