import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

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
  const { theme } = useTheme();
  const { locationLabel, cityName, coordinates } = data;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
    >
      <View style={styles.locationGroup}>
        <ThemedText
          style={[styles.locationLabel, { color: theme.colors.text.gold }]}
          weight="semibold"
        >
          {locationLabel || 'Your Location'}
        </ThemedText>
        <ThemedText
          style={[styles.cityName, { color: theme.colors.text.primary }]}
          weight="bold"
          numberOfLines={1}
        >
          {cityName}
        </ThemedText>
        <ThemedText style={[styles.coordinates, { color: theme.colors.text.tertiary }]}>
          {coordinates}
        </ThemedText>
      </View>

      {/* Right Circular Refresh Button */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border.subtle,
          },
        ]}
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
          stroke={theme.colors.brand.primary}
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
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#000000',
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
    letterSpacing: 0.3,
  },
  cityName: {
    fontSize: 15,
    lineHeight: 20,
  },
  coordinates: {
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
