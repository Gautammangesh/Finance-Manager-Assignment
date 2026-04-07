import { View, TextInput, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';

export const StyledInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  style,
  inputStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';

  const inputHeight = multiline ? Math.max(56, numberOfLines * 24 + 32) : 56;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          { 
            backgroundColor: isDark ? theme.surface : '#FFFFFF',
            borderColor: error ? theme.danger : (isDark ? theme.divider : '#E2E8F0'),
            height: inputHeight,
          },
          multiline && { height: inputHeight, paddingVertical: 12 },
          error && styles.errorBorder,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[
            styles.input, 
            { color: isDark ? '#FFFFFF' : '#0F172A' },
            multiline && { height: inputHeight - 24 },
            inputStyle,
          ]}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
