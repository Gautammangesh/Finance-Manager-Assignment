import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { ScalePressable } from '@/src/components/ScalePressable';
import { Colors, Gradients } from '@/src/theme';

export const StyledButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return Gradients.accent;
      case 'danger':
        return Gradients.danger;
      case 'primary':
      default:
        return Gradients.primary;
    }
  };

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        { borderColor: theme.outline, backgroundColor: isGhost ? theme.surface : 'transparent' },
        isOutline && styles.outlineButton,
        disabled && styles.disabled,
        style,
      ]}
    >
      {!isOutline && !isGhost ? (
        <LinearGradient colors={getColors()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      ) : null}
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? theme.text : (colorScheme === 'dark' ? '#111111' : '#FFFFFF')} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: isOutline || isGhost ? theme.text : (colorScheme === 'dark' ? '#111111' : '#FFFFFF') },
            size === 'small' && styles.smallText,
          ]}
        >
          {title}
        </Text>
      )}
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  small: {
    minHeight: 42,
    paddingHorizontal: 16,
  },
  medium: {
    minHeight: 54,
    paddingHorizontal: 24,
  },
  large: {
    minHeight: 60,
    paddingHorizontal: 28,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
