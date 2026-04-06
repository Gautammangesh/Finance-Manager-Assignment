import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

export const SummaryCard = ({ type, amount }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isIncome = type === 'income';

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.iconWrapper, { backgroundColor: isIncome ? theme.success + '20' : theme.danger + '20' }]}>
        {isIncome ? (
          <TrendingUp color={theme.success} size={20} />
        ) : (
          <TrendingDown color={theme.danger} size={20} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {isIncome ? 'Total Income' : 'Total Expense'}
        </Text>
        <Text style={[styles.amount, { color: theme.text }]}>
          ${amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
