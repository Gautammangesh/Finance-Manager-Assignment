import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Colors, Gradients } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Wifi } from 'lucide-react-native';

export const GradientBankCard = ({ balance, name, cardNumber = '8763 1111 2222 0329', variant = 'blue' }) => {
  const colorScheme = useColorScheme();
  
  const getGradients = () => {
    switch (variant) {
      case 'purple': return Gradients.cardPurple;
      case 'green': return Gradients.cardGreen;
      case 'dark': return Gradients.cardDark;
      default: return Gradients.cardBlue;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradients()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.bankName}>ADRBank</Text>
          <Wifi color="rgba(255,255,255,0.6)" size={24} style={styles.nfcIcon} />
        </View>

        <Text style={styles.balance}>${balance.toLocaleString()}</Text>

        <Text style={styles.cardNumber}>{cardNumber}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.label}>Card Holder Name</Text>
            <Text style={styles.value}>{name.toUpperCase()}</Text>
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
  container: {
    height: 200,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nfcIcon: {
    transform: [{ rotate: '90deg' }],
  },
  balance: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 16,
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
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
