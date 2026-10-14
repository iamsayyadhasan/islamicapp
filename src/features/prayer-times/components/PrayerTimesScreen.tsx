import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Line, Rect } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MOCK_PRAYER_TIMES_SCREEN } from '../data/prayer-times.mock';
import { PrayerTimesHeader } from './PrayerTimesHeader';
import { PrayerScheduleList } from './PrayerScheduleList';
import { PrayerSettingsCard } from './PrayerSettingsCard';

export function PrayerTimesScreen() {
  const router = useRouter();
  const { location, gregorianDate, hijriDate, calculationMethod, madhab, prayers } =
    MOCK_PRAYER_TIMES_SCREEN;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  const handleOpenQibla = () => {
    router.push('/(tabs)/qibla' as Href);
  };

  const handleOpenMonthlyTimetable = () => {
    router.push({
      pathname: '/(tabs)/more',
      params: { tab: 'calendar' },
    } as Href);
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <PrayerTimesHeader
          gregorianDate={gregorianDate}
          hijriDate={hijriDate}
          location={location}
          onBack={handleBack}
          onOpenQibla={handleOpenQibla}
        />

        <PrayerScheduleList prayers={prayers} />

        <PrayerSettingsCard calculationMethod={calculationMethod} madhab={madhab} />

        {/* Monthly Timetable Action Button */}
        <PrimaryButton
          title="Monthly Timetable"
          onPress={handleOpenMonthlyTimetable}
          icon={
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
              <Line x1={16} y1={2} x2={16} y2={6} />
              <Line x1={8} y1={2} x2={8} y2={6} />
              <Line x1={3} y1={10} x2={21} y2={10} />
            </Svg>
          }
          style={styles.monthlyButton}
        />

        {/* Sample Timetable Footnote */}
        <View style={styles.disclaimerContainer}>
          <ThemedText
            variant="caption"
            color="tertiary"
            align="center"
            style={styles.disclaimerText}
          >
            * Sample prayer times for demonstration. Authoritative times depend on local mosque
            timetable.
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
    paddingBottom: 80,
    gap: 16,
  },
  monthlyButton: {
    marginTop: 6,
  },
  disclaimerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 10,
    lineHeight: 14,
  },
});
