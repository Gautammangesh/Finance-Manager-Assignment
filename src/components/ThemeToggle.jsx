import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useThemeToggle } from '@/components/useColorScheme';
import { Colors } from '@/src/theme';
import { MotiView } from 'moti';

export const ThemeToggle = ({ style }) => {
  const { isDark, toggleTheme } = useThemeToggle();
  const theme = Colors[isDark ? 'dark' : 'light'];

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={[
        styles.container, 
        { backgroundColor: isDark ? theme.surface : '#F1F5F9' },
        style
      ]}
    >
      <MotiView
        animate={{ 
          rotate: isDark ? '0deg' : '180deg',
          scale: 1,
        }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {isDark ? (
          <Moon color="#FBBF24" size={20} />
        ) : (
          <Sun color="#F59E0B" size={20} />
        )}
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
