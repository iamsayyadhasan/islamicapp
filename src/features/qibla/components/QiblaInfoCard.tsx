import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { palette } from '@/theme/tokens/colors';

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
        <ThemedText style={styles.locationLabel} weight="semibold">
          {locationLabel || 'Your Location'}
        </ThemedText>
        <ThemedText style={styles.cityName} weight="bold" numberOfLines={1}>
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
        accessibilityLabel="Refresh current location"
      >
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={palette.forestGreen[800]}
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
    backgroundColor: palette.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.cream[400],
    shadowColor: palette.forestGreen[950],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 4,
  },
  locationGroup: {
    gap: 3,
    flex: 1,
    marginRight: 12,
  },
  locationLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: palette.gold[700],
    letterSpacing: 0.3,
  },
  cityName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#1A2E22',
  },
  coordinates: {
    fontSize: 12,
    lineHeight: 16,
    color: palette.slate[500],
    fontVariant: ['tabular-nums'],
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.cream[100],
    borderWidth: 1,
    borderColor: palette.cream[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
