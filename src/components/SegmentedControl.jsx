import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';

export const SegmentedControl = ({ values, selectedIndex, onChange, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
      {values.map((value, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
            style={[
              styles.segment,
              isSelected && { backgroundColor: theme.background, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }
            ]}
          >
            <Text style={[
              styles.text, 
              { color: isSelected ? theme.text : theme.textSecondary }
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
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
