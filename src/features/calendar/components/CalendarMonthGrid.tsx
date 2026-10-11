import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { getApproximateHijriDate, WEEKDAY_LABELS } from '../data/calendar.mock';
import { CalendarDay } from '../types/calendar.types';

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
  const { theme, isDark } = useTheme();

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
          const isFriday = idx === 5; // Friday is 5th index (Su=0, Mo=1, Tu=2, We=3, Th=4, Fr=5)
          return (
            <View key={weekday} style={styles.weekdayCell}>
              <ThemedText
                style={[
                  styles.weekdayText,
                  {
                    color: isFriday
                      ? isDark
                        ? theme.colors.brand.primary
                        : theme.colors.brand.primary
                      : theme.colors.text.tertiary,
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
        {calendarDays.map((cell, index) => {
          const isSelected = cell.isSelected && cell.isCurrentMonth;
          const isToday = cell.isToday && cell.isCurrentMonth;

          return (
            <View key={`${cell.year}-${cell.month}-${cell.day}-${index}`} style={styles.cellSlot}>
              {cell.isCurrentMonth ? (
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    isSelected && {
                      backgroundColor: theme.colors.brand.primary,
                      shadowColor: theme.colors.brand.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 2,
                    },
                    isToday &&
                      !isSelected && {
                        borderColor: theme.colors.brand.primary,
                        borderWidth: 1.5,
                      },
                  ]}
                  onPress={() => onSelectDay(cell.day)}
                  activeOpacity={0.75}
                  hitSlop={{ top: 4, bottom: 4, left: 3, right: 3 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Day ${cell.day}, ${
                    cell.isFriday ? 'Friday' : ''
                  } ${isToday ? 'Today' : ''} ${isSelected ? 'Selected' : ''}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <ThemedText
                    style={[
                      styles.dayText,
                      isSelected && {
                        color: theme.colors.text.inverse,
                        fontWeight: '700',
                      },
                      cell.isFriday &&
                        !isSelected && {
                          color: isDark ? theme.colors.brand.primary : theme.colors.brand.primary,
                          fontWeight: '600',
                        },
                      !cell.isFriday &&
                        !isSelected && {
                          color: theme.colors.text.primary,
                        },
                    ]}
                    weight={isSelected || isToday ? 'bold' : 'medium'}
                  >
                    {cell.day}
                  </ThemedText>

                  {/* Tiny subtle Hijri day indicator */}
                  {cell.hijriDay !== undefined && (
                    <ThemedText
                      style={[
                        styles.hijriSubText,
                        isSelected
                          ? { color: 'rgba(255, 255, 255, 0.75)' }
                          : { color: theme.colors.text.tertiary },
                      ]}
                    >
                      {cell.hijriDay}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.inactiveCell}>
                  <ThemedText
                    style={[styles.dayText, { color: theme.colors.text.tertiary, opacity: 0.3 }]}
                  >
                    {cell.day}
                  </ThemedText>
                </View>
              )}
            </View>
          );
        })}
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
    shadowRadius: 10,
    elevation: 1,
    marginVertical: 4,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    marginBottom: 6,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSlot: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    minHeight: 44, // Ensures accessible touch target size
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 13,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
  hijriSubText: {
    fontSize: 8,
    lineHeight: 10,
    marginTop: -1,
    fontVariant: ['tabular-nums'],
  },
});
