# Unsupported Syntax (`unsupported-syntax`)

Currently, there are some syntaxes which aren't supported within worklets: `for in/of`, array and object destructuring, and the spread operator.

The following example is considered invalid:

```ts
const bar = () => {
  "worklet";
  const {x} = { x: 1 };
  clamp(1, ...[1, 2]);
}
```
