import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import {
  isFunctionDeclaration,
  isBlock,
  isExpressionStatement,
} from "typescript";
const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/rules/${name}.md`
);
export type Options = [];

export type MessageIds = "JSFunctionInWorklet";

export default createRule<Options, MessageIds>({
  name: "js-function-in-worklet",
  meta: {
    type: "problem",
    docs: {
      description: "non-worklet functions should be invoked via runOnJS",
      category: "Possible Errors",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      JSFunctionInWorklet: "Function is not a worklet. Use runOnJS instead.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    //const sourceCode = context.getSourceCode();
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    //const compilerOptions = parserServices.program.getCompilerOptions();
    return {
      CallExpression: (node) => {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const signature = checker.getResolvedSignature(tsNode);
        const decl = signature?.declaration;
        if (decl !== undefined && isFunctionDeclaration(decl)) {
          if (decl.body && isBlock(decl.body)) {
            const statement = decl.body.statements[0];
            if (statement && isExpressionStatement(statement)) {
              const esNode = parserServices.tsNodeToESTreeNodeMap.get<TSESTree.ExpressionStatement>(
                statement
              );
              const isWorklet = esNode.directive === "worklet";
              console.log({ isWorklet });
            }
          }
        }
      },
    };
  },
});
