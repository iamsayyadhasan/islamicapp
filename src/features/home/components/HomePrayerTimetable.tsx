import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { HomePrayerItem } from '../types/home.types';

export interface HomePrayerTimetableProps {
  prayers: HomePrayerItem[];
  isUsingFallback?: boolean;
  onViewSchedule: () => void;
  children?: React.ReactNode;
}

export function HomePrayerTimetable({
  prayers,
  isUsingFallback = false,
  onViewSchedule,
  children,
}: HomePrayerTimetableProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.timetableSheet, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timetableScroll}
      >
        {/* Section Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetTitleGroup}>
            <ThemedText
              style={[styles.sheetTitle, { color: theme.colors.text.primary }]}
              weight="bold"
            >
              Today&apos;s Prayers
            </ThemedText>
            {isUsingFallback && (
              <View style={[styles.sampleBadge, { backgroundColor: theme.colors.border.subtle }]}>
                <ThemedText
                  style={[styles.sampleBadgeText, { color: theme.colors.text.tertiary }]}
                  weight="medium"
                >
                  Sample
                </ThemedText>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onViewSchedule}
            activeOpacity={0.7}
            style={styles.viewScheduleButton}
            accessibilityRole="button"
            accessibilityLabel="View full prayer times schedule"
          >
            <ThemedText
              style={[styles.viewScheduleText, { color: theme.colors.brand.primary }]}
              weight="bold"
            >
              Full Schedule ›
            </ThemedText>
          </TouchableOpacity>
        </View>

        {prayers.map((item) => {
          const isActive = item.isActive;
          return (
            <View
              key={item.id}
              style={[
                styles.timetableRow,
                isActive && [
                  styles.timetableRowActive,
                  { backgroundColor: theme.colors.brand.primaryLight },
                ],
              ]}
            >
              <ThemedText
                style={[
                  styles.prayerName,
                  { color: theme.colors.text.secondary },
                  isActive && [styles.prayerTextActive, { color: theme.colors.brand.primary }],
                ]}
                weight={isActive ? 'bold' : 'medium'}
              >
                {item.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.prayerTime,
                  { color: theme.colors.text.secondary },
                  isActive && [styles.prayerTextActive, { color: theme.colors.brand.primary }],
                ]}
                weight={isActive ? 'bold' : 'medium'}
              >
                {item.time}
              </ThemedText>
            </View>
          );
        })}

        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  timetableSheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  timetableScroll: {
    paddingTop: 4,
    paddingBottom: 40,
    gap: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sheetTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  sampleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sampleBadgeText: {
    fontSize: 10,
    lineHeight: 13,
  },
  viewScheduleButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewScheduleText: {
    fontSize: 12,
    lineHeight: 16,
  },
  timetableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  timetableRowActive: {},
  prayerName: {
    fontSize: 12,
  },
  prayerTime: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  prayerTextActive: {
    fontWeight: '700',
  },
});
