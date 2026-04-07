import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/src/theme';

export const UndoToast = ({ title, description, onUndo }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.outline,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onUndo}
        style={[styles.undoButton, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.undoText, { color: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
          Undo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  textWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  undoButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
