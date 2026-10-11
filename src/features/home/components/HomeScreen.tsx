import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Polygon, Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';
import {
  deriveNextPrayerFromSchedule,
  getCurrentDaySeconds,
} from '@/features/prayer-times/data/prayer-times.mock';
import { MOCK_HOME_DASHBOARD } from '../data/home.mock';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userName, greeting, location, nextPrayer, prayers } = MOCK_HOME_DASHBOARD;

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
            {prayerState.nextPrayerName}
          </ThemedText>

          <ThemedText style={styles.countdownValue}>{prayerState.countdownString}</ThemedText>

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
          {/* Section Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleGroup}>
              <ThemedText style={styles.sheetTitle} weight="bold">
                Today&apos;s Prayers
              </ThemedText>
              <View style={styles.sampleBadge}>
                <ThemedText style={styles.sampleBadgeText} weight="medium">
                  Sample
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleOpenPrayerTimes}
              activeOpacity={0.7}
              style={styles.viewScheduleButton}
              accessibilityRole="button"
              accessibilityLabel="View full prayer times schedule"
            >
              <ThemedText style={styles.viewScheduleText} weight="bold">
                Full Schedule ›
              </ThemedText>
            </TouchableOpacity>
          </View>

          {prayerState.prayersWithActiveState.map((item) => {
            const isActive = item.isActive;
            return (
              <View
                key={item.id}
                style={[styles.timetableRow, isActive && styles.timetableRowActive]}
              >
                <ThemedText
                  style={[styles.prayerName, isActive && styles.prayerTextActive]}
                  weight={isActive ? 'bold' : 'medium'}
                >
                  {item.name}
                </ThemedText>
                <ThemedText
                  style={[styles.prayerTime, isActive && styles.prayerTextActive]}
                  weight={isActive ? 'bold' : 'medium'}
                >
                  {item.time}
                </ThemedText>
              </View>
            );
          })}

          {/* Tasbeeh Quick-Access Shortcut Card */}
          <TouchableOpacity
            style={styles.tasbeehCard}
            onPress={handleOpenTasbeeh}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Tasbeeh: Take a moment for dhikr. Start Tasbeeh."
          >
            {/* Tasbeeh Beads Icon Badge */}
            <View style={styles.tasbeehIconBadge}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={5.5} r={2.2} fill="#FBE19A" />
                <Circle cx={17} cy={8} r={2.2} fill="#FBE19A" />
                <Circle cx={18.5} cy={13} r={2.2} fill="#FBE19A" />
                <Circle cx={15.5} cy={17.5} r={2.2} fill="#FBE19A" />
                <Circle cx={8.5} cy={17.5} r={2.2} fill="#FBE19A" />
                <Circle cx={5.5} cy={13} r={2.2} fill="#FBE19A" />
                <Circle cx={7} cy={8} r={2.2} fill="#FBE19A" />
                <Path
                  d="M12 2.5v2M12 18v3.5"
                  stroke="#FBE19A"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            {/* Title & Subtitle */}
            <View style={styles.tasbeehTextGroup}>
              <ThemedText style={styles.tasbeehTitle} weight="bold">
                Tasbeeh
              </ThemedText>
              <ThemedText style={styles.tasbeehSubtitle}>Take a moment for dhikr</ThemedText>
            </View>

            {/* Clear "Start Tasbeeh" Affordance */}
            <View style={styles.tasbeehActionPill}>
              <ThemedText style={styles.tasbeehActionText} weight="bold">
                Start Tasbeeh
              </ThemedText>
              <Svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="9 18 15 12 9 6" />
              </Svg>
            </View>
          </TouchableOpacity>
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
    paddingTop: 4,
    paddingBottom: 40,
    gap: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sheetTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#0A3B2A',
  },
  sampleBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sampleBadgeText: {
    fontSize: 10,
    lineHeight: 13,
    color: '#475569',
  },
  viewScheduleButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewScheduleText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#0A3B2A',
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
  tasbeehCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(10, 59, 42, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 12,
    minHeight: 56, // Accessible touch target > 44 pt
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  tasbeehIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A3B2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 225, 154, 0.5)',
    flexShrink: 0,
  },
  tasbeehTextGroup: {
    flex: 1,
    gap: 2,
  },
  tasbeehTitle: {
    fontSize: 15,
    lineHeight: 19,
    color: '#0A3B2A',
    letterSpacing: 0.2,
  },
  tasbeehSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: '#64748B',
  },
  tasbeehActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A3B2A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    flexShrink: 0,
  },
  tasbeehActionText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
