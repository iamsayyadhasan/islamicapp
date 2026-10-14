import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { useLocation } from '@/context/LocationContext';
import { deriveNextPrayerFromSchedule, getCurrentDaySeconds } from '@/utils/prayer-schedule';
import { MOCK_HOME_DASHBOARD } from '../data/home.mock';
import { HomeUserBar } from './HomeUserBar';
import { HomeNextPrayerHero } from './HomeNextPrayerHero';
import { HomePrayerTimetable } from './HomePrayerTimetable';
import { HomeTasbeehCard } from './HomeTasbeehCard';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    userName,
    greeting,
    location: defaultLocation,
    nextPrayer,
    prayers,
  } = MOCK_HOME_DASHBOARD;
  const {
    locationLabel: sharedLocationLabel,
    isLiveLocation,
    status: locationStatus,
  } = useLocation();

  const displayLocation = isLiveLocation
    ? sharedLocationLabel
    : locationStatus === 'locating'
      ? 'Locating...'
      : defaultLocation;

  const [prayerState, setPrayerState] = useState(() =>
    deriveNextPrayerFromSchedule(prayers, getCurrentDaySeconds()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerState(deriveNextPrayerFromSchedule(prayers, getCurrentDaySeconds()));
    }, 1000);
    return () => clearInterval(timer);
  }, [prayers]);

  const handleOpenQibla = () => {
    router.push('/(tabs)/qibla' as Href);
  };

  const handleOpenPrayerTimes = () => {
    router.push('/(tabs)/prayer' as Href);
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
          locationLabel={displayLocation}
          onOpenQibla={handleOpenQibla}
          onOpenNotifications={handleOpenNotifications}
        />

        <HomeNextPrayerHero
          prayerName={prayerState.nextPrayerName}
          countdownString={prayerState.countdownString}
          dateLabel={nextPrayer.dateLabel}
          onPress={handleOpenPrayerTimes}
        />
      </View>

      {/* Bottom Warm Cream Daily Prayer Timetable Sheet */}
      <HomePrayerTimetable
        prayers={prayerState.prayersWithActiveState}
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
