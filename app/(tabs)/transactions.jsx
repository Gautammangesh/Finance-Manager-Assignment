import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ghost, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LineChart, PieChart } from 'react-native-gifted-charts';

import { useColorScheme } from '@/components/useColorScheme';
import { BalanceGauge } from '@/src/components/BalanceGauge';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { StyledInput } from '@/src/components/StyledInput';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { TransactionItem } from '@/src/components/TransactionItem';
import { UndoToast } from '@/src/components/UndoToast';
import { Colors, Gradients } from '@/src/theme';
import { useFinanceStore } from '@/src/store/useFinanceStore';

const FILTER_OPTIONS = ['Weekly', 'Monthly', 'Yearly'];
const TRANSACTION_FILTERS = ['All', 'Income', 'Expense'];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const getFilterMeta = (filterIndex) => {
  const today = startOfDay(new Date());
  const startDate = new Date(today);

  if (filterIndex === 1) {
    startDate.setMonth(today.getMonth() - 1);
    return { startDate, sectionTitle: 'Monthly Activity', windowLabel: 'this month' };
  }

  if (filterIndex === 2) {
    startDate.setFullYear(today.getFullYear() - 1);
    return { startDate, sectionTitle: 'Yearly Activity', windowLabel: 'this year' };
  }

  startDate.setDate(today.getDate() - 6);
  return { startDate, sectionTitle: 'Weekly Activity', windowLabel: 'this week' };
};

const formatMoney = (value) => `$${Math.round(value).toLocaleString()}`;

const getBucketLabel = (date, filterIndex) => {
  if (filterIndex === 2) {
    return date.toLocaleDateString(undefined, { month: 'short' });
  }

  if (filterIndex === 1) {
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }

  return date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
};

