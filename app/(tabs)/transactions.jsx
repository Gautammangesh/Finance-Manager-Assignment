import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { TransactionItem } from '@/src/components/TransactionItem';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { SummaryCard } from '@/src/components/SummaryCard';
import { AnimatedPieChart } from '@/src/components/AnimatedPieChart';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { BarChart } from "react-native-gifted-charts";
import { MotiView } from 'moti';
import { Ghost, TrendingUp, TrendingDown } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const { transactions, categories, user } = useFinanceStore();
  const [filterIndex, setFilterIndex] = useState(0);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Prepare Bar Chart Data
  const chartData = useMemo(() => {
    const expensesGrouped = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    last7Days.forEach(date => expensesGrouped[date] = 0);

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = t.date.split('T')[0];
        if (expensesGrouped[date] !== undefined) {
          expensesGrouped[date] += t.amount;
        }
      });

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return last7Days.map((date, index) => {
      const dayIndex = new Date(date).getDay();
      return {
        value: expensesGrouped[date] || 0,
        label: dayLabels[dayIndex],
        frontColor: '#2DD4BF',
        topLabelComponent: () => (
          expensesGrouped[date] > 0 ? (
            <Text style={{ color: theme.textSecondary, fontSize: 9, marginBottom: 4 }}>
              ${expensesGrouped[date]}
            </Text>
          ) : null
        ),
      };
    });
  }, [transactions, theme]);

  // Prepare Pie Chart Data for category breakdown
  const pieChartData = useMemo(() => {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = categories.find(c => c.id === t.category);
        if (category) {
          categoryTotals[category.id] = (categoryTotals[category.id] || 0) + t.amount;
        }
      });

    return Object.entries(categoryTotals).map(([catId, value]) => {
      const category = categories.find(c => c.id === catId);
      return {
        name: category?.name || 'Other',
        value,
        color: category?.color || '#6366F1',
      };
    });
  }, [transactions, categories]);

  const renderHeader = () => (
    <>
      {/* Balance Cards */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.balanceRow}
      >
        <View style={[
          styles.balanceCard, 
          { 
            backgroundColor: isDark ? theme.surface : '#FFFFFF',
            borderColor: isDark ? 'transparent' : '#E2E8F0',
          }
        ]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>AVAILABLE BALANCE</Text>
          <Text style={[styles.balanceAmount, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ${user.balance.toLocaleString()}
          </Text>
        </View>
        <View style={[
          styles.balanceCard, 
          { 
            backgroundColor: isDark ? theme.surface : '#FFFFFF',
            borderColor: isDark ? 'transparent' : '#E2E8F0',
          }
        ]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>SPENT</Text>
          <Text style={[styles.balanceAmount, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ${totalExpense.toLocaleString()}
          </Text>
        </View>
      </MotiView>

      {/* Spending Chart */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
        style={[
          styles.chartContainer, 
          { 
            backgroundColor: isDark ? theme.surface : '#FFFFFF',
            borderColor: isDark ? 'transparent' : '#E2E8F0',
          }
        ]}
      >
        <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>WEEKLY SPENDING</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={chartData}
            barWidth={Math.min(28, (SCREEN_WIDTH - 120) / 10)}
            noOfSections={3}
            barBorderRadius={6}
            frontColor="#2DD4BF"
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
            hideRules
            hideYAxisText
            spacing={Math.min(24, (SCREEN_WIDTH - 120) / 12)}
            isAnimated
            animationDuration={800}
            height={140}
            maxValue={Math.max(...chartData.map(d => d.value), 100)}
          />
        </View>
      </MotiView>

      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
        Weekly Transactions
      </Text>
    </>
  );

  const renderEmptyState = () => (
    <MotiView 
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 300 }}
      style={[
        styles.emptyState, 
        { 
          backgroundColor: isDark ? theme.surface : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0',
        }
      ]}
    >
      <Ghost color={theme.textSecondary} size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
      <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '600', fontSize: 16 }}>
        No transactions yet
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
        Your transaction history will appear here
      </Text>
    </MotiView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Balances</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Manage your cash flow and spending pace
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabWrapper}>
        <SegmentedControl
          values={['Weekly', 'Monthly', 'Yearly']}
          selectedIndex={filterIndex}
          onChange={setFilterIndex}
        />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => {
          const category = categories.find((c) => c.id === item.category) || categories[0];
          return <TransactionItem transaction={item} category={category} index={index} />;
        }}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '700',
  },
  chartContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
});
