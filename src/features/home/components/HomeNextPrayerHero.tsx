import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';

export interface HomeNextPrayerHeroProps {
  prayerName: string;
  countdownString: string;
  dateLabel: string;
  onPress: () => void;
}

export function HomeNextPrayerHero({
  prayerName,
  countdownString,
  dateLabel,
  onPress,
}: HomeNextPrayerHeroProps) {
  return (
    <TouchableOpacity
      style={styles.nextPrayerCard}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Next prayer: ${prayerName}, ${countdownString} remaining`}
    >
      <ThemedText style={styles.nextPrayerLabel}>NEXT PRAYER</ThemedText>
      <ThemedText style={styles.prayerNameTitle} weight="bold">
        {prayerName}
      </ThemedText>

      <ThemedText style={styles.countdownValue}>{countdownString}</ThemedText>

      <ThemedText style={styles.remainingText}>remaining</ThemedText>
      <ThemedText style={styles.dateHijriText}>{dateLabel}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
