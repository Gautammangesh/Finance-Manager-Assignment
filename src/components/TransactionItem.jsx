import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { Utensils, Car, ShoppingBag, Film, Briefcase, TrendingUp, Trash2, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = -80;

const ICON_MAP = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  film: Film,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
};

export const TransactionItem = ({ transaction, category, index = 0 }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const { deleteTransaction } = useFinanceStore();
  
  const Icon = ICON_MAP[category.icon] || Utensils;
  const isIncome = transaction.type === 'income';
  
  const translateX = useSharedValue(0);

  const handleDelete = () => {
    deleteTransaction(transaction.id);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-100);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / 80, 1),
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 80 }}
      style={styles.wrapper}
    >
      {/* Delete button behind */}
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity 
          style={[styles.deleteButtonInner, { backgroundColor: theme.danger }]}
          onPress={handleDelete}
        >
          <Trash2 color="#FFF" size={20} />
        </TouchableOpacity>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <View 
            style={[
              styles.container, 
              { 
                backgroundColor: isDark ? theme.surface : '#FFFFFF',
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.divider,
              }
            ]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: category.color + '20' }]}>
              <Icon color={category.color} size={20} />
            </View>
            
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {category.name.toUpperCase()}
                </Text>
                <Star color={theme.textSecondary} size={14} style={{ marginLeft: 4 }} />
              </View>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                {transaction.note || 'No note'}
              </Text>
            </View>
            
            <View style={styles.amountWrapper}>
              <Text style={[
                styles.amount, 
                { color: isIncome ? theme.success : (isDark ? '#FFFFFF' : '#0F172A') }
              ]}>
                {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
              </Text>
              <Text style={[styles.date, { color: theme.textSecondary }]}>
                {new Date(transaction.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  amountWrapper: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
