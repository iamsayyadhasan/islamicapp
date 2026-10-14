import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import {
  GREGORIAN_MONTH_NAMES,
  getApproximateHijriDate,
  GREGORIAN_TO_HIJRI_MAP,
} from '../data/calendar.mock';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { CalendarHeroHeader } from './CalendarHeroHeader';
import { CalendarSelectedDateCard } from './CalendarSelectedDateCard';
import { IslamicEventsCard } from './IslamicEventsCard';

export interface CalendarScreenProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function CalendarScreen({
  edges = ['top', 'bottom', 'left', 'right'],
}: CalendarScreenProps = {}) {
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
        <CalendarHeroHeader
          gregorianMonthName={gregorianMonthName}
          displayedYear={displayedYear}
          hijriMonthName={hijriMonthInfo.hijriMonthName}
          hijriYear={hijriMonthInfo.hijriYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onResetToToday={handleResetToToday}
        />

        <CalendarSelectedDateCard
          weekdayName={weekdayName}
          selectedDay={selectedDay}
          gregorianMonthName={gregorianMonthName}
          displayedYear={displayedYear}
          hijriDay={selectedHijriInfo.hijriDay}
          hijriMonthName={selectedHijriInfo.hijriMonthName}
          hijriYear={selectedHijriInfo.hijriYear}
          isSelectedFriday={isSelectedFriday}
        />

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
