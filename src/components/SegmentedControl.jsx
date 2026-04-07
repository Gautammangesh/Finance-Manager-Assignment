import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { ScalePressable } from '@/src/components/ScalePressable';
import { Colors } from '@/src/theme';

export const SegmentedControl = ({ values, selectedIndex, onChange, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        },
        style,
      ]}
    >
      {values.map((value, index) => {
        const isSelected = selectedIndex === index;

        return (
          <ScalePressable
            key={value}
            onPress={() => onChange(index)}
            style={[
              styles.segment,
              isSelected && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isSelected ? theme.background : theme.textSecondary },
              ]}
            >
              {value}
            </Text>
          </ScalePressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    minHeight: 48,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
