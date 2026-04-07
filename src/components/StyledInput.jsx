import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/src/theme';

export const StyledInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  style,
  multiline = false,
  autoCapitalize = 'sentences',
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.outline,
            shadowColor: theme.shadow,
          },
          multiline && styles.multilineWrapper,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { color: theme.text },
          ]}
        />
      </View>
      {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  multilineWrapper: {
    minHeight: 90,
    paddingVertical: 12,
  },
  input: {
    fontSize: 15,
    minHeight: 22,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
});
