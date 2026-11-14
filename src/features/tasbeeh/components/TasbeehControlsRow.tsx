import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface TasbeehControlsRowProps {
  count: number;
  onUndo: () => void;
  onReset: () => void;
}

export function TasbeehControlsRow({ count, onUndo, onReset }: TasbeehControlsRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.controlsRow}>
      {/* Undo Button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          {
            backgroundColor: theme.colors.background.card,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radii.lg,
            opacity: count > 0 ? 1 : 0.5,
          },
        ]}
        onPress={onUndo}
        disabled={count === 0}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Undo last count"
        accessibilityState={{ disabled: count === 0 }}
      >
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={count > 0 ? theme.colors.brand.primary : theme.colors.text.tertiary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M9 14L4 9l5-5" />
          <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </Svg>
        <ThemedText
          variant="bodySmall"
          weight="medium"
          style={{
            color: count > 0 ? theme.colors.text.primary : theme.colors.text.tertiary,
          }}
        >
          Undo
        </ThemedText>
      </TouchableOpacity>

      {/* Reset Button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          {
            backgroundColor: theme.colors.background.card,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radii.lg,
          },
        ]}
        onPress={onReset}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Reset counter to zero"
      >
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.colors.status.error}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </Svg>
        <ThemedText
          variant="bodySmall"
          weight="medium"
          style={{ color: theme.colors.status.error }}
        >
          Reset
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 10,
  },
  controlButton: {
    flex: 1,
    height: 48, // Accessible touch target size >= 44
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
});
