import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { TransactionItem } from '@/src/components/TransactionItem';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { BarChart } from "react-native-gifted-charts";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { transactions, categories, user } = useFinanceStore();
  const [filterIndex, setFilterIndex] = useState(0);

  // Prepare Chart Data
  const chartData = useMemo(() => {
    const expensesGrouped = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => expensesGrouped[date] = 0);

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = t.date.split('T')[0];
        if (expensesGrouped[date] !== undefined) {
          expensesGrouped[date] += t.amount;
        }
      });

    return last7Days.map(date => ({
      value: expensesGrouped[date] || 0,
      label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' })[0],
      frontColor: theme.primary,
      topLabelComponent: () => (
        <Text style={{ color: theme.textSecondary, fontSize: 10, marginBottom: 4 }}>
          {expensesGrouped[date] > 0 ? `$${expensesGrouped[date]}` : ''}
        </Text>
      ),
    }));
  }, [transactions, theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Wallet History</Text>
        <View style={styles.tabWrapper}>
          <SegmentedControl
            values={['Weekly', 'Monthly', 'Yearly']}
            selectedIndex={filterIndex}
            onChange={setFilterIndex}
          />
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.balanceSection}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.text }]}>${user.balance.toLocaleString()}</Text>
            </View>

            {/* Spending Chart */}
            <View style={[styles.chartContainer, { backgroundColor: theme.surface }]}>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>Weekly Spending</Text>
              <BarChart
                data={chartData}
                barWidth={22}
                noOfSections={3}
                barBorderRadius={6}
                frontColor={theme.primary}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                spacing={20}
                isAnimated
                animationDuration={800}
              />
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>All Transactions</Text>
          </>
        }
        renderItem={({ item }) => {
          const category = categories.find((c) => c.id === item.category) || categories[0];
          return <TransactionItem transaction={item} category={category} />;
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: theme.textSecondary }}>No transactions found</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  tabWrapper: {
    marginBottom: 8,
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  chartContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
});
