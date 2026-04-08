import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Ghost, Plus, Search, Sparkles, TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedEntrance } from '@/src/components/AnimatedEntrance';
import { GradientBankCard } from '@/src/components/GradientBankCard';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { SummaryCard } from '@/src/components/SummaryCard';
import { StyledInput } from '@/src/components/StyledInput';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { TransactionItem } from '@/src/components/TransactionItem';
import { UndoToast } from '@/src/components/UndoToast';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors, Gradients } from '@/src/theme';

const EXPENSE_FILTERS = ['Weekly', 'Monthly'];

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const formatCurrency = (value) => `$${Math.abs(Math.round(value)).toLocaleString()}`;

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const {
    user,
    transactions,
    categories,
    pendingUndoTransaction,
    restoreLastDeletedTransaction,
    clearPendingUndoTransaction,
  } = useFinanceStore();
  const [expenseFilter, setExpenseFilter] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { incomeTotal, expenseTotal, filteredExpenseTransactions, insight } = useMemo(() => {
    const today = startOfDay(new Date());
    const periodLength = expenseFilter === 0 ? 7 : 30;
    const periodStart = new Date(today);
    periodStart.setDate(today.getDate() - (periodLength - 1));
    const previousPeriodStart = new Date(periodStart);
    previousPeriodStart.setDate(periodStart.getDate() - periodLength);

    const visibleTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return !Number.isNaN(transactionDate.getTime()) && transactionDate >= periodStart;
    });

    const previousTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        !Number.isNaN(transactionDate.getTime()) &&
        transactionDate >= previousPeriodStart &&
        transactionDate < periodStart
      );
    });

    const matchingExpenses = visibleTransactions
      .filter((transaction) => transaction.type === 'expense')
      .filter((transaction) => {
        if (!searchQuery.trim()) return true;
        const category = categories.find((item) => item.id === transaction.category);
        const searchTarget = `${transaction.note ?? ''} ${category?.name ?? ''}`.toLowerCase();
        return searchTarget.includes(searchQuery.trim().toLowerCase());
      });

    const nextIncomeTotal = visibleTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const nextExpenseTotal = visibleTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const previousExpenseTotal = previousTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const categoryTotals = visibleTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((accumulator, transaction) => {
        accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount;
        return accumulator;
      }, {});

    const topCategoryEntry = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
    const topCategory = topCategoryEntry
      ? categories.find((category) => category.id === topCategoryEntry[0])
      : null;

    const expenseDelta = nextExpenseTotal - previousExpenseTotal;
    const expenseDeltaPercent = previousExpenseTotal > 0
      ? Math.round((Math.abs(expenseDelta) / previousExpenseTotal) * 100)
      : 0;

    let nextInsight = {
      tone: 'neutral',
      title: 'Build your money rhythm',
      body: 'Add a few more transactions and this card will start surfacing smarter weekly patterns.',
      badge: expenseFilter === 0 ? 'Weekly insight' : 'Monthly insight',
      icon: Sparkles,
    };

    if (topCategory && topCategoryEntry?.[1] > 0) {
      nextInsight = {
        tone: 'warning',
        title: `${topCategory.name} is leading your spend`,
        body: `${formatCurrency(topCategoryEntry[1])} went to ${topCategory.name.toLowerCase()} in this ${expenseFilter === 0 ? 'week' : 'month'}.`,
        badge: 'Top category',
        icon: Wallet,
      };
    }

    if (previousExpenseTotal > 0 && expenseDelta !== 0) {
      nextInsight = {
        tone: expenseDelta < 0 ? 'success' : 'warning',
        title: expenseDelta < 0 ? 'Spending is trending down' : 'Spending picked up',
        body: `${expenseDeltaPercent}% ${expenseDelta < 0 ? 'less' : 'more'} than the previous ${expenseFilter === 0 ? 'week' : 'month'} (${formatCurrency(previousExpenseTotal)} before).`,
        badge: expenseDelta < 0 ? 'Positive shift' : 'Watch pace',
        icon: expenseDelta < 0 ? TrendingDown : TrendingUp,
      };
    }

    if (nextIncomeTotal > nextExpenseTotal && nextExpenseTotal > 0) {
      nextInsight = {
        tone: 'success',
        title: 'You stayed cash-flow positive',
        body: `Income outpaced expenses by ${formatCurrency(nextIncomeTotal - nextExpenseTotal)} in this ${expenseFilter === 0 ? 'week' : 'month'}.`,
        badge: 'Healthy balance',
        icon: TrendingUp,
      };
    }

    return {
      incomeTotal: nextIncomeTotal,
      expenseTotal: nextExpenseTotal,
      filteredExpenseTransactions: matchingExpenses.slice(0, 4),
      insight: nextInsight,
    };
  }, [categories, expenseFilter, searchQuery, transactions]);

  const InsightIcon = insight.icon;
  const insightAccent = insight.tone === 'success'
    ? theme.success
    : insight.tone === 'warning'
      ? theme.warning
      : theme.accent;

  useEffect(() => {
    if (!pendingUndoTransaction) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      clearPendingUndoTransaction();
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [clearPendingUndoTransaction, pendingUndoTransaction]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={colorScheme === 'dark' ? Gradients.surface : ['#FFFFFF', '#F3F4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image
              source={require('@/assets/images/tuf-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={[styles.brandName, { color: theme.text }]}>TUF</Text>
              <Text style={[styles.headerMeta, { color: theme.textMuted }]}>Premium finance cockpit</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <ThemeToggleButton />
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.outline }]}
              onPress={() => setShowSearch((value) => !value)}
            >
              <Search color={theme.text} size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Bell color={theme.text} size={18} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <AnimatedEntrance delay={40}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hey, {user.name.split(' ')[0]}</Text>
          <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
            Here's your financial pulse for today.
          </Text>
        </AnimatedEntrance>

        {showSearch ? (
          <AnimatedEntrance delay={70}>
            <StyledInput
              label="Search expenses"
              placeholder="Search by note or category"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              style={styles.searchInput}
            />
          </AnimatedEntrance>
        ) : null}

        <AnimatedEntrance delay={120} style={styles.cardSection} scale={0.96}>
          <GradientBankCard balance={user.balance} name={user.name} />
        </AnimatedEntrance>

        <AnimatedEntrance delay={180} style={styles.summaryRow}>
          <SummaryCard type="income" amount={user.balance} label="Balance" caption="Available now" />
          <SummaryCard type="expense" amount={expenseTotal} caption="Spent this view" />
        </AnimatedEntrance>

        <AnimatedEntrance
          delay={220}
          style={[
            styles.insightCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.outline,
              shadowColor: theme.shadow,
            },
          ]}
          scale={0.98}
        >
          <LinearGradient
            colors={colorScheme === 'dark' ? ['rgba(87,210,196,0.18)', 'rgba(139,124,255,0.06)'] : ['rgba(31,168,150,0.12)', 'rgba(101,88,245,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.insightHeader}>
            <View style={[styles.insightIconWrap, { backgroundColor: `${insightAccent}20` }]}>
              <InsightIcon color={insightAccent} size={18} />
            </View>
            <View style={[styles.insightBadge, { backgroundColor: `${insightAccent}18` }]}>
              <Text style={[styles.insightBadgeText, { color: insightAccent }]}>{insight.badge}</Text>
            </View>
          </View>
          <Text style={[styles.insightTitle, { color: theme.text }]}>{insight.title}</Text>
          <Text style={[styles.insightBody, { color: theme.textSecondary }]}>{insight.body}</Text>
        </AnimatedEntrance>

        <AnimatedEntrance delay={260} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your expenses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>See all</Text>
          </TouchableOpacity>
        </AnimatedEntrance>

        <AnimatedEntrance delay={320}>
          <SegmentedControl
            values={EXPENSE_FILTERS}
            selectedIndex={expenseFilter}
            onChange={setExpenseFilter}
            style={styles.segmentControl}
          />
        </AnimatedEntrance>

        {filteredExpenseTransactions.length > 0 ? (
          filteredExpenseTransactions.map((transaction, index) => {
            const category = categories.find((item) => item.id === transaction.category) || categories[0];
            return (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={category}
                index={index}
              />
            );
          })
        ) : (
          <AnimatedEntrance delay={340}>
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Ghost color={theme.textSecondary} size={48} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No expenses yet</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Your financial journey starts with the first tap. Add an expense to see your pulse!
              </Text>
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/add-transaction')}
              >
                <Text style={[styles.emptyButtonText, { color: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
                  Add Transaction
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedEntrance>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.9}
        onPress={() => router.push('/add-transaction')}
      >
        <Plus color={colorScheme === 'dark' ? '#121212' : '#FFFFFF'} size={26} />
      </TouchableOpacity>

      {pendingUndoTransaction ? (
        <UndoToast
          title="Transaction removed"
          description={`${pendingUndoTransaction.note || 'Recent transaction'} was deleted from your timeline.`}
          onUndo={restoreLastDeletedTransaction}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4D57',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 22,
  },
  searchInput: {
    marginBottom: 8,
  },
  cardSection: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 18,
  },
  insightCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 26,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  insightIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  insightBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  insightBody: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
  segmentControl: {
    marginBottom: 16,
  },
  emptyState: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 26,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.24,
        shadowRadius: 22,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});
