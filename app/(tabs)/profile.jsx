import React, { useMemo, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCcw, Search, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/components/useColorScheme';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { StyledButton } from '@/src/components/StyledButton';
import { StyledInput } from '@/src/components/StyledInput';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors, Gradients } from '@/src/theme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { user, transactions, updateProfile, resetDemoData, themeMode, setThemeMode } = useFinanceStore();
  const [viewMode, setViewMode] = useState(0);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const totalSpent = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalSpent,
      totalIncome,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (password || confirmPassword) {
      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    updateProfile({ name: name.trim(), email: email.trim() });
    setPassword('');
    setConfirmPassword('');
    setError('');
    setViewMode(0);
  };

  const handleResetDemo = () => {
    Alert.alert(
      'Reset demo data',
      'This will restore the starter transactions and profile values for the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetDemoData() },
      ]
    );
  };

  const themeIndex = themeMode === 'dark' ? 1 : themeMode === 'light' ? 2 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ? Gradients.cardAurora : ['#FFFFFF', '#F3F4F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Image
              source={require('@/assets/images/tuf-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={[styles.brandText, { color: theme.text }]}>TUF</Text>
          </View>
          <View style={styles.icons}>
            <ThemeToggleButton />
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Bell color={theme.text} size={18} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
              {user.name[0]}
            </Text>
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: theme.textSecondary }]}>{user.email}</Text>
          </View>
        </View>

        <SegmentedControl
          values={['Preview', 'Edit']}
          selectedIndex={viewMode}
          onChange={setViewMode}
          style={styles.segmentControl}
        />

        {viewMode === 0 ? (
          <>
            <View style={styles.statGrid}>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total spendings</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>${stats.totalSpent.toLocaleString()}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total income</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>${stats.totalIncome.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[styles.detailCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Email</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{user.email}</Text>
              <Text style={[styles.detailLabel, styles.spacedLabel, { color: theme.textMuted }]}>Balance</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>${user.balance.toLocaleString()}</Text>
              <Text style={[styles.detailLabel, styles.spacedLabel, { color: theme.textMuted }]}>Transactions</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{stats.transactionCount} tracked</Text>
            </View>

            <View style={[styles.detailCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Security & Data</Text>
              <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                Managed password and clear historical logs for the application.
              </Text>
              <StyledButton title="Reset Demo Data" variant="outline" onPress={handleResetDemo} />
            </View>
          </>
        ) : (
          <View style={styles.editSection}>
            <StyledInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              autoCapitalize="words"
            />
            <StyledInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <StyledInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            <StyledInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              error={error}
            />
            <StyledButton title="Update Details" onPress={handleUpdate} />
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 140,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 14,
    marginRight: 10,
  },
  brandText: {
    fontSize: 17,
    fontWeight: '800',
  },
  icons: {
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
    top: -4,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4D57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentControl: {
    marginBottom: 18,
  },
  statGrid: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  detailCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  spacedLabel: {
    marginTop: 18,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  themeControl: {
    marginTop: 2,
  },
  editSection: {
    paddingTop: 4,
  },
});
