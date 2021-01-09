import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import {
  isFunctionDeclaration,
  isBlock,
  isExpressionStatement,
  Identifier,
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
    //const sourceCode = context.getSourceCode();
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    //const compilerOptions = parserServices.program.getCompilerOptions();
    const calleeIsWorklet = (node: TSESTree.CallExpression) => {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const signature = checker.getResolvedSignature(tsNode);
      const decl = signature?.declaration;
      if (decl !== undefined && isFunctionDeclaration(decl)) {
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
    let callerIsWorklet = false;
    return {
      "CallExpression[callee.name='useAnimatedStyle'] > ArrowFunctionExpression": () => {
        callerIsWorklet = true;
      },
      "CallExpression[callee.name='useAnimatedStyle'] > ArrowFunctionExpression:exit": () => {
        callerIsWorklet = false;
      },
      CallExpression: (node) => {
        const { name } = node.callee as TSESTree.Identifier;
        if (callerIsWorklet) {
          if (!calleeIsWorklet(node)) {
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
