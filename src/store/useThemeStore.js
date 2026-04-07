import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // 'system' | 'light' | 'dark'
      themePreference: 'system',
      
      setThemePreference: (preference) => set({ themePreference: preference }),
      
      toggleTheme: () => {
        const current = get().themePreference;
        if (current === 'system' || current === 'light') {
          set({ themePreference: 'dark' });
        } else {
          set({ themePreference: 'light' });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
