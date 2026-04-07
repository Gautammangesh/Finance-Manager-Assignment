import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
  const isDark = colorScheme === 'dark';

  const getColors = () => {
    switch (variant) {
      case 'primary': return [theme.primary, theme.secondary];
      case 'secondary': return [theme.secondary, theme.accent];
      case 'danger': return [theme.danger, '#EF4444'];
      case 'ghost': return ['transparent', 'transparent'];
      default: return [theme.surface, theme.surfaceLighter];
    }
  };

  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[size],
        isOutline && { 
          borderWidth: 1.5, 
          borderColor: isDark ? theme.primary : theme.divider,
          backgroundColor: isDark ? 'transparent' : '#FFFFFF',
        },
        isGhost && { backgroundColor: 'transparent' },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {!isOutline && !isGhost ? (
        <LinearGradient
          colors={getColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? theme.primary : '#FFF'} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline || isGhost 
              ? { color: isDark ? theme.primary : '#0F172A' } 
              : { color: '#FFF' },
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
  small: { paddingVertical: 8, paddingHorizontal: 16, height: 40 },
  medium: { paddingVertical: 14, paddingHorizontal: 24, height: 52 },
  large: { paddingVertical: 18, paddingHorizontal: 32, height: 60 },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});
