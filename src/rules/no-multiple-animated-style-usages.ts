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
    const animatedStyleReferences = new Map<
      Scope.Variable,
      TSESTree.Identifier[]
    >();
    const checkIdentifier = (node: TSESTree.Identifier) => {
      const found = Array.from(
        animatedStyleReferences.keys()
      ).find(({ references }) =>
        references.map(({ identifier }) => identifier).includes(node)
      );
      if (!found) {
        return;
      }
      animatedStyleReferences.set(
        found,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [...animatedStyleReferences.get(found)!, node]
      );
    };

    return {
      "CallExpression[callee.name='useAnimatedStyle']": (
        node: TSESTree.CallExpression
      ) => {
        const { parent } = node;
        if (!parent) {
          return;
        }
        const declaredVariables = context.getDeclaredVariables(parent);
        const [variable] = declaredVariables;
        if (!variable) {
          return;
        }
        animatedStyleReferences.set(variable, []);
      },
      "JSXAttribute Identifier": checkIdentifier,
      "Program:exit": () => {
        for (const [, identifiers] of animatedStyleReferences) {
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
