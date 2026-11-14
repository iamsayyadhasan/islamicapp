import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface CalendarHeroHeaderProps {
  gregorianMonthName: string;
  displayedYear: number;
  hijriMonthName: string;
  hijriYear: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetToToday: () => void;
}

export function CalendarHeroHeader({
  gregorianMonthName,
  displayedYear,
  hijriMonthName,
  hijriYear,
  onPrevMonth,
  onNextMonth,
  onResetToToday,
}: CalendarHeroHeaderProps) {
  const { theme, isDark } = useTheme();

  return (
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
        <TouchableOpacity
          style={styles.navIconButton}
          onPress={onPrevMonth}
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

        <View style={styles.monthTitleWrapper}>
          <ThemedText style={styles.gregorianHeaderTitle} weight="bold">
            {gregorianMonthName} {displayedYear}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.navIconButton}
          onPress={onNextMonth}
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
          {hijriMonthName}
        </ThemedText>
        <View style={styles.hijriYearBadge}>
          <ThemedText style={styles.hijriYearText} weight="bold">
            {hijriYear} (Est.)
          </ThemedText>
        </View>
      </View>

      {/* Quick 'Today' action shortcut */}
      <TouchableOpacity
        style={styles.todayButton}
        onPress={onResetToToday}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Return to current date"
      >
        <ThemedText style={styles.todayButtonText} weight="medium">
          Today
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
