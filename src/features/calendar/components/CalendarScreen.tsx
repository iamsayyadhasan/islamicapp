import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import {
  GREGORIAN_MONTH_NAMES,
  getApproximateHijriDate,
  GREGORIAN_TO_HIJRI_MAP,
} from '../data/calendar.mock';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { IslamicEventsCard } from './IslamicEventsCard';

export interface CalendarScreenProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function CalendarScreen({
  edges = ['top', 'bottom', 'left', 'right'],
}: CalendarScreenProps = {}) {
  const { theme, isDark } = useTheme();

  // Initialize with current actual date or reference default
  const today = useMemo(() => new Date(), []);
  const [displayedYear, setDisplayedYear] = useState<number>(today.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  // Month navigation handlers with year rollover
  const handlePrevMonth = () => {
    setDisplayedMonth((prev) => {
      if (prev === 0) {
        setDisplayedYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setDisplayedMonth((prev) => {
      if (prev === 11) {
        setDisplayedYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
    setSelectedDay(1);
  };

  const handleResetToToday = () => {
    setDisplayedYear(today.getFullYear());
    setDisplayedMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  // Month & Hijri metadata
  const gregorianMonthName = GREGORIAN_MONTH_NAMES[displayedMonth] ?? 'May';
  const rawHijriMonthInfo = GREGORIAN_TO_HIJRI_MAP[displayedMonth] ?? {
    hijriMonthName: "Dhu al-Qi'dah",
    hijriYear: '1446 AH',
    hijriMonthIndex: 11,
  };
  const yearOffset = displayedYear - 2025;
  const baseYearNumber = rawHijriMonthInfo.hijriYear.startsWith('1446') ? 1446 : 1447;
  const hijriMonthInfo = {
    ...rawHijriMonthInfo,
    hijriYear: `${baseYearNumber + yearOffset} AH`,
  };

  // Selected date details
  const selectedHijriInfo = useMemo(() => {
    return getApproximateHijriDate(displayedYear, displayedMonth, selectedDay);
  }, [displayedYear, displayedMonth, selectedDay]);

  const selectedDateObject = useMemo(() => {
    return new Date(displayedYear, displayedMonth, selectedDay);
  }, [displayedYear, displayedMonth, selectedDay]);

  const weekdayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[selectedDateObject.getDay()] ?? 'Friday';
  }, [selectedDateObject]);

  const isSelectedFriday = selectedDateObject.getDay() === 5;

  return (
    <ScreenContainer edges={edges} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Screen 14 Header: Dark Forest-Green Hero Header */}
        <View
          style={[
            styles.heroHeader,
            {
              backgroundColor: isDark ? theme.colors.brand.primaryDark : '#0A3B2A',
              borderRadius: theme.radii.xl,
            },
          ]}
        >
          {/* Subtle Islamic Girih Geometric Overlay */}
          <IslamicPatternOverlay opacity={0.08} />

          {/* Top Month Navigation Bar */}
          <View style={styles.navRow}>
            {/* Prev Month Button */}
            <TouchableOpacity
              style={styles.navIconButton}
              onPress={handlePrevMonth}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="15 18 9 12 15 6" />
              </Svg>
            </TouchableOpacity>

            {/* Current Gregorian Month & Year */}
            <View style={styles.monthTitleWrapper}>
              <ThemedText style={styles.gregorianHeaderTitle} weight="bold">
                {gregorianMonthName} {displayedYear}
              </ThemedText>
            </View>

            {/* Next Month Button */}
            <TouchableOpacity
              style={styles.navIconButton}
              onPress={handleNextMonth}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="9 18 15 12 9 6" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Islamic Month & Hijri Year Banner */}
          <View style={styles.hijriHeroGroup}>
            <ThemedText style={styles.hijriHeaderMonth} weight="bold">
              {hijriMonthInfo.hijriMonthName}
            </ThemedText>
            <View style={styles.hijriYearBadge}>
              <ThemedText style={styles.hijriYearText} weight="bold">
                {hijriMonthInfo.hijriYear} (Est.)
              </ThemedText>
            </View>
          </View>

          {/* Quick "Today" action shortcut */}
          <TouchableOpacity
            style={styles.todayButton}
            onPress={handleResetToToday}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Return to current date"
          >
            <ThemedText style={styles.todayButtonText} weight="medium">
              Today
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Selected Date Information Card */}
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
                  ~ {selectedHijriInfo.hijriDay} {selectedHijriInfo.hijriMonthName}{' '}
                  {selectedHijriInfo.hijriYear}
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

        {/* Compact Monthly Calendar Grid with 7 Weekday Columns */}
        <CalendarMonthGrid
          currentYear={displayedYear}
          currentMonth={displayedMonth}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Upcoming Islamic Events Section */}
        <IslamicEventsCard currentHijriMonth={hijriMonthInfo.hijriMonthIndex} />

        {/* Regulatory Lunar Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <ThemedText
            variant="caption"
            color="tertiary"
            align="center"
            style={styles.disclaimerText}
          >
            * Note: Islamic dates and occasions shown are illustrative approximations for this
            frontend UI phase. Authoritative religious dates depend on verified local lunar
            sightings.
          </ThemedText>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  heroHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 2,
  },
  navIconButton: {
    width: 44, // Accessible touch target size >= 44
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleWrapper: {
    alignItems: 'center',
  },
  gregorianHeaderTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  hijriHeroGroup: {
    alignItems: 'center',
    marginVertical: 10,
    gap: 4,
    zIndex: 2,
  },
  hijriHeaderMonth: {
    fontSize: 26,
    lineHeight: 32,
    color: '#FBE19A', // Islamic Warm Gold
    letterSpacing: 0.5,
  },
  hijriYearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  hijriYearText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#DCEDDE',
    letterSpacing: 0.8,
  },
  todayButton: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    zIndex: 2,
    marginTop: 2,
  },
  todayButtonText: {
    color: '#FBE19A',
    fontSize: 11,
  },
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
  disclaimerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10,
    lineHeight: 14,
  },
});
