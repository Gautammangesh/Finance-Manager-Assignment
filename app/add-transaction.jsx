import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { StyledButton } from '@/src/components/StyledButton';
import { StyledInput } from '@/src/components/StyledInput';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { ChevronLeft, Utensils, Car, ShoppingBag, Film, Briefcase, TrendingUp } from 'lucide-react-native';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ICON_MAP = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  film: Film,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
};

export default function AddTransactionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const { categories, addTransaction } = useFinanceStore();

  const [typeIndex, setTypeIndex] = useState(0);
  const type = typeIndex === 0 ? 'expense' : 'income';
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    addTransaction({
      type,
      amount: Number(amount),
      category: selectedCategory,
      date: new Date().toISOString(),
      note,
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Add Transaction',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: isDark ? '#FFFFFF' : '#0F172A',
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400 }}
            >
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Add transaction
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Capture income and expenses with a cleaner, faster flow.
              </Text>
            </MotiView>

            {/* Type Switcher */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 100 }}
            >
              <SegmentedControl
                values={['Expense', 'Income']}
                selectedIndex={typeIndex}
                onChange={setTypeIndex}
                style={styles.segmentedControl}
              />
            </MotiView>

            {/* Amount Input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 150 }}
            >
              <StyledInput
                label="Amount"
                placeholder="Enter amount"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setError('');
                }}
                keyboardType="numeric"
                error={error}
              />
            </MotiView>

            {/* Category Selection */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
            >
              <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryScrollContent}
              >
                {categories.map((cat, index) => {
                  const Icon = ICON_MAP[cat.icon] || Utensils;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.categoryItem,
                        { 
                          backgroundColor: isDark ? theme.surface : '#FFFFFF',
                          borderColor: isSelected ? theme.primary : (isDark ? theme.divider : '#E2E8F0'),
                        },
                        isSelected && { borderWidth: 2 },
                      ]}
                    >
                      <View style={[styles.iconWrapper, { backgroundColor: cat.color + '20' }]}>
                        <Icon color={cat.color} size={22} />
                      </View>
                      <Text style={[
                        styles.categoryName, 
                        { color: isDark ? '#FFFFFF' : '#0F172A' }
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </MotiView>

            {/* Note Input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 250 }}
            >
              <StyledInput
                label="Note (Optional)"
                placeholder="What was this for?"
                value={note}
                onChangeText={setNote}
              />
            </MotiView>

            {/* Save Button */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 300 }}
              style={styles.buttonContainer}
            >
              <StyledButton
                title="Save Transaction"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </MotiView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  segmentedControl: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  categoryScroll: {
    marginBottom: 24,
    marginHorizontal: -24,
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
  },
  categoryItem: {
    width: 85,
    height: 95,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
});
