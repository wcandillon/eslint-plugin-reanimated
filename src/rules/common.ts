export interface State {
  callerIsWorklet: boolean;
  currentCodePath: string | null;
}

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

export const WORKLET = "worklet";

export const createState = () => ({
  currentCodePath: null,
  callerIsWorklet: false,
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
        node.body.body.length > 0 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node.body.body as any[])[0]?.directive === WORKLET
      ) {
        state.currentCodePath = codePath.id;
        state.callerIsWorklet = true;
      }
    },
    onCodePathEnd: (codePath: { id: string }) => {
      if (codePath.id === state.currentCodePath) {
        state.currentCodePath = null;
        state.callerIsWorklet = false;
      }
    },
    ["CallExpression[callee.name='useAnimatedGestureHandler'] > ObjectExpression"]: () => {
      state.callerIsWorklet = true;
    },
    ["CallExpression[callee.name='useAnimatedGestureHandler'] > ObjectExpression:exit"]: () => {
      state.callerIsWorklet = false;
    },
    [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression`]: () => {
      state.callerIsWorklet = true;
    },
    [`CallExpression[callee.name=${matchFunctions}] > ArrowFunctionExpression:exit`]: () => {
      state.callerIsWorklet = false;
    },
  };
};
