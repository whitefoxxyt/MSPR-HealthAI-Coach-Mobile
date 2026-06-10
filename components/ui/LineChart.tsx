import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Spacing } from '@/constants/theme';

interface LineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showDots?: boolean;
  unit?: string;
  accessibilityLabel?: string;
}

export function LineChart({ data, labels, color = Colors.acid, height = 120, showDots = true, unit = '', accessibilityLabel }: LineChartProps) {
  if (!data.length) return null;

  const width = 300;
  const padding = { top: 16, bottom: 24, left: 8, right: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + (1 - (v - min) / range) * chartH,
  }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cp1x} ${prev.y} ${cp2x} ${p.y} ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <View style={styles.container} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} accessible={false}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={areaD} fill="url(#grad)" />
        <Path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {showDots && points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </Svg>
      {labels && (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text key={i} style={styles.label}>{l}</Text>
          ))}
        </View>
      )}
      <View style={styles.range}>
        <Text style={styles.rangeText}>{min.toFixed(1)}{unit}</Text>
        <Text style={styles.rangeText}>{max.toFixed(1)}{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xs },
  label: { fontSize: 9, color: Colors.gray400, fontVariant: ['tabular-nums'] },
  range: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  rangeText: { fontSize: 9, color: Colors.gray400 },
});
