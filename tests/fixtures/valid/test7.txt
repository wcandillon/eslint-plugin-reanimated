import React, { forwardRef, Ref, useImperativeHandle } from "react";
import { StyleSheet, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

import Profile, { ProfileModel, α } from "./Profile";

const { width, height } = Dimensions.get("window");

const A = Math.round(width * Math.cos(α) + height * Math.sin(α));
const snapPoints = [-A, 0, A];

export interface SwipeHandler {
  swipeLeft: () => void;
  swipeRight: () => void;
}

interface SwiperProps {
  onSwipe: () => void;
  profile: ProfileModel;
  scale: Animated.SharedValue<number>;
  onTop: boolean;
}

const swipe = (
  translateX: Animated.SharedValue<number>,
  dest: number,
  velocity: number,
  cb: () => void
) => {
  "worklet";
  translateX.value = withSpring(
    dest,
    {
      velocity,
      overshootClamping: dest === 0 ? false : true,
      restSpeedThreshold: dest === 0 ? 0.01 : 100,
      restDisplacementThreshold: dest === 0 ? 0.01 : 100,
    },
    () => {
      if (dest !== 0) {
        runOnJS(cb)();
      }
    }
  );
};
const Swiper = (
  { onSwipe, profile, scale, onTop }: SwiperProps,
  ref: Ref<SwipeHandler>
) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    swipeLeft: () => {
      swipe(translateX, -A, 5, onSwipe);
    },
    swipeRight: () => {
      swipe(translateX, A, 5, onSwipe);
    },
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({ translationX, translationY }, { x, y }) => {
      translateX.value = x + translationX;
      translateY.value = y + translationY;
      scale.value = interpolate(
        translateX.value,
        [-width / 4, 0, width / 4],
        [1, 0.95, 1],
        Extrapolate.CLAMP
      );
    },
    onEnd: ({ velocityX, velocityY }) => {
      const dest = snapPoint(translateX.value, velocityX, snapPoints);
      swipe(translateX, dest, 5, onSwipe);
      translateY.value = withSpring(0, { velocity: velocityY });
    },
  });
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Profile
          profile={profile}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          onTop={onTop}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default forwardRef(Swiper);
