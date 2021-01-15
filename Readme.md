![CI & CD](https://github.com/wcandillon/eslint-plugin-reanimated/workflows/CI%20&%20CD/badge.svg)

# Installation

This plugin requires your project to use TypeScript (>=4.1.3).

# Example Configuration

The parserOptions is mandatory to resolve types.

```json
{
  "extends": "react-native-wcandillon",
  "plugins": ["reanimated"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "reanimated/js-function-in-worklet": 2,
  }
}
```
