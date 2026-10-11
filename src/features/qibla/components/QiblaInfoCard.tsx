import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';

export interface QiblaInfoCardData {
  locationLabel?: string;
  cityName: string;
  coordinates: string;
}

export interface QiblaInfoCardProps {
  data: QiblaInfoCardData;
  onRefresh?: () => void;
}

export function QiblaInfoCard({ data, onRefresh }: QiblaInfoCardProps) {
  const { locationLabel, cityName, coordinates } = data;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.locationGroup}>
        <ThemedText style={styles.locationLabel}>{locationLabel || 'Your Location'}</ThemedText>
        <ThemedText style={styles.cityName} weight="bold">
          {cityName}
        </ThemedText>
        <ThemedText style={styles.coordinates}>{coordinates}</ThemedText>
      </View>

      {/* Right Circular Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={onRefresh}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Refresh current location and compass"
      >
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0A3B2A"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 4,
  },
  locationGroup: {
    gap: 2,
  },
  locationLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '300',
  },
  cityName: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 16,
  },
  coordinates: {
    fontSize: 10,
    color: '#64748B',
    fontVariant: ['tabular-nums'],
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
