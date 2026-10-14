import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface CalendarSelectedDateCardProps {
  weekdayName: string;
  selectedDay: number;
  gregorianMonthName: string;
  displayedYear: number;
  hijriDay: number;
  hijriMonthName: string;
  hijriYear: string;
  isSelectedFriday: boolean;
}

export function CalendarSelectedDateCard({
  weekdayName,
  selectedDay,
  gregorianMonthName,
  displayedYear,
  hijriDay,
  hijriMonthName,
  hijriYear,
  isSelectedFriday,
}: CalendarSelectedDateCardProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.selectedDateCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.base,
        },
      ]}
    >
      <View style={styles.dateDetailRow}>
        <View style={styles.dateLabelGroup}>
          <ThemedText variant="caption" color="secondary" weight="medium">
            SELECTED DATE (ESTIMATED HIJRI)
          </ThemedText>
          <ThemedText variant="h2" weight="bold" style={styles.selectedDateHeading}>
            {weekdayName}, {selectedDay} {gregorianMonthName} {displayedYear}
          </ThemedText>
          <View style={styles.hijriDateLine}>
            <Svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.brand.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </Svg>
            <ThemedText
              variant="bodySmall"
              color="brand"
              weight="bold"
              style={styles.hijriDateText}
            >
              ~ {hijriDay} {hijriMonthName} {hijriYear}
            </ThemedText>
          </View>
        </View>

        {/* Special Friday Badge */}
        {isSelectedFriday && (
          <View
            style={[
              styles.jumuahBadge,
              {
                backgroundColor: isDark ? 'rgba(212, 175, 55, 0.2)' : '#FEF3C7',
                borderColor: 'rgba(212, 175, 55, 0.5)',
              },
            ]}
          >
            <ThemedText style={styles.jumuahText} weight="bold">
              Jumu&apos;ah
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedDateCard: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 8,
  },
  dateDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabelGroup: {
    flex: 1,
    gap: 2,
  },
  selectedDateHeading: {
    marginTop: 2,
  },
  hijriDateLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  hijriDateText: {
    marginTop: 1,
  },
  jumuahBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  jumuahText: {
    fontSize: 11,
    color: '#B45309',
  },
});
