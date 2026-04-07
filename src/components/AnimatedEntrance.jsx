import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const AnimatedEntrance = ({ children, delay = 0, style, offset = 18, scale = 1 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(offset)).current;
  const scaleValue = useRef(new Animated.Value(scale)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 460,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [delay, opacity, scaleValue, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { scale: scaleValue }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
