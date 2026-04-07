import React from 'react';
import { StyleSheet, View, Text, Platform, Image, Dimensions } from 'react-native';
import { Colors, Gradients } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GradientBankCard = ({ balance, name, cardNumber = '8763 1111 2222 0329', variant = 'teal' }) => {
  const colorScheme = useColorScheme();
  
  const getGradients = () => {
    switch (variant) {
      case 'purple': return Gradients.cardPurple;
      case 'green': return Gradients.cardGreen;
      case 'dark': return Gradients.cardDark;
      case 'blue': return Gradients.cardBlue;
      case 'mint': return Gradients.cardMint;
      case 'teal': 
      default: return Gradients.cardTeal;
    }
  };

  // Card width responsive to screen
  const cardWidth = Math.min(SCREEN_WIDTH - 48, 400);
  const cardHeight = cardWidth * 0.55;

  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight }]}>
      <LinearGradient
        colors={getGradients()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/tuf-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.refreshButton}>
            <RefreshCw color="rgba(255,255,255,0.8)" size={20} />
          </View>
        </View>

        <Text style={styles.cardNumber}>{cardNumber}</Text>

        <Text style={styles.balance}>${balance.toLocaleString()}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.label}>CARD HOLDER NAME</Text>
            <Text style={styles.value}>{name.toUpperCase()}</Text>
          </View>
          <View style={styles.rightFooter}>
            <Text style={styles.label}>EXPIRED DATE</Text>
            <Text style={styles.value}>10/28</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 8,
  },
  balance: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
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
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
