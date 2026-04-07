import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '../src/store/useThemeStore';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const { themePreference } = useThemeStore();
  
  if (themePreference === 'system') {
    return systemColorScheme || 'dark';
  }
  
  return themePreference;
}

export function useThemeToggle() {
  const { themePreference, setThemePreference, toggleTheme } = useThemeStore();
  const systemColorScheme = useSystemColorScheme();
  
  const currentTheme = themePreference === 'system' 
    ? (systemColorScheme || 'dark') 
    : themePreference;
  
  return {
    themePreference,
    currentTheme,
    setThemePreference,
    toggleTheme,
    isDark: currentTheme === 'dark',
  };
}
