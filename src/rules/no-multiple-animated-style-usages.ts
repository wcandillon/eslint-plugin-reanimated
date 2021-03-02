import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { Scope } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { TSESTree } from "@typescript-eslint/experimental-utils/dist/ts-estree";

export type Options = [];
export type MessageIds = "NoMultipleAnimatedStyleUsagesMessage";

const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/docs/${name}.md`;
});

const NoMultipleAnimatedStyleUsagesMessage =
  "{{name}} cannot be used multiple times. Use separate useAnimatedStyle() calls instead.";

const getVariableInScope = (
  name: string,
  scope: Scope.Scope
): Scope.Variable | undefined => {
  const { variables } = scope;
  const variable = variables.find((v) => v.name === name);
  if (variable !== undefined) {
    return variable;
  } else if (scope.type === "function") {
    return undefined;
  } else if (scope.upper === null) {
    return undefined;
  }
  return getVariableInScope(name, scope.upper);
};

export default createRule<Options, MessageIds>({
  name: "no-multiple-animated-style-usages",
  meta: {
    type: "problem",
    docs: {
      description:
        "Animated styles cannot be used multiple times. Call useAnimatedStyle() multiple times instead.",
      category: "Possible Errors",
      recommended: "error",
    },
    schema: [],
    messages: {
      NoMultipleAnimatedStyleUsagesMessage,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const checkIdentifier = (node: TSESTree.Identifier) => {
      const variable = getVariableInScope(node.name, context.getScope());
      const definition = variable?.defs?.[0];
      if (!definition) {
        return;
      }
      if (!definedAnimatedStyles.has(definition)) {
        return;
      }
      const existingIdentifiers = styleDefinitions.get(definition) ?? [];
      styleDefinitions.set(definition, [...existingIdentifiers, node]);
    };

    const definedAnimatedStyles = new Set<Scope.Definition>();
    const styleDefinitions = new Map<Scope.Definition, TSESTree.Identifier[]>();

    return {
      "CallExpression[callee.name='useAnimatedStyle']": (
        node: TSESTree.CallExpression
      ) => {
        const { parent } = node;
        if (!parent) {
          return;
        }
        const declaredVariables = context.getDeclaredVariables(parent);
        const definition = declaredVariables[0]?.defs?.[0];
        if (!definition) {
          return;
        }
        definedAnimatedStyles.add(definition);
      },
      "JSXAttribute[name.name='style'] > JSXExpressionContainer > Identifier": checkIdentifier,
      "JSXAttribute[name.name='style'] > JSXExpressionContainer > ArrayExpression > Identifier": checkIdentifier,
      "Program:exit": () => {
        for (const [, identifiers] of styleDefinitions) {
          if (identifiers.length < 2) {
            continue;
          }

          identifiers.forEach((identifier) => {
            context.report({
              messageId: "NoMultipleAnimatedStyleUsagesMessage",
              node: identifier,
              data: {
                name: identifier.name,
              },
            });
          });
        }
      },
    };
  },
});
