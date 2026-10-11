import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { TASBEEH_TARGETS } from '../data/tasbeeh.mock';
import { TasbeehTarget } from '../types/tasbeeh.types';

export interface TargetSelectorRowProps {
  selectedTarget: TasbeehTarget;
  onSelectTarget: (target: TasbeehTarget) => void;
}

export function TargetSelectorRow({ selectedTarget, onSelectTarget }: TargetSelectorRowProps) {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText variant="caption" color="secondary" weight="semibold" style={styles.label}>
        TARGET GOAL
      </ThemedText>

      <View style={styles.pillsRow}>
        {TASBEEH_TARGETS.map((targetVal) => {
          const isActive = targetVal === selectedTarget;

          return (
            <TouchableOpacity
              key={targetVal}
              style={[
                styles.targetPill,
                {
                  borderRadius: theme.radii.lg,
                  borderColor: isActive ? theme.colors.brand.primary : theme.colors.border.subtle,
                  backgroundColor: isActive
                    ? isDark
                      ? theme.colors.brand.primary
                      : '#0A3B2A'
                    : theme.colors.background.card,
                },
              ]}
              onPress={() => onSelectTarget(targetVal)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Set target to ${targetVal}`}
              accessibilityState={{ selected: isActive }}
            >
              <ThemedText
                style={[
                  styles.targetText,
                  {
                    color: isActive
                      ? '#FFFFFF'
                      : isDark
                        ? theme.colors.text.secondary
                        : theme.colors.text.primary,
                  },
                ]}
                weight={isActive ? 'bold' : 'medium'}
              >
                {targetVal}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  targetPill: {
    flex: 1,
    height: 44, // Accessible touch target size >= 44
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  targetText: {
    fontSize: 14,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
});
