import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/src/theme';

export const SummaryCard = ({ type, amount, caption }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isIncome = type === 'income';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isIncome ? 'rgba(106,228,166,0.16)' : 'rgba(255,122,122,0.16)' },
        ]}
      >
        {isIncome ? <ArrowDownLeft color={theme.success} size={18} /> : <ArrowUpRight color={theme.danger} size={18} />}
      </View>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {isIncome ? 'Income' : 'Expense'}
      </Text>
      <Text style={[styles.amount, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>${amount.toLocaleString()}</Text>
      <Text style={[styles.caption, { color: theme.textMuted }]}>
        {caption ?? (isIncome ? 'Money in this period' : 'Money out this period')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
  },
});
