import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
  const filledTextColor = colorScheme === 'dark' ? '#111111' : '#FFFFFF';

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return Gradients.accent;
      case 'danger':
        return Gradients.danger;
      case 'primary':
      default:
        return colorScheme === 'dark' ? ['#F5F5F4', '#DAD9D4'] : ['#17181C', '#2A2C31'];
    }
  };

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        {
          borderColor: isOutline ? theme.outline : 'transparent',
          backgroundColor: isGhost ? theme.surface : 'transparent',
          shadowColor: theme.shadow,
        },
        isOutline && styles.outlineButton,
        isGhost && { borderColor: theme.outline },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {!isOutline && !isGhost ? (
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fillLayer}
          />
        ) : null}
        {loading ? (
          <ActivityIndicator color={isOutline || isGhost ? theme.text : filledTextColor} />
        ) : (
          <Text
            style={[
              styles.text,
              { color: isOutline || isGhost ? theme.text : filledTextColor },
              size === 'small' && styles.smallText,
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 18,
    elevation: 3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fillLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
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
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
