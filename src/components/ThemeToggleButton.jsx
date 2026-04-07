import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors } from '@/src/theme';

export const ThemeToggleButton = ({ style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const setThemeMode = useFinanceStore((state) => state.setThemeMode);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setThemeMode(colorScheme === 'dark' ? 'light' : 'dark')}
      style={[
        styles.button,
        {
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        },
        style,
      ]}
    >
      {colorScheme === 'dark' ? (
        <Sun color={theme.text} size={18} />
      ) : (
        <Moon color={theme.text} size={18} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
