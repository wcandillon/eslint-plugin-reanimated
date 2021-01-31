import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { Scope } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import {
  Node,
  isFunctionDeclaration,
  isBlock,
  isExpressionStatement,
  CallExpression,
  isFunctionTypeNode,
  getJSDocTags,
  isArrowFunction,
  isMethodSignature,
  isModuleBlock,
  isSourceFile,
} from "typescript";

import { createState, detectWorklet } from "./common";
export type Options = [];
export type MessageIds = "UnsupportedSyntaxMessage";

const UnsupportedSyntaxMessage =
  "{{name}} is not a supported syntax in an Array.";

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
    };
  },
});
