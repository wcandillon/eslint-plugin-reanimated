[![NPM](https://img.shields.io/npm/v/eslint-plugin-reanimated)](https://www.npmjs.com/package/eslint-plugin-reanimated) [![CI & CD](https://github.com/wcandillon/eslint-plugin-reanimated/workflows/CI%20&%20CD/badge.svg)](https://github.com/wcandillon/eslint-plugin-reanimated/actions?query=branch%3Amaster)

The goal of this plugin is to help you when writing animation worklets with Reanimated.

## Installation

This plugin requires your project to use TypeScript (>=4.1.3).

## Example Configuration

The plugin relies on TypeScript compiler services to resolve types.
You need to set your `tsconfig.json` file in your eslint configuration via `parserOptions`.

```json
{
  "extends": "react-native-wcandillon",
  "plugins": ["reanimated"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "reanimated/js-function-in-worklet": 2,
  }
}
```

## Rules
* [js-function-in-worklet](https://github.com/wcandillon/eslint-plugin-reanimated/blob/master/docs/js-function-in-worklet.md)