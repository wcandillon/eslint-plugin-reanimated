import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import {
  isFunctionDeclaration,
  isBlock,
  isExpressionStatement,
  CallExpression,
  isFunctionTypeNode,
  getJSDocTags,
  isArrowFunction,
} from "typescript";
const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/rules/${name}.md`
);
export type Options = [];
export type MessageIds = "JSFunctionInWorkletMessage";

const functionHooks = new Map([
  ["useAnimatedStyle", [0]],
  ["useAnimatedProps", [0]],
  ["useDerivedValue", [0]],
  ["useAnimatedScrollHandler", [0]],
  ["useAnimatedReaction", [0, 1]],
  ["useWorkletCallback", [0]],
  ["createWorklet", [0]],
  // animations' callbacks
  ["withTiming", [2]],
  ["withSpring", [2]],
  ["withDecay", [1]],
  ["withRepeat", [3]],
]);
const functionNames = Array.from(functionHooks.keys());
const matchFunctions = `/${functionNames.join("|")}/`;

const JSFunctionInWorkletMessage =
  "{{name}} is not a worklet. Use runOnJS instead.";
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
    // const sourceCode = context.getSourceCode();
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    // const compilerOptions = parserServices.program.getCompilerOptions();
    const calleeIsWorklet = (tsNode: CallExpression) => {
      const signature = checker.getResolvedSignature(tsNode);
      const decl = signature?.declaration;
      if (decl !== undefined && isFunctionTypeNode(decl)) {
        //const r = checker.getResolvedSignature(tsNode.parent.ki);
        const { parent } = decl;
        if (
          isFunctionDeclaration(parent) &&
          parent.name?.getText() === "createWorklet"
        ) {
          return true;
        }
        const tags = getJSDocTags(decl);
        return (
          tags.filter((tag) => tag.tagName.getText() === "worklet").length > 0
        );
      } else if (
        decl !== undefined &&
        (isFunctionDeclaration(decl) || isArrowFunction(decl))
      ) {
        if (decl.body && isBlock(decl.body)) {
          const [statement] = decl.body.statements;
          if (statement && isExpressionStatement(statement)) {
            const esNode = parserServices.tsNodeToESTreeNodeMap.get<TSESTree.ExpressionStatement>(
              statement
            );
            return esNode.directive === "worklet";
          }
        }
      }
      return false;
    };
    let currentCodePath: string | null = null;
    let callerIsWorklet = false;
    return {
      onCodePathStart: (codePath, node) => {
        if (
          (node.type === "ArrowFunctionExpression" ||
            node.type === "FunctionDeclaration") &&
          node.body.type === "BlockStatement" &&
          node.body.body.length > 0 &&
          node.body.body[0]?.directive === "worklet"
        ) {
          currentCodePath = codePath.id;
          callerIsWorklet = true;
        }
      },
      onCodePathEnd: (codePath, node) => {
        if (codePath.id === currentCodePath) {
          currentCodePath = null;
          callerIsWorklet = false;
        }
      },
      [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression`]: () => {
        callerIsWorklet = true;
      },
      [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression:exit`]: () => {
        callerIsWorklet = false;
      },
      CallExpression: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const name = tsNode.expression.getText();
        if (callerIsWorklet) {
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
