import eslintPlugin from '../src';
import rules from '../src/rules';

function camelToUnderscore(key: string) {
  var result = key.replace( /([A-Z])/g, " $1" );
  return result.split(' ').join('-').toLowerCase();
}

describe('eslint-plugin ("./src/index.ts")', () => {
  const ruleKeys = Object.keys(rules).map(rule => camelToUnderscore(rule));
  const eslintPluginRuleKeys = Object.keys(eslintPlugin.rules);

  it('exports all available rules', () => {
    expect(ruleKeys).toEqual(expect.arrayContaining(eslintPluginRuleKeys));
  });
});