import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { StyledButton } from '@/src/components/StyledButton';
import { StyledInput } from '@/src/components/StyledInput';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { ChevronLeft, Utensils, Car, ShoppingBag, Film, Briefcase, TrendingUp } from 'lucide-react-native';

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
  const { categories, addTransaction } = useFinanceStore();

  const [type, setType] = useState('expense');
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Type Switcher */}
        <View style={[styles.typeSwitcher, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && { backgroundColor: theme.danger },
            ]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, { color: type === 'expense' ? '#FFF' : theme.textSecondary }]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && { backgroundColor: theme.success },
            ]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, { color: type === 'income' ? '#FFF' : theme.textSecondary }]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <StyledInput
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            setError('');
          }}
          keyboardType="numeric"
          error={error}
          style={styles.amountInput}
        />

        {/* Category Selection */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Utensils;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryItem,
                  { backgroundColor: theme.surface },
                  isSelected && { borderColor: theme.primary, borderWidth: 2 },
                ]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: cat.color + '20' }]}>
                  <Icon color={cat.color} size={24} />
                </View>
                <Text style={[styles.categoryName, { color: theme.text }]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Note Input */}
        <StyledInput
          label="Note (Optional)"
          placeholder="What was this for?"
          value={note}
          onChangeText={setNote}
          style={styles.noteInput}
        />

        <StyledButton
          title="Save Transaction"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  typeSwitcher: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeText: {
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  amountInput: {
    marginBottom: 24,
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryItem: {
    width: 90,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  noteInput: {
    marginBottom: 32,
  },
  saveButton: {
    marginTop: 8,
  },
});
