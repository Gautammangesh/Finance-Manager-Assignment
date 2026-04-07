import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SegmentedControl = ({ values, selectedIndex, onChange, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? theme.surface : theme.surfaceLighter,
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.divider,
      }, 
      style
    ]}>
      {values.map((value, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
            style={[
              styles.segment,
              isSelected && { 
                backgroundColor: isDark ? theme.background : '#FFFFFF',
                shadowColor: '#000', 
                shadowOpacity: isDark ? 0.1 : 0.08, 
                shadowRadius: 4, 
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }
            ]}
          >
            <Text style={[
              styles.text, 
              { 
                color: isSelected 
                  ? (isDark ? '#FFFFFF' : '#0F172A') 
                  : theme.textSecondary,
                fontWeight: isSelected ? '600' : '500',
              }
            ]}>
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    height: 48,
    maxWidth: SCREEN_WIDTH - 48,
    alignSelf: 'center',
    width: '100%',
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
});
