import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { useDynamicPrayerTimes } from '@/features/prayer-times';
import { MOCK_HOME_DASHBOARD } from '../data/home.mock';
import { HomeUserBar } from './HomeUserBar';
import { HomeNextPrayerHero } from './HomeNextPrayerHero';
import { HomePrayerTimetable } from './HomePrayerTimetable';
import { HomeTasbeehCard } from './HomeTasbeehCard';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userName, greeting } = MOCK_HOME_DASHBOARD;

  const {
    prayers,
    currentPrayer,
    nextPrayer,
    locationLabel,
    gregorianDate,
    hijriDateEstimated,
    isUsingFallback,
  } = useDynamicPrayerTimes();

  const handleOpenQibla = () => {
    router.push('/(tabs)/qibla' as Href);
  };

  const handleOpenPrayerTimes = () => {
    router.push('/prayer' as Href);
  };

  const handleOpenTasbeeh = () => {
    router.push('/tasbeeh' as Href);
  };

  const handleOpenNotifications = () => {
    Alert.alert(
      'Prayer Notifications',
      'Daily Adhan reminders and prayer notification scheduling will be configurable in an upcoming update.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Islamic Girih Geometric Background Pattern */}
      <IslamicPatternOverlay opacity={0.08} />

      {/* Deep Forest Green Hero Section */}
      <View style={[styles.heroSection, { paddingTop: insets.top + 14 }]}>
        <HomeUserBar
          userName={userName}
          greeting={greeting}
          locationLabel={locationLabel}
          onOpenQibla={handleOpenQibla}
          onOpenNotifications={handleOpenNotifications}
          onOpenLocation={handleOpenPrayerTimes}
        />

        <HomeNextPrayerHero
          prayerName={currentPrayer?.name ?? nextPrayer.name}
          countdownString={nextPrayer.countdownString}
          dateLabel={`${gregorianDate} • ${hijriDateEstimated}`}
          onPress={handleOpenPrayerTimes}
        />
      </View>

      {/* Bottom Warm Cream Daily Prayer Timetable Sheet */}
      <HomePrayerTimetable
        prayers={prayers}
        isUsingFallback={isUsingFallback}
        onViewSchedule={handleOpenPrayerTimes}
      >
        <HomeTasbeehCard onPress={handleOpenTasbeeh} />
      </HomePrayerTimetable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3B2A', // Deep Forest Green
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
});
