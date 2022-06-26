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

import { createState, detectWorklet, WORKLET } from "./common";
export type Options = [];
export type MessageIds = "JSFunctionInWorkletMessage";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/docs/${name}.md`;
});

const JSFunctionInWorkletMessage =
  "{{name}} is not a worklet. Use runOnJS instead.";

const isVarInScope = (name: string, scope: Scope.Scope): boolean => {
  const { variables } = scope;
  if (variables.find((v) => v.name === name) !== undefined) {
    return true;
  } else if (scope.type === "function") {
    return false;
  } else if (scope.upper === null) {
    return false;
  }
  return isVarInScope(name, scope.upper);
};

const URI_PREFIX = "/node_modules/";
const getModuleURI = (n: Node | undefined): string => {
  if (n === undefined) {
    return "";
  } else if (isSourceFile(n)) {
    const start = n.fileName.indexOf(URI_PREFIX) + URI_PREFIX.length;
    return n.fileName.substring(start);
  }
  return getModuleURI(n.parent);
};

export default createRule<Options, MessageIds>({
  name: "js-function-in-worklet",
  meta: {
    type: "problem",
    docs: {
      description:
        "non-worklet functions should be invoked via runOnJS. Use runOnJS() or workletlize instead.",
      category: "Possible Errors",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      JSFunctionInWorkletMessage,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { parserServices } = context;
    if (!parserServices?.hasFullTypeInformation) {
      return {};
    }
    const checker = parserServices.program.getTypeChecker();
    const calleeIsWorklet = (tsNode: CallExpression) => {
      const signature = checker.getResolvedSignature(tsNode);
      const decl = signature?.declaration;
      const uri = getModuleURI(decl);
      if (
        decl !== undefined &&
        (isFunctionTypeNode(decl) || isMethodSignature(decl))
      ) {
        if (
          uri === "react-native-reanimated/react-native-reanimated.d.ts" ||
          uri.startsWith("typescript/") ||
          uri === "@types/node/console.d.ts"
        ) {
          return true;
        }
        const { parent } = decl;
        const tags = getJSDocTags(parent);
        return (
          tags.filter((tag) => tag.tagName.getText() === WORKLET).length > 0
        );
      } else if (
        decl !== undefined &&
        (isFunctionDeclaration(decl) || isArrowFunction(decl))
      ) {
        if (uri.startsWith("typescript/")) {
          return true;
        }
        if (decl.body && isBlock(decl.body)) {
          const [statement] = decl.body.statements;
          if (statement && isExpressionStatement(statement)) {
            return (
              statement.expression
                .getText()
                .substring(1, WORKLET.length + 1) === WORKLET
            );
          }
        } else {
          const tags = getJSDocTags(decl);
          return (
            tags.filter((tag) => tag.tagName.getText() === WORKLET).length > 0
          );
        }
      }
      return false;
    };
    const state = createState();
    return {
      ...detectWorklet(state),
      CallExpression: (node) => {
        if (state.callerIsWorklet) {
          const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
          const { expression } = tsNode;
          const name = expression.getText();
          const signature = checker.getResolvedSignature(tsNode);
          const declaration = signature?.declaration;
          const inScope = isVarInScope(name, context.getScope());
          const uri = getModuleURI(declaration);
          if (inScope) {
            return;
          }
          if (
            declaration &&
            isFunctionTypeNode(declaration) &&
            isFunctionDeclaration(declaration.parent) &&
            isModuleBlock(declaration.parent.parent) &&
            declaration.parent.parent.parent.name.getText() === "Animated"
          ) {
            return;
          } else if (
            declaration &&
            isFunctionDeclaration(declaration) &&
            isModuleBlock(declaration.parent) &&
            declaration.parent.parent.name.getText() === "Animated"
          ) {
            return;
          } else if (declaration === undefined) {
            return;
          } else if (
            uri === "react-native-reanimated/react-native-reanimated.d.ts" ||
            uri.startsWith("typescript/") ||
            uri === "@types/node/console.d.ts" ||
            uri.startsWith(
              "@shopify/react-native-skia/lib/typescript/src/skia/types/"
            )
          ) {
            return;
          }
          if (!calleeIsWorklet(tsNode)) {
            context.report({
              messageId: "JSFunctionInWorkletMessage",
              node,
              data: {
                name,
              },
            });
          }
        }
      },
    };
  },
});
