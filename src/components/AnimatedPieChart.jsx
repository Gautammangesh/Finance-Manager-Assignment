import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Colors } from '@/src/theme';
import { useColorScheme } from '@/components/useColorScheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AnimatedPieChart = ({ 
  data = [], 
  size = Math.min(SCREEN_WIDTH - 80, 200),
  strokeWidth = 24,
  showLegend = true,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Create animated values for each segment
  const animatedValues = data.map(() => useSharedValue(0));

  useEffect(() => {
    // Animate each segment
    data.forEach((_, index) => {
      animatedValues[index].value = withTiming(1, {
        duration: 1000 + index * 200,
        easing: Easing.out(Easing.cubic),
      });
    });
  }, [data]);

  // Calculate segments
  let accumulatedPercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? item.value / total : 0;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - percentage);
    const rotation = accumulatedPercentage * 360 - 90;
    accumulatedPercentage += percentage;
    
    return {
      ...item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      rotation,
      animatedValue: animatedValues[index],
    };
  });

  const AnimatedSegment = ({ segment, index }) => {
    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: segment.strokeDasharray - 
        (segment.strokeDasharray - segment.strokeDashoffset) * segment.animatedValue.value,
    }));

    return (
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={segment.color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={segment.strokeDasharray}
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation={segment.rotation}
        origin={`${center}, ${center}`}
      />
    );
  };

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isDark ? theme.surface : '#E2E8F0'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </Svg>
        <View style={[styles.centerContent, { width: size, height: size }]}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>No data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size }]}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isDark ? theme.surface : '#F1F5F9'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated segments */}
          <G>
            {segments.map((segment, index) => (
              <AnimatedSegment key={index} segment={segment} index={index} />
            ))}
          </G>
        </Svg>
        
        {/* Center content */}
        <View style={[styles.centerContent, { width: size, height: size }]}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ${total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                {item.name}
              </Text>
              <Text style={[styles.legendValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                ${item.value.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  legend: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
