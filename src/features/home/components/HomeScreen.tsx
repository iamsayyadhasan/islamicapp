import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';
import { MOCK_HOME_DASHBOARD } from '../data/home.mock';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userName, greeting, location, nextPrayer, prayers } = MOCK_HOME_DASHBOARD;

  const [countdown, setCountdown] = useState({ h: 1, m: 24, s: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 1, m: 24, s: 35 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => String(n).padStart(2, '0');

  const handleOpenQibla = () => {
    router.push('/(tabs)/qibla' as Href);
  };

  const handleOpenPrayerTimes = () => {
    router.push('/(tabs)/prayer' as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Islamic Girih Geometric Background Pattern */}
      <IslamicPatternOverlay opacity={0.08} />

      {/* Deep Forest Green Hero Section */}
      <View style={[styles.heroSection, { paddingTop: insets.top + 14 }]}>
        {/* User Greeting Bar */}
        <View style={styles.userBar}>
          <View style={styles.userProfileGroup}>
            <View style={styles.avatarCircle}>
              <ThemedText style={styles.avatarInitial} weight="bold">
                {userName.charAt(0)}
              </ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.greetingText}>{greeting}</ThemedText>
              <ThemedText style={styles.userNameText} weight="bold">
                {userName}
              </ThemedText>
              <View style={styles.locationRow}>
                <Svg
                  width={11}
                  height={11}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A7F3D0"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <Circle cx={12} cy={10} r={3} />
                </Svg>
                <ThemedText style={styles.locationText}>{location}</ThemedText>
              </View>
            </View>
          </View>

          {/* Top Right Actions */}
          <View style={styles.topRightActions}>
            <TouchableOpacity
              style={styles.actionCircleButton}
              onPress={handleOpenQibla}
              activeOpacity={0.8}
            >
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
                <Circle cx={12} cy={12} r={10} />
                <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCircleButton} activeOpacity={0.8}>
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
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </Svg>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Prayer Floating Spotlight Card */}
        <TouchableOpacity
          style={styles.nextPrayerCard}
          onPress={handleOpenPrayerTimes}
          activeOpacity={0.9}
        >
          <ThemedText style={styles.nextPrayerLabel}>NEXT PRAYER</ThemedText>
          <ThemedText style={styles.prayerNameTitle} weight="bold">
            {nextPrayer.name}
          </ThemedText>

          <ThemedText style={styles.countdownValue}>
            {format2(countdown.h)}:{format2(countdown.m)}:{format2(countdown.s)}
          </ThemedText>

          <ThemedText style={styles.remainingText}>remaining</ThemedText>
          <ThemedText style={styles.dateHijriText}>{nextPrayer.dateLabel}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Bottom Warm Cream Daily Prayer Timetable Sheet */}
      <View style={styles.timetableSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timetableScroll}
        >
          {prayers.map((item) => {
            const isAsr = item.isActive;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.timetableRow, isAsr && styles.timetableRowActive]}
                onPress={handleOpenPrayerTimes}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[styles.prayerName, isAsr && styles.prayerTextActive]}
                  weight={isAsr ? 'bold' : 'medium'}
                >
                  {item.name}
                </ThemedText>
                <ThemedText
                  style={[styles.prayerTime, isAsr && styles.prayerTextActive]}
                  weight={isAsr ? 'bold' : 'medium'}
                >
                  {item.time}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3B2A', // Deep Forest Green
  },
  heroSection: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A523E',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    color: '#FBE19A',
  },
  userInfo: {
    gap: 1,
  },
  greetingText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userNameText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  locationText: {
    fontSize: 10,
    color: '#A7F3D0',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    position: 'absolute',
    top: 6,
    right: 6,
  },
  nextPrayerCard: {
    backgroundColor: '#134937',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(70, 143, 117, 0.35)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  nextPrayerLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#A7F3D0',
    marginBottom: 2,
  },
  prayerNameTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  countdownValue: {
    fontSize: 20,
    lineHeight: 26,
    color: '#FBE19A',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  remainingText: {
    fontSize: 10,
    color: '#A7F3D0',
    marginBottom: 4,
  },
  dateHijriText: {
    fontSize: 10,
    color: 'rgba(220, 237, 222, 0.75)',
  },
  timetableSheet: {
    flex: 1,
    backgroundColor: '#FAF8F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  timetableScroll: {
    paddingVertical: 4,
    gap: 4,
  },
  timetableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  timetableRowActive: {
    backgroundColor: '#CBE3D5',
  },
  prayerName: {
    fontSize: 12,
    color: '#475569',
  },
  prayerTime: {
    fontSize: 12,
    color: '#475569',
    fontVariant: ['tabular-nums'],
  },
  prayerTextActive: {
    color: '#0A3B2A',
    fontWeight: '700',
  },
});
