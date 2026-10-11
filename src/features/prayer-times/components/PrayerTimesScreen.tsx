import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MOCK_PRAYER_TIMES_SCREEN } from '../data/prayer-times.mock';

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

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#334155"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1={19} y1={12} x2={5} y2={12} />
              <Polyline points="12 19 5 12 12 5" />
            </Svg>
          </TouchableOpacity>

          <ThemedText style={styles.headerTitle} weight="bold">
            Prayer Times
          </ThemedText>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleOpenQibla}
            activeOpacity={0.8}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A3B2A"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="#0A3B2A" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Date & Location Header */}
        <View style={styles.dateLocationSection}>
          <ThemedText style={styles.gregorianDateText} weight="bold">
            {gregorianDate}
          </ThemedText>
          <ThemedText style={styles.hijriDateText}>{hijriDate}</ThemedText>
          <View style={styles.locationRow}>
            <Svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A3B2A"
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

        {/* Prayer Timetable List Card */}
        <View style={styles.timetableCard}>
          {prayers.map((prayer, i) => {
            const isAsr = prayer.isActive;
            const isLast = i === prayers.length - 1;

            return (
              <View
                key={prayer.id}
                style={[
                  styles.prayerRow,
                  isAsr && styles.prayerRowActive,
                  !isLast && !isAsr && styles.rowBorderBottom,
                ]}
              >
                <ThemedText
                  style={[styles.prayerNameText, isAsr && styles.prayerNameTextActive]}
                  weight={isAsr ? 'bold' : 'medium'}
                >
                  {prayer.name}
                </ThemedText>
                <ThemedText
                  style={[styles.prayerTimeText, isAsr && styles.prayerTimeTextActive]}
                  weight={isAsr ? 'bold' : 'medium'}
                >
                  {prayer.time}
                </ThemedText>
              </View>
            );
          })}
        </View>

        {/* Calculation & Madhab Settings Card */}
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <ThemedText style={styles.settingLabel}>Calculation Method</ThemedText>
              <ThemedText style={styles.settingValue} weight="medium">
                {calculationMethod}
              </ThemedText>
            </View>
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="9 18 15 12 9 6" />
            </Svg>
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.settingRow}>
            <View>
              <ThemedText style={styles.settingLabel}>Madhab</ThemedText>
              <ThemedText style={styles.settingValue} weight="medium">
                {madhab}
              </ThemedText>
            </View>
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="9 18 15 12 9 6" />
            </Svg>
          </View>
        </View>

        {/* Monthly Timetable Action Button */}
        <PrimaryButton
          title="Monthly Timetable"
          onPress={() => {}}
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
          style={{ marginTop: 6 }}
        />

        {/* Sample Timetable Footnote */}
        <View style={styles.disclaimerContainer}>
          <ThemedText style={styles.disclaimerText}>
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
    backgroundColor: '#FAF8F2', // Warm cream
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 16,
  },
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    color: '#1E293B',
  },
  dateLocationSection: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  gregorianDateText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#0F172A',
  },
  hijriDateText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#94A3B8',
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
    color: '#0A3B2A',
    fontWeight: '600',
  },
  timetableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  prayerRowActive: {
    backgroundColor: '#0A3B2A',
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  prayerNameText: {
    fontSize: 12,
    color: '#334155',
  },
  prayerNameTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  prayerTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontVariant: ['tabular-nums'],
  },
  prayerTimeTextActive: {
    color: '#DCEDDE',
    fontWeight: '700',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 10,
    lineHeight: 14,
    color: '#94A3B8',
  },
  settingValue: {
    fontSize: 12,
    lineHeight: 16,
    color: '#1E293B',
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  monthlyButton: {
    width: '100%',
    backgroundColor: '#0A3B2A',
    paddingVertical: 13,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 4,
  },
  monthlyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  disclaimerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