export default function TransactionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { width } = useWindowDimensions();
  const {
    transactions,
    categories,
    user,
    pendingUndoTransaction,
    restoreLastDeletedTransaction,
    clearPendingUndoTransaction,
  } = useFinanceStore();
  const [filterIndex, setFilterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('All');

  const {
    filteredTransactions,
    expenseTotal,
    incomeTotal,
    sectionTitle,
    windowLabel,
    spendBars,
    topCategories,
    pieData,
    lineData,
    moneyScore,
    scoreTone,
    scoreCaption,
  } = useMemo(() => {
    const { startDate, sectionTitle: nextSectionTitle, windowLabel: nextWindowLabel } = getFilterMeta(filterIndex);
    const visibleTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return !Number.isNaN(transactionDate.getTime()) && transactionDate >= startDate;
    });

    const nextExpenseTotal = visibleTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const nextIncomeTotal = visibleTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const groupedCategories = categories
      .map((category) => {
        const amount = visibleTransactions
          .filter((transaction) => transaction.type === 'expense' && transaction.category === category.id)
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
          ...category,
          amount,
          share: nextExpenseTotal > 0 ? Math.round((amount / nextExpenseTotal) * 100) : 0,
        };
      })
      .filter((category) => category.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    const today = startOfDay(new Date());
    const bucketCount = 6;
    const bucketDates = Array.from({ length: bucketCount }, (_, index) => {
      const date = new Date(today);
      if (filterIndex === 1) {
        date.setDate(today.getDate() - (bucketCount - 1 - index) * 5);
      } else if (filterIndex === 2) {
        date.setMonth(today.getMonth() - (bucketCount - 1 - index) * 2);
      } else {
        date.setDate(today.getDate() - (bucketCount - 1 - index));
      }
      return date;
    });

    const bucketMap = bucketDates.map((date) => ({
      key: date.toISOString().split('T')[0],
      label: getBucketLabel(date, filterIndex),
      income: 0,
      expense: 0,
    }));

    visibleTransactions.forEach((transaction) => {
      const transactionDate = startOfDay(new Date(transaction.date));
      if (Number.isNaN(transactionDate.getTime())) return;

      let distance;
      if (filterIndex === 2) {
        distance =
          (today.getFullYear() - transactionDate.getFullYear()) * 12 +
          (today.getMonth() - transactionDate.getMonth());
      } else {
        distance = Math.floor((today - transactionDate) / DAY_IN_MS);
      }

      const bucketOffset = filterIndex === 2 ? Math.floor(distance / 2) : filterIndex === 1 ? Math.floor(distance / 5) : distance;
      const targetIndex = bucketCount - 1 - Math.min(bucketCount - 1, Math.max(bucketOffset, 0));
      const targetBucket = bucketMap[targetIndex];

      if (!targetBucket) return;

      if (transaction.type === 'income') {
        targetBucket.income += transaction.amount;
      } else {
        targetBucket.expense += transaction.amount;
      }
    });

    const maxBarTotal = Math.max(...bucketMap.map((item) => item.income + item.expense), 1);
    const nextSpendBars = bucketMap.map((item) => ({
      ...item,
      fillHeight: ((item.income + item.expense) / maxBarTotal) * 156,
    }));
    const nextLineData = bucketMap.map((item) => ({
      value: item.income - item.expense,
      label: item.label,
      dataPointText: '',
    }));

    const savingsRatio = nextIncomeTotal > 0 ? (nextIncomeTotal - nextExpenseTotal) / nextIncomeTotal : 0;
    const nextScore = Math.max(320, Math.min(830, Math.round(620 + savingsRatio * 180)));
    const nextTone = nextScore >= 730 ? 'strong' : nextScore >= 640 ? 'average' : 'watch';
    const nextCaption =
      nextTone === 'strong'
        ? 'Your money control is strong'
        : nextTone === 'average'
          ? 'Your money control is average'
          : 'Your budget needs attention';

    return {
      filteredTransactions: visibleTransactions,
      expenseTotal: nextExpenseTotal,
      incomeTotal: nextIncomeTotal,
      sectionTitle: nextSectionTitle,
      windowLabel: nextWindowLabel,
      spendBars: nextSpendBars,
      topCategories: groupedCategories,
      pieData: groupedCategories.map((category) => ({
        value: category.amount,
        color: category.color,
        text: category.name,
      })),
      lineData: nextLineData,
      moneyScore: nextScore,
      scoreTone: nextTone,
      scoreCaption: nextCaption,
    };
  }, [categories, filterIndex, transactions]);

  const displayTransactions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return filteredTransactions.filter((transaction) => {
      if (transactionFilter !== 'All' && transaction.type !== transactionFilter.toLowerCase()) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const category = categories.find((item) => item.id === transaction.category);
      const searchTarget = [
        transaction.note,
        category?.name,
        transaction.type,
        new Date(transaction.date).toLocaleDateString(),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchTarget.includes(normalizedSearch);
    });
  }, [categories, filteredTransactions, searchQuery, transactionFilter]);

  useEffect(() => {
    if (!pendingUndoTransaction) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      clearPendingUndoTransaction();
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [clearPendingUndoTransaction, pendingUndoTransaction]);

  const accentColor =
    scoreTone === 'strong' ? theme.success : scoreTone === 'average' ? theme.warning : theme.danger;
  const latestBar = spendBars[spendBars.length - 1];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={colorScheme === 'dark' ? Gradients.cardAurora : ['#FFFFFF', '#F0F3F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <FlatList
        data={displayTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Your Balances</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  A project-focused view of your score, category mix, and spend pace
                </Text>
              </View>
              <ThemeToggleButton />
            </View>

            <SegmentedControl
              values={FILTER_OPTIONS}
              selectedIndex={filterIndex}
              onChange={setFilterIndex}
              style={styles.segmentControl}
            />

            <View style={[styles.scoreCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <BalanceGauge
                score={moneyScore}
                valueLabel={String(moneyScore)}
                subtitle={scoreCaption}
                detail={`Last sync based on ${windowLabel}`}
                theme={theme}
              />

              <View style={styles.scoreMetrics}>
                <View style={styles.metricBlock}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Available Balance</Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>{formatMoney(user.balance)}</Text>
                </View>
                <View style={styles.metricBlock}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Net Flow</Text>
                  <Text style={[styles.metricValue, { color: accentColor }]}>
                    {incomeTotal - expenseTotal >= 0 ? '+' : '-'}
                    {formatMoney(Math.abs(incomeTotal - expenseTotal))}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.categorySection}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Priority Categories</Text>
              {topCategories.length > 0 ? (
                <View style={[styles.pieCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                  <View style={styles.chartHeaderRow}>
                    <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>Spending by Category</Text>
                    <Text style={[styles.chartLink, { color: theme.warning }]}>View Details</Text>
                  </View>
                  <View style={[styles.pieRow, width < 390 && styles.pieRowStack]}>
                    <View style={styles.pieWrap}>
                      <PieChart
                        data={pieData}
                        donut
                        radius={width < 390 ? 68 : 82}
                        innerRadius={width < 390 ? 48 : 58}
                        innerCircleColor={theme.surface}
                        strokeWidth={0}
                        showText={false}
                        centerLabelComponent={() => (
                          <View style={styles.pieCenter}>
                            <Text style={[styles.pieCenterValue, { color: theme.text }]}>{formatMoney(expenseTotal)}</Text>
                            <Text style={[styles.pieCenterLabel, { color: theme.textSecondary }]}>Spent</Text>
                          </View>
                        )}
                      />
                    </View>

                    <View style={styles.legend}>
                      {topCategories.map((category) => (
                        <View key={category.id} style={styles.legendRow}>
                          <View style={[styles.categoryAccent, { backgroundColor: category.color }]} />
                          <View style={styles.legendCopy}>
                            <Text style={[styles.legendName, { color: theme.text }]}>{category.name}</Text>
                            <Text style={[styles.legendMeta, { color: theme.textSecondary }]}>
                              {category.share}% of all expenses in {windowLabel}
                            </Text>
                          </View>
                          <View style={styles.legendAmountWrap}>
                            <Text style={[styles.legendAmount, { color: theme.text }]}>{formatMoney(category.amount)}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={[styles.emptyCategoryCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                  <View style={[styles.categoryAccent, { backgroundColor: theme.secondary }]} />
                  <View style={styles.emptyCategoryCopy}>
                    <Text style={[styles.emptyCategoryTitle, { color: theme.text }]}>No categories yet</Text>
                    <Text style={[styles.emptyCategoryText, { color: theme.textSecondary }]}>
                      Add an expense to unlock category-wise breakdown here.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={[styles.barCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Spending Pace</Text>
              <Text style={[styles.chartSubtext, { color: theme.textSecondary }]}>
                Stacked bars compare income received and expense usage across {windowLabel}.
              </Text>

              <View style={styles.barGrid}>
                {spendBars.map((bar) => {
                  const total = Math.max(bar.income + bar.expense, 1);
                  const incomeHeight = bar.fillHeight * (bar.income / total);
                  const expenseHeight = bar.fillHeight - incomeHeight;

                  return (
                    <View key={bar.key} style={styles.barSlot}>
                      <View style={[styles.barTrack, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#E9EDF2' }]}>
                        <View style={styles.barFillWrap}>
                          <LinearGradient
                            colors={['#33D7C2', '#67E6C4']}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 0.5, y: 0 }}
                            style={[styles.barExpense, { height: Math.max(bar.expense > 0 ? 12 : 0, expenseHeight) }]}
                          />
                          <LinearGradient
                            colors={['#F0C58A', '#FFF1D4']}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 0.5, y: 0 }}
                            style={[styles.barIncome, { height: Math.max(bar.income > 0 ? 12 : 0, incomeHeight) }]}
                          />
                        </View>
                      </View>
                      <Text style={[styles.barLabel, { color: theme.textMuted }]}>{bar.label}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.barFooter}>
                <Text style={[styles.barFooterText, { color: theme.textSecondary }]}>
                  Current margin: {windowLabel.replace('this ', '')} spend
                </Text>
                <Text style={[styles.barFooterValue, { color: theme.accent }]}>
                  {formatMoney(latestBar?.expense || 0)} / {formatMoney(latestBar?.income || 0)}
                </Text>
              </View>
            </View>

            <View style={[styles.trendCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Cash Flow Trend</Text>
              <Text style={[styles.chartSubtext, { color: theme.textSecondary }]}>
                This line shows whether each bucket stayed positive after expenses.
              </Text>

              <LineChart
                data={lineData}
                areaChart
                curved
                color={theme.secondary}
                startFillColor={theme.secondary}
                endFillColor={theme.secondary}
                startOpacity={0.22}
                endOpacity={0.04}
                thickness={3}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules={false}
                rulesColor={colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(16,17,20,0.08)'}
                yAxisTextStyle={{ color: theme.textMuted, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 11, fontWeight: '600' }}
                spacing={width < 390 ? 34 : 42}
                initialSpacing={8}
                endSpacing={8}
                dataPointsColor={theme.warning}
                dataPointsRadius={4}
                maxValue={Math.max(...lineData.map((item) => Math.max(item.value, 0)), 10)}
                mostNegativeValue={Math.min(...lineData.map((item) => Math.min(item.value, 0)), 0)}
                isAnimated
                animationDuration={800}
              />
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{sectionTitle}</Text>

            <StyledInput
              label="Search transactions"
              placeholder="Search by note, category or type"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              style={styles.searchInput}
            />

            <View style={styles.filterRow}>
              {TRANSACTION_FILTERS.map((filterValue) => {
                const isActive = transactionFilter === filterValue;
                return (
                  <TouchableOpacity
                    key={filterValue}
                    activeOpacity={0.85}
                    onPress={() => setTransactionFilter(filterValue)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? theme.primary : theme.surface,
                        borderColor: theme.outline,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isActive ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : theme.textSecondary },
                      ]}
                    >
                      {filterValue}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          const category = categories.find((categoryItem) => categoryItem.id === item.category) || categories[0];
          return <TransactionItem transaction={item} category={category} index={index} />;
        }}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <Ghost color={theme.textSecondary} size={42} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No matching activity</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Add a few transactions to unlock the balance charts and smart filters.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.9}
        onPress={() => router.push('/add-transaction')}
      >
        <Plus color={colorScheme === 'dark' ? '#121212' : '#FFFFFF'} size={24} />
      </TouchableOpacity>

      {pendingUndoTransaction ? (
        <UndoToast
          title="Transaction removed"
          description={`${pendingUndoTransaction.note || 'Recent transaction'} was deleted from this view.`}
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 280,
    lineHeight: 20,
  },
  segmentControl: {
    marginBottom: 18,
  },
  scoreCard: {
    borderRadius: 30,
    borderWidth: 1,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 18,
    marginBottom: 20,
    overflow: 'visible',
  },
  scoreMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metricBlock: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  categorySection: {
    marginBottom: 20,
  },
  pieCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chartLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieRowStack: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  pieWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  pieCenterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  legend: {
    flex: 1,
    marginLeft: 14,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  legendCopy: {
    flex: 1,
    marginLeft: 12,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  legendMeta: {
    fontSize: 12,
    lineHeight: 18,
  },
  legendAmountWrap: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  categoryAccent: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  emptyCategoryCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emptyCategoryCopy: {
    marginLeft: 12,
    flex: 1,
  },
  emptyCategoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyCategoryText: {
    fontSize: 12,
    lineHeight: 18,
  },
  barCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 22,
  },
  trendCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 22,
  },
  chartSubtext: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: -4,
    marginBottom: 18,
  },
  barGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 190,
    marginBottom: 12,
  },
  barSlot: {
    width: 42,
    alignItems: 'center',
  },
  barTrack: {
    width: 18,
    height: 162,
    borderRadius: 999,
    justifyContent: 'flex-end',
    padding: 2,
  },
  barFillWrap: {
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barExpense: {
    width: '100%',
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  barIncome: {
    width: '100%',
  },
  barLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
  },
  barFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barFooterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  barFooterValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  searchInput: {
    marginBottom: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterChip: {
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
    padding: 32,
    borderRadius: 28,
    borderWidth: 1,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
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
