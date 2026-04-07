import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { GradientBankCard } from '@/src/components/GradientBankCard';
import { SummaryCard } from '@/src/components/SummaryCard';
import { TransactionItem } from '@/src/components/TransactionItem';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Plus, Search, Bell, Ghost } from 'lucide-react-native';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const { user, transactions, categories } = useFinanceStore();
  const [filterIndex, setFilterIndex] = React.useState(0);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.headerLeft}
        >
          <Image 
            source={require('@/assets/images/tuf-logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>TUF</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>Premium finance cockpit</Text>
          </View>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.headerRight}
        >
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? theme.surface : '#F1F5F9' }]}>
            <Search color={theme.textSecondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? theme.surface : '#F1F5F9' }]}>
            <Bell color={theme.textSecondary} size={20} />
            <View style={[styles.badge, { borderColor: theme.background }]} />
          </TouchableOpacity>
          <ThemeToggle />
        </MotiView>
      </View>

      {/* Greeting */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
        style={styles.greetingWrapper}
      >
        <Text style={[styles.greeting, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Hey, {user.name.split(' ')[0]}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Here&apos;s your financial pulse for today.
        </Text>
      </MotiView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bank Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 150 }}
          style={styles.cardWrapper}
        >
          <GradientBankCard balance={user.balance} name={user.name} variant="teal" />
        </MotiView>

        {/* Summary Cards */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 250 }}
          style={styles.summaryRow}
        >
          <SummaryCard type="income" amount={totalIncome} subtitle="Incoming this view" index={0} />
          <SummaryCard type="expense" amount={totalExpense} subtitle="Spent this view" index={1} />
        </MotiView>

        {/* Expenses Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 350 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Your expenses
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 14 }}>See all</Text>
            </TouchableOpacity>
          </View>

          <SegmentedControl
            values={['Weekly', 'Monthly']}
            selectedIndex={filterIndex}
            onChange={setFilterIndex}
            style={styles.expenseFilter}
          />
        </MotiView>

        {/* Transactions List */}
        {recentTransactions.length > 0 ? (
          recentTransactions.map((t, index) => {
            const category = categories.find((c) => c.id === t.category) || categories[0];
            return <TransactionItem key={t.id} transaction={t} category={category} index={index} />;
          })
        ) : (
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 400 }}
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
              No recent transactions
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
              Tap the + button to add your first expense or income
            </Text>
          </MotiView>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 600 }}
        style={styles.fabWrapper}
      >
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: isDark ? '#FFFFFF' : '#0F172A' }]}
          onPress={() => router.push('/add-transaction')}
          activeOpacity={0.8}
        >
          <Plus color={isDark ? '#0F172A' : '#FFFFFF'} size={28} strokeWidth={2.5} />
        </TouchableOpacity>
      </MotiView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
  },
  appSubtitle: {
    fontSize: 11,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
  },
  greetingWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  expenseFilter: {
    marginBottom: 20,
  },
  emptyState: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
