import { ESLintUtils } from '@typescript-eslint/experimental-utils';

import rule from "../src/rules/js-function-in-worklet";

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('js-function-in-worklet', rule, {
  valid: [
    {
      code: "foo();",
      options: []
    }
  ],
  invalid: []
});