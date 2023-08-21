export interface State {
  callerIsWorklet: boolean;
  callerIsObjectHook: boolean;
  currentCodePath: string | null;
}

const functionHooks = new Map([
  ["useFrameCallback", [0]],
  ["useAnimatedStyle", [0]],
  ["useAnimatedProps", [0]],
  ["createAnimatedPropAdapter", [0]],
  ["useDerivedValue", [0]],
  ["useAnimatedScrollHandler", [0]],
  ["useAnimatedReaction", [0, 1]],
  ["useWorkletCallback", [0]],
  ["withTiming", [2]],
  ["withSpring", [2]],
  ["withDecay", [1]],
  ["withRepeat", [3]],
  ["runOnUI", [0]],
]);

const objectHooks = new Set([
  "useAnimatedGestureHandler",
  "useAnimatedScrollHandler",
]);

const functionNames = Array.from(functionHooks.keys());
const matchFunctions = `/${functionNames.join("|")}/`;

const objectNames = Array.from(objectHooks.keys());
const matchObjects = `/${objectNames.join("|")}/`;

export const WORKLET = "worklet";

export const createState = () => ({
  currentCodePath: null,
  callerIsWorklet: false,
  callerIsObjectHook: false,
});

export const detectWorklet = (state: State) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCodePathStart: (...args: any[]) => {
      const [codePath, node] = args;
      if (
        (node.type === "ArrowFunctionExpression" ||
          node.type === "FunctionDeclaration") &&
        node.body.type === "BlockStatement" &&
        node.body.body.length > 0
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((node.body.body as any[])[0]?.directive === WORKLET) {
          state.currentCodePath = codePath.id;
          state.callerIsWorklet = true;
        }
      }
    },
    onCodePathEnd: (codePath: { id: string }) => {
      if (codePath.id === state.currentCodePath) {
        state.currentCodePath = null;
        state.callerIsWorklet = false;
        state.callerIsObjectHook = false;
      }
    },
    [`CallExpression[callee.name=${matchObjects}] > ObjectExpression`]: () => {
      state.callerIsObjectHook = true;
    },
    [`CallExpression[callee.name=${matchObjects}] > ObjectExpression:exit`]:
      () => {
        state.callerIsObjectHook = false;
      },
    ["BlockStatement"]: () => {
      if (state.callerIsObjectHook) {
        state.callerIsWorklet = true;
      }
    },
    ["BlockStatement:exit"]: () => {
      if (state.callerIsObjectHook) {
        state.callerIsWorklet = false;
      }
    },
    [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression`]:
      () => {
        state.callerIsWorklet = true;
      },
    [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression:exit`]:
      () => {
        state.callerIsWorklet = false;
      },
  };
};
