import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCcw } from 'lucide-react-native';

import { Gradients } from '@/src/theme';

export const GradientBankCard = ({
  balance,
  name,
  cardNumber = '8763 1111 2222 0329',
}) => {
  const maskedName = name.toUpperCase();

  return (
    <View style={styles.shell}>
      <LinearGradient colors={Gradients.cardMint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.bankName}>TUF Wallet</Text>
          <View style={styles.iconBadge}>
            <RefreshCcw color="#FFFFFF" size={18} />
          </View>
        </View>

        <View>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
          <Text style={styles.balance}>${balance.toLocaleString()}</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.label}>Card Holder Name</Text>
            <Text style={styles.value}>{maskedName}</Text>
          </View>
          <View style={styles.rightFooter}>
            <Text style={styles.label}>Expired Date</Text>
            <Text style={styles.value}>10/28</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  card: {
    minHeight: 168,
    padding: 22,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rightFooter: {
    alignItems: 'flex-end',
  },
  label: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
