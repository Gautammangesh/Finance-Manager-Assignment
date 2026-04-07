import React, { useMemo, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Ghost, Plus, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedEntrance } from '@/src/components/AnimatedEntrance';
import { GradientBankCard } from '@/src/components/GradientBankCard';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { SummaryCard } from '@/src/components/SummaryCard';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { TransactionItem } from '@/src/components/TransactionItem';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors, Gradients } from '@/src/theme';

const EXPENSE_FILTERS = ['Weekly', 'Monthly'];

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { user, transactions, categories } = useFinanceStore();
  const [expenseFilter, setExpenseFilter] = useState(0);

  const { incomeTotal, expenseTotal, filteredExpenseTransactions } = useMemo(() => {
    const today = startOfDay(new Date());
    const periodStart = new Date(today);
    periodStart.setDate(today.getDate() - (expenseFilter === 0 ? 6 : 29));

    const visibleTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return !Number.isNaN(transactionDate.getTime()) && transactionDate >= periodStart;
    });

    return {
      incomeTotal: visibleTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      expenseTotal: visibleTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      filteredExpenseTransactions: visibleTransactions
        .filter((transaction) => transaction.type === 'expense')
        .slice(0, 4),
    };
  }, [expenseFilter, transactions]);

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
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
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

        <AnimatedEntrance delay={120} style={styles.cardSection} scale={0.96}>
          <GradientBankCard balance={user.balance} name={user.name} />
        </AnimatedEntrance>

        <AnimatedEntrance delay={180} style={styles.summaryRow}>
          <SummaryCard type="income" amount={incomeTotal} caption="Incoming this view" />
          <SummaryCard type="expense" amount={expenseTotal} caption="Spent this view" />
        </AnimatedEntrance>

        <AnimatedEntrance delay={240} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your expenses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>See all</Text>
          </TouchableOpacity>
        </AnimatedEntrance>

        <AnimatedEntrance delay={300}>
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
          <AnimatedEntrance delay={300}>
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
  cardSection: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 26,
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
