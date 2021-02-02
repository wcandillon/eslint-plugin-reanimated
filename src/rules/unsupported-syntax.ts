import { ESLintUtils } from "@typescript-eslint/experimental-utils";

import { createState, detectWorklet } from "./common";
export type Options = [];
export type MessageIds = "UnsupportedSyntaxMessage";

const UnsupportedSyntaxMessage =
  "{{name}} is not a supported syntax within a worklet.";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/docs/${name}.md`;
});

export default createRule<Options, MessageIds>({
  name: "unsupported-syntax",
  meta: {
    type: "problem",
    docs: {
      description: "Some syntaxes are not a supported within a worklet.",
      category: "Possible Errors",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      UnsupportedSyntaxMessage,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const state = createState();
    return {
      ...detectWorklet(state),
      ForOfStatement: (node) => {
        if (state.callerIsWorklet) {
          context.report({
            messageId: "UnsupportedSyntaxMessage",
            node,
            data: {
              name: "for in/of",
            },
          });
        }
      },
      ForInStatement: (node) => {
        if (state.callerIsWorklet) {
          context.report({
            messageId: "UnsupportedSyntaxMessage",
            node,
            data: {
              name: "for in/of",
            },
          });
        }
      },
      ObjectPattern: (node) => {
        if (state.callerIsWorklet) {
          context.report({
            messageId: "UnsupportedSyntaxMessage",
            node,
            data: {
              name: "Object destructuring",
            },
          });
        }
      },
      SpreadElement: (node) => {
        if (state.callerIsWorklet) {
          context.report({
            messageId: "UnsupportedSyntaxMessage",
            node,
            data: {
              name: "The spread operator",
            },
          });
        }
      },
    };
  },
});
