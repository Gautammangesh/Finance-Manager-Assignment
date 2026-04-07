import React, { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { Ghost } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { TransactionItem } from '@/src/components/TransactionItem';
import { Colors, Gradients } from '@/src/theme';
import { useFinanceStore } from '@/src/store/useFinanceStore';

const FILTER_OPTIONS = ['Weekly', 'Monthly', 'Yearly'];
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
    return { startDate, chartTitle: 'Monthly Spending', sectionTitle: 'Monthly Transactions' };
  }

  if (filterIndex === 2) {
    startDate.setFullYear(today.getFullYear() - 1);
    return { startDate, chartTitle: 'Yearly Spending', sectionTitle: 'Yearly Transactions' };
  }

  startDate.setDate(today.getDate() - 6);
  return { startDate, chartTitle: 'Weekly Spending', sectionTitle: 'Weekly Transactions' };
};

const getBucketDate = (transactionDate, today, filterIndex) => {
  if (filterIndex === 1) {
    const diffInDays = Math.max(0, Math.floor((today - startOfDay(transactionDate)) / DAY_IN_MS));
    const bucketOffset = Math.min(6, Math.floor(diffInDays / 4));
    const bucketDate = new Date(today);
    bucketDate.setDate(today.getDate() - bucketOffset * 4);
    return bucketDate;
  }

  if (filterIndex === 2) {
    const diffInMonths =
      (today.getFullYear() - transactionDate.getFullYear()) * 12 +
      (today.getMonth() - transactionDate.getMonth());
    const bucketOffset = Math.min(6, Math.floor(Math.max(0, diffInMonths) / 2));
    const bucketDate = new Date(today);
    bucketDate.setMonth(today.getMonth() - bucketOffset * 2);
    return bucketDate;
  }

  return startOfDay(transactionDate);
};

const getBucketLabel = (dateKey, filterIndex) => {
  const date = new Date(dateKey);

  if (filterIndex === 1) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  if (filterIndex === 2) {
    return date.toLocaleDateString(undefined, { month: 'short' });
  }

  return date.toLocaleDateString(undefined, { weekday: 'short' })[0];
};

const getEmptyMessage = (filterIndex) => {
  if (filterIndex === 1) return 'No transactions found in the last month';
  if (filterIndex === 2) return 'No transactions found in the last year';
  return 'No transactions found in the last week';
};

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { width } = useWindowDimensions();
  const { transactions, categories, user } = useFinanceStore();
  const [filterIndex, setFilterIndex] = useState(0);

  const { chartData, pieData, chartTitle, filteredTransactions, sectionTitle, expenseTotal } = useMemo(() => {
    const today = startOfDay(new Date());
    const { startDate, chartTitle: nextChartTitle, sectionTitle: nextSectionTitle } = getFilterMeta(filterIndex);

    const visibleTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return !Number.isNaN(transactionDate.getTime()) && transactionDate >= startDate;
    });

    const bucketDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      if (filterIndex === 1) {
        date.setDate(today.getDate() - (6 - index) * 4);
      } else if (filterIndex === 2) {
        date.setMonth(today.getMonth() - (6 - index) * 2);
      } else {
        date.setDate(today.getDate() - (6 - index));
      }
      return date.toISOString().split('T')[0];
    });

    const expensesByBucket = Object.fromEntries(bucketDates.map((dateKey) => [dateKey, 0]));

    visibleTransactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (Number.isNaN(transactionDate.getTime())) return;

        const bucketKey = getBucketDate(transactionDate, today, filterIndex).toISOString().split('T')[0];
        if (bucketKey in expensesByBucket) {
          expensesByBucket[bucketKey] += transaction.amount;
        }
      });

    return {
      chartTitle: nextChartTitle,
      filteredTransactions: visibleTransactions,
      sectionTitle: nextSectionTitle,
      expenseTotal: visibleTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      chartData: bucketDates.map((dateKey) => ({
        value: expensesByBucket[dateKey] || 0,
        label: getBucketLabel(dateKey, filterIndex),
        frontColor: theme.secondary,
        topLabelComponent: () => (
          <Text style={{ color: theme.textMuted, fontSize: 10, marginBottom: 4 }}>
            {expensesByBucket[dateKey] > 0 ? `$${expensesByBucket[dateKey]}` : ''}
          </Text>
        ),
      })),
      pieData: categories
        .map((cat) => {
          const amount = visibleTransactions
            .filter((t) => t.type === 'expense' && t.category === cat.id)
            .reduce((sum, t) => sum + t.amount, 0);
          return { value: amount, color: cat.color, text: cat.name };
        })
        .filter((item) => item.value > 0),
    };
  }, [categories, filterIndex, theme.secondary, theme.textMuted, transactions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={colorScheme === 'dark' ? Gradients.cardAurora : ['#FFFFFF', '#F0F3F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.headerTextWrap}>
                  <Text style={[styles.title, { color: theme.text }]}>Balances</Text>
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Manage your cash flow and spending pace
                  </Text>
                </View>
                <ThemeToggleButton />
              </View>
            </View>

            <SegmentedControl
              values={FILTER_OPTIONS}
              selectedIndex={filterIndex}
              onChange={setFilterIndex}
              style={styles.segmentControl}
            />

            <View style={styles.metricRow}>
              <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Available Balance</Text>
                <Text style={[styles.metricValue, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>${user.balance.toLocaleString()}</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Spent</Text>
                <Text style={[styles.metricValue, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>${expenseTotal.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>{chartTitle}</Text>
              <BarChart
                data={chartData}
                barWidth={width / 18}
                noOfSections={3}
                barBorderRadius={7}
                frontColor={theme.secondary}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                spacing={width / 22}
                isAnimated
                animationDuration={800}
              />
            </View>

            {pieData.length > 0 && (
              <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>Spending by Category</Text>
                <View style={styles.pieRow}>
                  <PieChart
                    data={pieData}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={70}
                    innerRadius={55}
                    innerCircleColor={theme.surface}
                    centerLabelComponent={() => (
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
                          ${expenseTotal.toLocaleString()}
                        </Text>
                      </View>
                    )}
                  />
                  <View style={styles.legend}>
                    {pieData.slice(0, 4).map((item, id) => (
                      <View key={id} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{sectionTitle}</Text>
          </>
        }
        renderItem={({ item, index }) => {
          const category = categories.find((categoryItem) => categoryItem.id === item.category) || categories[0];
          return <TransactionItem transaction={item} category={category} index={index} />;
        }}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <Ghost color={theme.textSecondary} size={42} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No history here</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{getEmptyMessage(filterIndex)}</Text>
          </View>
        }
      />
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
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentControl: {
    marginBottom: 18,
  },
  metricRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 1,
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
  chartContainer: {
    padding: 18,
    borderRadius: 28,
    marginBottom: 28,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 18,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 14,
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
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  legend: {
    marginLeft: 20,
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
