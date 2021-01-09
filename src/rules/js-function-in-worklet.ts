import { ESLintUtils, 
  AST_NODE_TYPES,
  TSESTree, } from '@typescript-eslint/experimental-utils';
import { parseAndGenerateServices } from '@typescript-eslint/typescript-estree';

const createRule = ESLintUtils.RuleCreator(
    name =>
      `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/rules/${name}.md`,
);

export type Options = [

];

export type MessageIds =
  | 'JSFunctionInWorklet';

export default createRule<Options, MessageIds>({
  name: 'js-function-in-worklet',
  meta: {
    type: 'problem',
    docs: {
      description: "non-worklet functions should be invoked via runOnJS",
      category: "Possible Errors",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      JSFunctionInWorklet: "Function is not a worklet. Use runOnJS instead."
    }
  },
  defaultOptions: [],
  create: (context) => {
    console.log({ context });
    return {
      CallExpression: (node) => {
        console.log({ node });
      }
    }
  }
})