import jsFunctionInWorklet from "./js-function-in-worklet";
import unsupportedSyntax from "./unsupported-syntax";
import noMultipleAnimatedStyleUsages from "./no-multiple-animated-style-usages";

const rules = {
  "js-function-in-worklet": jsFunctionInWorklet,
  "unsupported-syntax": unsupportedSyntax,
  "no-multiple-animated-style-usages": noMultipleAnimatedStyleUsages,
};

export default rules;
