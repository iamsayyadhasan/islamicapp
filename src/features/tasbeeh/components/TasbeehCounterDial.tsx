import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface TasbeehCounterDialProps {
  count: number;
  target: number;
  completedRounds: number;
  onIncrement: () => void;
}

const DIAL_SIZE = 220;
const STROKE_WIDTH = 7;
const RADIUS = (DIAL_SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TasbeehCounterDial({
  count,
  target,
  completedRounds,
  onIncrement,
}: TasbeehCounterDialProps) {
  const { theme, isDark } = useTheme();

  // Progress percentage (0.0 to 1.0) clamped
  const progressRatio = target > 0 ? Math.min(count / target, 1) : 0;
  const strokeDashoffset = CIRCUMFERENCE - progressRatio * CIRCUMFERENCE;

  return (
    <View style={styles.container}>
      {/* Outer Glow Ring / Bezel */}
      <View
        style={[
          styles.outerRing,
          {
            borderColor: isDark ? 'rgba(70, 143, 117, 0.3)' : '#DCEDDE',
          },
        ]}
      >
        {/* Main Circular Forest-Green Tap Target */}
        <TouchableOpacity
          style={[
            styles.dialButton,
            {
              backgroundColor: isDark ? theme.colors.brand.primaryDark : '#0A3B2A',
            },
          ]}
          onPress={onIncrement}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Tasbeeh Counter. Current count is ${count} of ${target}. Tap to increment.`}
        >
          {/* Circular SVG Progress Ring */}
          <Svg width={DIAL_SIZE} height={DIAL_SIZE} style={styles.svgOverlay} pointerEvents="none">
            {/* Background Track Circle */}
            <Circle
              cx={DIAL_SIZE / 2}
              cy={DIAL_SIZE / 2}
              r={RADIUS}
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
            />
            {/* Active Gold / Emerald Progress Arc */}
            <Circle
              cx={DIAL_SIZE / 2}
              cy={DIAL_SIZE / 2}
              r={RADIUS}
              stroke="#FBE19A" // Warm Gold Accent
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              rotation="-90"
              origin={`${DIAL_SIZE / 2}, ${DIAL_SIZE / 2}`}
            />
          </Svg>

          {/* Central Count & Labels */}
          <View style={styles.counterContent} pointerEvents="none">
            <ThemedText style={styles.countLabel}>COUNT</ThemedText>

            <ThemedText style={styles.countNumber} weight="bold">
              {count}
            </ThemedText>

            <View style={styles.targetBadge}>
              <ThemedText style={styles.targetText} weight="bold">
                {count} / {target}
              </ThemedText>
            </View>

            {completedRounds > 0 && (
              <ThemedText style={styles.roundText}>Round {completedRounds} completed</ThemedText>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  outerRing: {
    width: DIAL_SIZE + 16,
    height: DIAL_SIZE + 16,
    borderRadius: (DIAL_SIZE + 16) / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  dialButton: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  counterContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  countLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  countNumber: {
    fontSize: 54,
    lineHeight: 62,
    color: '#FFFFFF',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  targetBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 225, 154, 0.4)',
    marginTop: 2,
  },
  targetText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FBE19A',
    fontVariant: ['tabular-nums'],
  },
  roundText: {
    fontSize: 9,
    lineHeight: 12,
    color: '#DCEDDE',
    marginTop: 2,
  },
});
