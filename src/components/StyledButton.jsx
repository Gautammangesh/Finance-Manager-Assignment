import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

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

  const getColors = () => {
    switch (variant) {
      case 'primary': return [theme.primary, theme.secondary];
      case 'secondary': return [theme.secondary, theme.accent];
      case 'danger': return [theme.danger, '#EF4444'];
      default: return [theme.surface, theme.surfaceLighter];
    }
  };

  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[size],
        isOutline && { borderWidth: 1, borderColor: theme.primary },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {!isOutline ? (
        <LinearGradient
          colors={getColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={isOutline ? theme.primary : '#FFF'} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? { color: theme.primary } : { color: '#FFF' },
            size === 'small' && { fontSize: 14 },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 14, paddingHorizontal: 24 },
  large: { paddingVertical: 18, paddingHorizontal: 32 },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});
