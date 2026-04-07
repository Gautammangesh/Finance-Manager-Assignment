import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Briefcase, Car, Film, ShoppingBag, Star, TrendingUp, Utensils, Trash2 } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedEntrance } from '@/src/components/AnimatedEntrance';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors } from '@/src/theme';

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
  const Icon = ICON_MAP[category?.icon] || Utensils;
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    deleteTransaction(transaction.id);
  };
  
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={[styles.deleteAction, { backgroundColor: theme.danger }]}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Trash2 color="#FFFFFF" size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <AnimatedEntrance delay={index * 70}>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={() =>
            Alert.alert(
              'Delete transaction',
              'This transaction will be removed from your timeline and balance.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(transaction.id) },
              ]
            )
          }
          style={[
            styles.container,
            {
              backgroundColor: theme.surface,
              borderColor: theme.outline,
            },
          ]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: `${category?.color ?? theme.secondary}22` }]}>
            <Icon color={category?.color ?? theme.secondary} size={18} />
          </View>
  
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.text }]}>{category?.name ?? 'General'}</Text>
              <View style={styles.badge}>
                <Star color={theme.textMuted} size={12} />
              </View>
            </View>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {transaction.note || (isIncome ? 'Income transfer' : 'Tracked expense')}
            </Text>
          </View>
  
          <View style={styles.amountWrapper}>
            <Text style={[styles.amount, { color: theme.text }]}>
              {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
            </Text>
            <Text style={[styles.date, { color: theme.textMuted }]}>
              {new Date(transaction.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </AnimatedEntrance>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    textTransform: 'uppercase',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  amountWrapper: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
  },
  swipeableContainer: {
    borderRadius: 22,
    marginBottom: 12,
  },
  deleteAction: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginLeft: 10,
  },
});
