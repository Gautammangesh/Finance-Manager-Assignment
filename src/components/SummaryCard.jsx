import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SummaryCard = ({ type, amount, subtitle, index = 0 }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const isIncome = type === 'income';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? theme.surface : '#FFFFFF',
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.divider,
        }
      ]}
    >
      <View style={[
        styles.iconWrapper, 
        { backgroundColor: isIncome ? theme.success + '20' : theme.danger + '20' }
      ]}>
        {isIncome ? (
          <TrendingDown color={theme.success} size={18} />
        ) : (
          <TrendingUp color={theme.danger} size={18} />
        )}
      </View>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {isIncome ? 'INCOME' : 'EXPENSE'}
      </Text>
      <Text style={[styles.amount, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
        ${amount.toLocaleString()}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 6,
    minWidth: (SCREEN_WIDTH - 72) / 2,
    maxWidth: (SCREEN_WIDTH - 48) / 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
  },
});
