import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MilestoneItem } from './feature-review.types';

export interface FeatureMilestoneListProps {
  milestones: MilestoneItem[];
}

export function FeatureMilestoneList({ milestones }: FeatureMilestoneListProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.roadmapCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
    >
      <ThemedText
        variant="caption"
        weight="bold"
        style={[styles.sectionHeading, { color: theme.colors.brand.primary }]}
      >
        VERIFICATION ROADMAP
      </ThemedText>

      <View style={styles.milestoneList}>
        {milestones.map((item) => {
          const isDone = item.status === 'completed';
          const isReview = item.status === 'review';

          return (
            <View key={item.id} style={styles.milestoneRow}>
              <View
                style={[
                  styles.milestoneBadge,
                  {
                    backgroundColor: isDone
                      ? isDark
                        ? '#134937'
                        : theme.colors.brand.primaryLight
                      : isReview
                        ? isDark
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(212, 175, 55, 0.15)'
                        : isDark
                          ? '#1E293B'
                          : '#F1F5F9',
                  },
                ]}
              >
                <ThemedText style={styles.badgeGlyph}>
                  {isDone ? '✓' : isReview ? '🔍' : '⚙'}
                </ThemedText>
              </View>
              <View style={styles.milestoneTextWrapper}>
                <ThemedText variant="bodySmall" weight={isDone ? 'medium' : 'bold'}>
                  {item.label}
                </ThemedText>
                <ThemedText variant="caption" color="tertiary">
                  {isDone
                    ? 'Completed & verified'
                    : isReview
                      ? 'Scholarly review in progress'
                      : 'Active development'}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roadmapCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sectionHeading: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  milestoneList: {
    gap: 12,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  milestoneBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGlyph: {
    fontSize: 14,
  },
  milestoneTextWrapper: {
    flex: 1,
  },
});
