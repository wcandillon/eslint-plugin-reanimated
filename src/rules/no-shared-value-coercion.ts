import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { TSESTree } from "@typescript-eslint/experimental-utils/dist/ts-estree";

export type Options = [];
export type MessageIds =
  | "NoSharedValueCoercionBooleanMessage"
  | "NoSharedValueCoercionStringMessage";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/docs/${name}.md`;
});

const NoSharedValueCoercionBooleanMessage = "Did you mean `{{name}}.value`?";

const NoSharedValueCoercionStringMessage =
  "Did you mean `{{name}}.value`? Otherwise use `{{name}}.toString()` to be explicit.";

type CoercionType = "boolean" | "string";
const MESSAGES: Record<CoercionType, MessageIds> = {
  boolean: "NoSharedValueCoercionBooleanMessage",
  string: "NoSharedValueCoercionStringMessage",
};
const getMessageId = (coercionType: CoercionType): MessageIds =>
  MESSAGES[coercionType];

export default createRule<Options, MessageIds>({
  name: "no-shared-value-coercion",
  meta: {
    type: "problem",
    docs: {
      description:
        'Catch uses of "raw" shared values instead of their value property.',
      category: "Possible Errors",
      recommended: "error",
    },
    schema: [],
    messages: {
      NoSharedValueCoercionBooleanMessage,
      NoSharedValueCoercionStringMessage,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    const checkNode = (
      node: TSESTree.Node,
      coercionType: "boolean" | "string"
    ) => {
      if (node.type !== "Identifier") {
        return;
      }
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const typeString = checker.typeToString(
        checker.getTypeAtLocation(tsNode)
      );
      if (!/\bSharedValue<.*>$/.test(typeString)) {
        return;
      }

      context.report({
        messageId: getMessageId(coercionType),
        node,
        data: {
          name: node.name,
        },
      });
    };

    return {
      ConditionalExpression: ({ test }) => {
        checkNode(test, "boolean");
      },
      IfStatement: ({ test }) => {
        checkNode(test, "boolean");
      },
      LogicalExpression: ({ left, right }) => {
        checkNode(left, "boolean");
        checkNode(right, "boolean");
      },
      TemplateLiteral: ({ expressions }) => {
        expressions.map((expression) => {
          checkNode(expression, "string");
        });
      },
    };
  },
});
