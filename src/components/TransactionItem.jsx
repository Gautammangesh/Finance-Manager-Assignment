import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { Utensils, Car, ShoppingBag, Film, Briefcase, TrendingUp, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useFinanceStore } from '@/src/store/useFinanceStore';

const ICON_MAP = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  film: Film,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
};

export const TransactionItem = ({ transaction, category, index = 0 }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { deleteTransaction } = useFinanceStore();
  
  const Icon = ICON_MAP[category.icon] || Utensils;
  const isIncome = transaction.type === 'income';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: index * 100 }}
    >
      <TouchableOpacity 
        activeOpacity={0.7} 
        style={[styles.container, { backgroundColor: theme.surface }]}
        onLongPress={() => {
          // Bonus: Long press to delete
          deleteTransaction(transaction.id);
        }}
      >
        <View style={[styles.iconWrapper, { backgroundColor: category.color + '20' }]}>
          <Icon color={category.color} size={20} />
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{category.name}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {transaction.note || 'No note'}
          </Text>
        </View>
        
        <View style={styles.amountWrapper}>
          <Text style={[
            styles.amount, 
            { color: isIncome ? theme.success : theme.danger }
          ]}>
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {new Date(transaction.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  amountWrapper: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    fontWeight: '500',
  },
});
