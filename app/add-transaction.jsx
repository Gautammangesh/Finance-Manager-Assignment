import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, Car, Film, ShoppingBag, TrendingUp, Utensils, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedEntrance } from '@/src/components/AnimatedEntrance';
import { StyledButton } from '@/src/components/StyledButton';
import { StyledInput } from '@/src/components/StyledInput';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { Colors, Gradients } from '@/src/theme';
import { useFinanceStore } from '@/src/store/useFinanceStore';

const ICON_MAP = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  film: Film,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
};

const createDateLabel = (date) =>
  date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function AddTransactionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { categories, addTransaction, addCategory } = useFinanceStore();
  const defaultCategoryId = categories[0]?.id ?? '';

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategoryId);
  const [note, setNote] = useState('');
  const [datePreset, setDatePreset] = useState(0);
  const [error, setError] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#57D2C4');

  const categoryPalette = ['#57D2C4', '#F4A261', '#8B7CFF', '#F28482', '#6AE4A6', '#A5B4FC'];

  const selectedDate = useMemo(() => {
    const value = new Date();
    if (datePreset === 1) {
      value.setDate(value.getDate() - 1);
    } else if (datePreset === 2) {
      value.setDate(value.getDate() - 2);
    }
    return value;
  }, [datePreset]);

  const handleSave = () => {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter an amount greater than 0');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    addTransaction({
      type,
      amount: parsedAmount,
      category: selectedCategory,
      date: selectedDate.toISOString(),
      note: note.trim(),
    });

    router.back();
  };

  const handleCreateCategory = () => {
    const normalizedName = newCategoryName.trim();

    if (!normalizedName) {
      setError('Please enter a category name');
      return;
    }

    const selectedIcon = type === 'income' ? 'briefcase' : 'shopping-bag';

    const createdCategoryId = addCategory({
      name: normalizedName,
      icon: selectedIcon,
      color: newCategoryColor,
    });

    setSelectedCategory(createdCategoryId);
    setNewCategoryName('');
    setNewCategoryColor('#57D2C4');
    setShowCategoryForm(false);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
    >
      <LinearGradient
        colors={colorScheme === 'dark' ? Gradients.cardAurora : ['#FFFFFF', '#F2F4F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedEntrance delay={30}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              style={[styles.headerButton, { backgroundColor: theme.surface, borderColor: theme.outline }]}
            >
              <ArrowLeft color={theme.text} size={18} />
            </TouchableOpacity>
            <ThemeToggleButton />
          </View>
          <Text style={[styles.heading, { color: theme.text }]}>Add transaction</Text>
          <Text style={[styles.subheading, { color: theme.textSecondary }]}>
            Capture income and expenses with a cleaner, faster flow.
          </Text>
        </AnimatedEntrance>

        <AnimatedEntrance delay={100} style={[styles.panel, { backgroundColor: theme.panel, borderColor: theme.outline }]} scale={0.98}>
          <View style={[styles.typeSwitcher, { backgroundColor: theme.surface }]}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && { backgroundColor: theme.primary },
              ]}
              onPress={() => setType('expense')}
              activeOpacity={0.88}
            >
              <Text style={[styles.typeText, { color: type === 'expense' ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : theme.textSecondary }]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && { backgroundColor: theme.primary },
              ]}
              onPress={() => setType('income')}
              activeOpacity={0.88}
            >
              <Text style={[styles.typeText, { color: type === 'income' ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : theme.textSecondary }]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

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
          />
          <Text style={[styles.fieldHint, { color: theme.textMuted }]}>
            Required fields: amount, category, date and note.
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Date</Text>
          <View style={styles.dateRow}>
            {['Today', 'Yesterday', '2 days ago'].map((label, index) => {
              const isSelected = index === datePreset;
              return (
                <TouchableOpacity
                  key={label}
                  activeOpacity={0.85}
                  onPress={() => setDatePreset(index)}
                  style={[
                    styles.datePill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surface,
                      borderColor: theme.outline,
                    },
                  ]}
                >
                  <Text style={{ color: isSelected ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : theme.textSecondary, fontWeight: '700', fontSize: 12 }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.datePreview, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <CalendarDays color={theme.textSecondary} size={18} />
            <Text style={[styles.datePreviewText, { color: theme.text }]}>{createDateLabel(selectedDate)}</Text>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => {
              const Icon = ICON_MAP[category.icon] || Utensils;
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.88}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setError('');
                  }}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surface,
                      borderColor: theme.outline,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: isSelected ? 'rgba(0,0,0,0.08)' : `${category.color}22` },
                    ]}
                  >
                    <Icon color={isSelected ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : category.color} size={22} />
                  </View>
                  <Text style={[styles.categoryName, { color: isSelected ? (colorScheme === 'dark' ? '#121212' : '#FFFFFF') : theme.text }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowCategoryForm((value) => !value)}
            style={[styles.addCategoryToggle, { backgroundColor: theme.surface, borderColor: theme.outline }]}
          >
            <Text style={[styles.addCategoryToggleText, { color: theme.text }]}>
              {showCategoryForm ? 'Hide custom category form' : 'Create custom category'}
            </Text>
          </TouchableOpacity>

          {showCategoryForm ? (
            <View style={[styles.customCategoryPanel, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <StyledInput
                label="Category name"
                placeholder="Example: Freelance or Bills"
                value={newCategoryName}
                onChangeText={(text) => {
                  setNewCategoryName(text);
                  setError('');
                }}
              />
              <Text style={[styles.label, { color: theme.text }]}>Accent color</Text>
              <View style={styles.colorRow}>
                {categoryPalette.map((color) => {
                  const isActive = newCategoryColor === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setNewCategoryColor(color)}
                      activeOpacity={0.85}
                      style={[
                        styles.colorSwatch,
                        {
                          backgroundColor: color,
                          borderColor: isActive ? theme.primary : theme.outline,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <StyledButton title="Add Category" variant="outline" onPress={handleCreateCategory} />
            </View>
          ) : null}

          <StyledInput
            label="Note"
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
            multiline
          />

          <StyledButton title="Save Transaction" onPress={handleSave} />
        </AnimatedEntrance>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    lineHeight: 20,
  },
  panel: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
  },
  typeSwitcher: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  typeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontWeight: '700',
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  fieldHint: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -2,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  datePill: {
    paddingHorizontal: 14,
    minHeight: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 10,
  },
  datePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  datePreviewText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: 18,
  },
  categoryItem: {
    width: 104,
    height: 112,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  addCategoryToggle: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  addCategoryToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  customCategoryPanel: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
    marginBottom: 10,
    borderWidth: 2,
  },
});
