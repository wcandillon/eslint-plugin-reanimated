import eslintPlugin from '../src';
import rules from '../src/rules';

describe('eslint-plugin ("./src/index.ts")', () => {
  const ruleKeys = Object.keys(rules);
  const eslintPluginRuleKeys = Object.keys(eslintPlugin.rules);

  it('exports all available rules', () => {
    expect(ruleKeys).toEqual(expect.arrayContaining(eslintPluginRuleKeys));
  });
});