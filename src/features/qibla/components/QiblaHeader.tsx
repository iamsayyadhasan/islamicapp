import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Path, Polyline, Rect } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface QiblaHeaderProps {
  onBack: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onRefresh: () => void;
}

export function QiblaHeader({
  onBack,
  hapticsEnabled,
  onToggleHaptics,
  onRefresh,
}: QiblaHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.headerIconButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.colors.text.primary}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Polyline points="15 18 9 12 15 6" />
        </Svg>
      </TouchableOpacity>

      <ThemedText style={[styles.headerTitle, { color: theme.colors.text.primary }]} weight="bold">
        Qibla Direction
      </ThemedText>

      <View style={styles.headerRightActions}>
        {/* Haptic Feedback Toggle Button */}
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onToggleHaptics}
          activeOpacity={0.7}
          accessibilityRole="switch"
          accessibilityState={{ checked: hapticsEnabled }}
          accessibilityLabel={
            hapticsEnabled
              ? 'Haptic feedback is on. Tap to turn off'
              : 'Haptic feedback is off. Tap to turn on'
          }
        >
          <Svg
            width={19}
            height={19}
            viewBox="0 0 24 24"
            fill="none"
            stroke={hapticsEnabled ? theme.colors.brand.primary : theme.colors.text.tertiary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Phone body */}
            <Rect x={7} y={3} width={10} height={18} rx={2} ry={2} />
            {/* Vibration waves */}
            <Path d="M3 9a5 5 0 0 0 0 6" />
            <Path d="M21 9a5 5 0 0 1 0 6" />
            {/* Diagonal slash when disabled */}
            {!hapticsEnabled && (
              <Line
                x1={3}
                y1={3}
                x2={21}
                y2={21}
                stroke={theme.colors.text.tertiary}
                strokeWidth={2.2}
              />
            )}
          </Svg>
        </TouchableOpacity>

        {/* Recalibrate / Refresh Button */}
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onRefresh}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Recalibrate compass and refresh location"
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
