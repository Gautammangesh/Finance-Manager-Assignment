import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useFinanceStore } from '@/src/store/useFinanceStore';

export function useColorScheme() {
  const deviceScheme = useNativeColorScheme();
  const themeMode = useFinanceStore((state) => state.themeMode);

  if (themeMode === 'system') {
    return deviceScheme ?? 'light';
  }

  return themeMode;
}
