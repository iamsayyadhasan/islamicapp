import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Line, Path, Polyline } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { CompassDial } from './CompassDial';
import { QiblaInfoCard } from './QiblaInfoCard';
import { MOCK_QIBLA_SCREEN } from '../data/qibla.mock';

export function QiblaScreen() {
  const router = useRouter();
  const qiblaData = MOCK_QIBLA_SCREEN;
  const [heading, setHeading] = useState(293);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  const handleRotate = () => {
    setHeading((prev) => (prev === 293 ? 305 : 293));
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
            Qibla Direction
          </ThemedText>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleRotate}
            activeOpacity={0.8}
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

        {/* Large Degree & Direction Readout */}
        <View style={styles.degreeSection}>
          <ThemedText style={styles.degreeValue} weight="bold">
            {heading}°
          </ThemedText>
          <ThemedText style={styles.directionLabel}>North West</ThemedText>
        </View>

        {/* Realistic Compass Visual */}
        <CompassDial heading={heading} isAligned={true} />

        {/* Location Info Card */}
        <QiblaInfoCard data={qiblaData} onRefresh={handleRotate} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F2', // Warm cream background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
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
  degreeSection: {
    alignItems: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  degreeValue: {
    fontSize: 32,
    lineHeight: 38,
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  directionLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});
