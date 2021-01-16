# JS Function in Worklet (`js-function-in-worklet`)

Disallow to invoke directly functions that live on the JS thread directly from a worklet.

The following example is considered invalid:

```ts
const foo = () => {
  return true;
}

const bar = () => {
  "worklet";
  foo();
}
```

The following example is considered valid:

```ts
const foo = () => {
  "worklet";
  return true;
}

const bar = (cb: () => void) => {
  "worklet";
  const fn = () => false;
  foo();
  cb();
  fn();
}
```