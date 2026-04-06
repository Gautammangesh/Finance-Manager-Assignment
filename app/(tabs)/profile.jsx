import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { StyledInput } from '@/src/components/StyledInput';
import { StyledButton } from '@/src/components/StyledButton';
import { User, Mail, CreditCard, LogOut, ChevronRight, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { user, transactions, updateProfile } = useFinanceStore();
  const [viewMode, setViewMode] = useState(0); // 0: Preview, 1: Edit

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleUpdate = () => {
    updateProfile({ name, email });
    setViewMode(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surface }]}>
          <Settings color={theme.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Info Header */}
        <View style={styles.userInfoWrapper}>
          <View style={[styles.avatarWrapper, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.userNameWrapper}>
            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text>
          </View>
        </View>

        {/* Preview / Edit Toggle */}
        <View style={styles.tabWrapper}>
          <SegmentedControl
            values={['Preview', 'Edit']}
            selectedIndex={viewMode}
            onChange={setViewMode}
          />
        </View>

        {viewMode === 0 ? (
          /* Preview Mode */
          <View style={styles.previewSection}>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total spendings:</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>${totalSpent.toLocaleString()}</Text>
              </View>
              <ChevronRight color={theme.textSecondary} size={20} />
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Email :</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>{user.email}</Text>
              </View>
              <ChevronRight color={theme.textSecondary} size={20} />
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Balance :</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>${user.balance.toLocaleString()}</Text>
              </View>
              <ChevronRight color={theme.textSecondary} size={20} />
            </View>

            <TouchableOpacity style={styles.logoutButton}>
              <LogOut color={theme.danger} size={20} />
              <Text style={[styles.logoutText, { color: theme.danger }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Edit Mode */
          <View style={styles.editSection}>
            <StyledInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <StyledInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <StyledInput
              label="Password"
              placeholder="Create a password"
              value="********"
              onChangeText={() => {}}
              secureTextEntry
              style={styles.input}
            />
            <StyledButton
              title="Update Details"
              onPress={handleUpdate}
              style={styles.updateButton}
            />
          </View>
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
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
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
    marginBottom: 32,
  },
  previewSection: {
    gap: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editSection: {
    paddingVertical: 8,
  },
  input: {
    marginBottom: 20,
  },
  updateButton: {
    marginTop: 12,
  },
});
