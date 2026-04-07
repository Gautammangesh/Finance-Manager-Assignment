import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

export const ScalePressable = ({ children, style, onPress, disabled, activeOpacityScale = 0.97, ...props }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 28,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        {...props}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animateTo(activeOpacityScale)}
        onPressOut={() => animateTo(1)}
        style={styles.pressable}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
