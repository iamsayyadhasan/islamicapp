import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { getApproximateHijriDate, WEEKDAY_LABELS } from '../data/calendar.mock';
import { CalendarDay } from '../types/calendar.types';
import { CalendarDayCell } from './CalendarDayCell';

export interface CalendarMonthGridProps {
  currentYear: number;
  currentMonth: number; // 0-11
  selectedDay: number; // 1-31
  onSelectDay: (day: number) => void;
}

export function CalendarMonthGrid({
  currentYear,
  currentMonth,
  selectedDay,
  onSelectDay,
}: CalendarMonthGridProps) {
  const { theme } = useTheme();

  // Generate complete calendar grid with leading days, month days, and trailing days
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const today = new Date();
    const isCurrentYearAndMonth =
      today.getFullYear() === currentYear && today.getMonth() === currentMonth;
    const todayDate = today.getDate();

    // Days in current month
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Weekday of 1st day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstWeekdayOffset = new Date(currentYear, currentMonth, 1).getDay();

    // Days in previous month for leading padding
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: CalendarDay[] = [];

    // 1. Leading days from previous month
    for (let i = firstWeekdayOffset - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        day: dayNum,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isFriday: (firstWeekdayOffset - 1 - i) % 7 === 5,
      });
    }

    // 2. Days of current month
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const cellWeekday = (firstWeekdayOffset + dayNum - 1) % 7;
      const isToday = isCurrentYearAndMonth && dayNum === todayDate;
      const isSelected = dayNum === selectedDay;
      const approxHijri = getApproximateHijriDate(currentYear, currentMonth, dayNum);

      days.push({
        year: currentYear,
        month: currentMonth,
        day: dayNum,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isFriday: cellWeekday === 5,
        hijriDay: approxHijri.hijriDay,
      });
    }

    // 3. Trailing days to round out grid to complete rows of 7
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      days.push({
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        day: dayNum,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isFriday: days.length % 7 === 5,
      });
    }

    return days;
  }, [currentYear, currentMonth, selectedDay]);

  return (
    <View
      style={[
        styles.gridCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
        },
      ]}
    >
      {/* 7-Weekday Column Headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((weekday, idx) => {
          const isFriday = idx === 5;
          return (
            <View key={weekday} style={styles.weekdayCell}>
              <ThemedText
                style={[
                  styles.weekdayText,
                  {
                    color: isFriday ? theme.colors.brand.primary : theme.colors.text.tertiary,
                  },
                ]}
                weight={isFriday ? 'bold' : 'semibold'}
              >
                {weekday}
              </ThemedText>
            </View>
          );
        })}
      </View>

      {/* Calendar Date Cells */}
      <View style={styles.daysContainer}>
        {calendarDays.map((cell, index) => (
          <CalendarDayCell
            key={`${cell.year}-${cell.month}-${cell.day}-${index}`}
            cell={cell}
            onSelectDay={onSelectDay}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  weekdayText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
