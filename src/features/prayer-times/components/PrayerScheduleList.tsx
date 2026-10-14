import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { PrayerScheduleItem } from '../types/prayer-times.types';

export interface PrayerScheduleListProps {
  prayers: PrayerScheduleItem[];
}

export function PrayerScheduleList({ prayers }: PrayerScheduleListProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.timetableCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
    >
      {prayers.map((prayer, i) => {
        const isAsr = prayer.isActive;
        const isLast = i === prayers.length - 1;

        return (
          <View
            key={prayer.id}
            style={[
              styles.prayerRow,
              isAsr && [styles.prayerRowActive, { backgroundColor: theme.colors.brand.primary }],
              !isLast &&
                !isAsr && [
                  styles.rowBorderBottom,
                  { borderBottomColor: theme.colors.border.subtle },
                ],
            ]}
          >
            <ThemedText
              style={[
                styles.prayerNameText,
                { color: theme.colors.text.primary },
                isAsr && [styles.prayerNameTextActive, { color: theme.colors.text.inverse }],
              ]}
              weight={isAsr ? 'bold' : 'medium'}
            >
              {prayer.name}
            </ThemedText>
            <ThemedText
              style={[
                styles.prayerTimeText,
                { color: theme.colors.text.secondary },
                isAsr && [
                  styles.prayerTimeTextActive,
                  {
                    color: isDark ? theme.colors.brand.primaryLight : '#DCEDDE',
                  },
                ],
              ]}
              weight={isAsr ? 'bold' : 'medium'}
            >
              {prayer.time}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timetableCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  prayerRowActive: {},
  rowBorderBottom: {
    borderBottomWidth: 1,
  },
  prayerNameText: {
    fontSize: 12,
  },
  prayerNameTextActive: {
    fontWeight: '700',
  },
  prayerTimeText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  prayerTimeTextActive: {
    fontWeight: '700',
  },
});
