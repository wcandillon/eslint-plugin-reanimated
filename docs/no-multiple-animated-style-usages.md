# No multiple animated style (`no-multiple-animated-style-usages`)

Disallow to use an animated style in multiple components

The following example is considered invalid:

```ts
const style = useAnimatedStyle(() => {});
return (
  <>
    <Animated.View style={style} />
    <Animated.View style={style} />
  </>
);
```
