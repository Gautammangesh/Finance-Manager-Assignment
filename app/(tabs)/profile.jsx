import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { StyledInput } from '@/src/components/StyledInput';
import { StyledButton } from '@/src/components/StyledButton';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { useThemeToggle } from '@/components/useColorScheme';
import { LogOut, ChevronRight, Monitor, Moon, Sun } from 'lucide-react-native';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const { user, transactions, updateProfile } = useFinanceStore();
  const { themePreference, setThemePreference } = useThemeToggle();
  const [viewMode, setViewMode] = useState(0); // 0: Preview, 1: Edit

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleUpdate = () => {
    updateProfile({ name, email });
    setViewMode(0);
  };

  const themeOptions = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with Theme Toggle */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Profile</Text>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Info Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.userInfoWrapper}
        >
          <View style={[styles.avatarWrapper, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.userNameWrapper}>
            <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text>
          </View>
        </MotiView>

        {/* Preview / Edit Toggle */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
          style={styles.tabWrapper}
        >
          <SegmentedControl
            values={['Preview', 'Edit']}
            selectedIndex={viewMode}
            onChange={setViewMode}
          />
        </MotiView>

        {viewMode === 0 ? (
          /* Preview Mode */
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.previewSection}
          >
            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={[
                styles.statCard, 
                { 
                  backgroundColor: isDark ? theme.surface : '#FFFFFF',
                  borderColor: isDark ? 'transparent' : '#E2E8F0',
                }
              ]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL SPENDINGS</Text>
                <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  ${totalSpent.toLocaleString()}
                </Text>
              </View>
              <View style={[
                styles.statCard, 
                { 
                  backgroundColor: isDark ? theme.surface : '#FFFFFF',
                  borderColor: isDark ? 'transparent' : '#E2E8F0',
                }
              ]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL INCOME</Text>
                <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  ${totalIncome.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Info Cards */}
            <View style={[
              styles.infoCard, 
              { 
                backgroundColor: isDark ? theme.surface : '#FFFFFF',
                borderColor: isDark ? 'transparent' : '#E2E8F0',
              }
            ]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>EMAIL</Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{user.email}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>BALANCE</Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  ${user.balance.toLocaleString()}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>TRANSACTIONS</Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {transactions.length} tracked
                </Text>
              </View>
            </View>

            {/* Appearance Section */}
            <View style={[
              styles.appearanceCard, 
              { 
                backgroundColor: isDark ? theme.surface : '#FFFFFF',
                borderColor: isDark ? 'transparent' : '#E2E8F0',
              }
            ]}>
              <Text style={[styles.appearanceTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
              <Text style={[styles.appearanceDesc, { color: theme.textSecondary }]}>
                Choose your app theme. System follows your phone or laptop setting.
              </Text>
              
              <View style={styles.themeOptions}>
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = themePreference === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setThemePreference(option.id)}
                      style={[
                        styles.themeOption,
                        { 
                          backgroundColor: isSelected 
                            ? (isDark ? '#27272A' : '#0F172A')
                            : (isDark ? 'transparent' : '#F8FAFC'),
                          borderColor: isSelected 
                            ? 'transparent' 
                            : (isDark ? '#3F3F46' : '#E2E8F0'),
                        }
                      ]}
                    >
                      <Text style={[
                        styles.themeOptionText,
                        { 
                          color: isSelected 
                            ? '#FFFFFF' 
                            : (isDark ? '#FFFFFF' : '#0F172A')
                        }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Reset Button */}
            <StyledButton
              title="Reset Demo Data"
              variant="outline"
              onPress={() => {}}
              style={styles.resetButton}
            />
          </MotiView>
        ) : (
          /* Edit Mode */
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.editSection}
          >
            <StyledInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
            <StyledInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <StyledInput
              label="Password"
              placeholder="Create a password"
              value="********"
              onChangeText={() => {}}
              secureTextEntry
            />
            <StyledButton
              title="Update Details"
              onPress={handleUpdate}
              style={styles.updateButton}
            />
          </MotiView>
        )}
      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 16 : 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userNameWrapper: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
  },
  tabWrapper: {
    marginBottom: 24,
  },
  previewSection: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  appearanceCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  appearanceTitle: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  appearanceDesc: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    marginTop: 8,
  },
  editSection: {
    paddingTop: 8,
  },
  updateButton: {
    marginTop: 8,
  },
});
