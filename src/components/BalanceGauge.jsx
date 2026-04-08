import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SEGMENTS = ['#43D1BE', '#E785DD', '#69B2FF', '#F4D38C'];

const polarToCartesian = (cx, cy, radius, angle) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

export function BalanceGauge({
  score,
  maxScore = 850,
  subtitle,
  detail,
  theme,
  valueLabel,
}) {
  const size = 220;
  const radius = 78;
  const strokeWidth = 13;
  const center = size / 2;
  const circumference = Math.PI * radius;
  const activeProgress = Math.max(0, Math.min(score / maxScore, 1));
  const markerAngle = 180 + activeProgress * 180;
  const marker = polarToCartesian(center, center, radius, markerAngle);

  const segmentOffsets = useMemo(() => {
    const segmentLength = circumference / SEGMENTS.length;
    const gapLength = 12;

    return SEGMENTS.map((color, index) => ({
      color,
      length: segmentLength - gapLength,
      offset: index * segmentLength + gapLength / 2,
    }));
  }, [circumference]);

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={164}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          fill="none"
          origin={`${center}, ${center}`}
          rotation="180"
        />

        {segmentOffsets.map((segment) => (
          <Circle
            key={segment.color}
            cx={center}
            cy={center}
            r={radius}
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.length} ${circumference}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="round"
            fill="none"
            origin={`${center}, ${center}`}
            rotation="180"
          />
        ))}

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={4}
          strokeDasharray="2 10"
          fill="none"
          origin={`${center}, ${center}`}
          rotation="180"
        />

        <Circle cx={marker.x} cy={marker.y} r={13} fill="#79BFFF" />
        <Circle cx={marker.x} cy={marker.y} r={5} fill="#FFFFFF" />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.value, { color: theme.text }]}>{valueLabel ?? score}</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>{subtitle}</Text>
        <Text style={[styles.detail, { color: theme.textSecondary }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 6,
  },
  content: {
    marginTop: -2,
    alignItems: 'center',
  },
  value: {
    fontSize: 50,
    fontWeight: '800',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  detail: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
