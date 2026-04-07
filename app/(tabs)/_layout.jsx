import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/src/theme';
import { Home, Wallet, User } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme ?? 'dark'];
  
  // Tab bar styling based on theme
  const tabBarBg = isDark ? theme.background : '#FFFFFF';
  const activeColor = isDark ? '#FFFFFF' : '#0F172A';
  const inactiveColor = theme.textSecondary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: isDark ? 0 : 1,
          borderTopColor: isDark ? 'transparent' : '#E2E8F0',
          elevation: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          // Shadow for light mode
          ...(isDark ? {} : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home 
              color={color} 
              size={22} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Balances',
          tabBarIcon: ({ color, focused }) => (
            <Wallet 
              color={color} 
              size={22} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User 
              color={color} 
              size={22} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
