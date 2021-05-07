# No implicit shared value coercion (`no-shared-value-coercion`)

Flag accidental coercion of "raw" shared values to boolean/string where the
intent was to refer to `.value` property

The following examples are considered invalid:

```ts
const foo = useSharedValue(true);
const bar = useDerivedValue(() => foo ? 1 : 0);
```

```ts
const foo = useSharedValue(true);
const bar = useDerivedValue(() => {
  if (foo) {
    return 1;
  } else {
    return 0;
  }
});
```

```ts
const foo = useSharedValue(true);
const bar = useDerivedValue(() => {
  if (foo || somethingElse()) {
    return 1;
  } else {
    return 0;
  }
});
```

```ts
const foo = useSharedValue('foo');
const bar = useDerivedValue(() =>
  `${foo}baz`
);
```

The following examples are considered valid:

```ts
const foo = useSharedValue(true);
const bar = useDerivedValue(() => foo.value ? 1 : 0);
```

```ts
const foo = useSharedValue(true);
const bar = useDerivedValue(() => !!foo ? 1 : 0);
```

```ts
const foo = useSharedValue('foo');
const bar = useDerivedValue(() =>
  `${foo.value}baz`
);
```

```ts
const foo = useSharedValue('foo');
const bar = useDerivedValue(() =>
  `${foo.toString()}baz`
);
```
