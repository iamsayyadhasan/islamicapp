import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { CalendarDay } from '../types/calendar.types';

export interface CalendarDayCellProps {
  cell: CalendarDay;
  onSelectDay: (day: number) => void;
}

export function CalendarDayCell({ cell, onSelectDay }: CalendarDayCellProps) {
  const { theme, isDark } = useTheme();

  const isSelected = cell.isSelected && cell.isCurrentMonth;
  const isToday = cell.isToday && cell.isCurrentMonth;

  if (!cell.isCurrentMonth) {
    return (
      <View style={styles.cellSlot}>
        <View style={styles.inactiveCell}>
          <ThemedText style={[styles.dayText, { color: theme.colors.text.tertiary, opacity: 0.3 }]}>
            {cell.day}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cellSlot}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  cellSlot: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  inactiveCell: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 13,
    lineHeight: 16,
  },
  hijriSubText: {
    fontSize: 8,
    lineHeight: 10,
    marginTop: 1,
  },
});
