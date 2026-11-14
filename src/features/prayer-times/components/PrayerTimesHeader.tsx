import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface PrayerTimesHeaderProps {
  gregorianDate: string;
  hijriDate: string;
  location: string;
  isUsingFallback?: boolean;
  onBack: () => void;
  onOpenQibla: () => void;
  onRequestLocation?: () => void;
}

export function PrayerTimesHeader({
  gregorianDate,
  hijriDate,
  location,
  isUsingFallback = false,
  onBack,
  onOpenQibla,
  onRequestLocation,
}: PrayerTimesHeaderProps) {
  const { theme } = useTheme();

  return (
    <>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={[
            styles.headerIconButton,
            {
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border.subtle,
            },
          ]}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.text.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Line x1={19} y1={12} x2={5} y2={12} />
            <Polyline points="12 19 5 12 12 5" />
          </Svg>
        </TouchableOpacity>

        <ThemedText
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          weight="bold"
        >
          Prayer Times
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.headerIconButton,
            {
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border.subtle,
            },
          ]}
          onPress={onOpenQibla}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open Qibla compass"
        >
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx={12} cy={12} r={10} />
            <Polygon
              points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"
              fill={theme.colors.brand.primary}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Date & Location Header */}
      <View style={styles.dateLocationSection}>
        <ThemedText
          style={[styles.gregorianDateText, { color: theme.colors.text.primary }]}
          weight="bold"
        >
          {gregorianDate}
        </ThemedText>
        <ThemedText style={[styles.hijriDateText, { color: theme.colors.text.tertiary }]}>
          {hijriDate}
        </ThemedText>

        <TouchableOpacity
          style={styles.locationRow}
          onPress={isUsingFallback ? onRequestLocation : undefined}
          disabled={!isUsingFallback || !onRequestLocation}
          activeOpacity={0.7}
          accessibilityRole={isUsingFallback ? 'button' : 'text'}
          accessibilityLabel={`Location: ${location}. ${isUsingFallback ? 'Tap to enable live GPS' : ''}`}
        >
          <Svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx={12} cy={10} r={3} />
          </Svg>
          <ThemedText style={[styles.locationText, { color: theme.colors.brand.primary }]}>
            {location}
          </ThemedText>
          {isUsingFallback && (
            <View
              style={[styles.sampleBadge, { backgroundColor: theme.colors.background.secondary }]}
            >
              <ThemedText
                style={[styles.sampleBadgeText, { color: theme.colors.text.tertiary }]}
                weight="medium"
              >
                Sample
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  dateLocationSection: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  gregorianDateText: {
    fontSize: 14,
    lineHeight: 18,
  },
  hijriDateText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sampleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 2,
  },
  sampleBadgeText: {
    fontSize: 9,
    lineHeight: 12,
  },
});
