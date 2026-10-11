import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Line, Path, Polyline } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { CompassDial } from './CompassDial';
import { QiblaInfoCard } from './QiblaInfoCard';
import { useQiblaCompass } from '../hooks/useQiblaCompass';
import { shortestAngleDiff } from '../utils/qibla-geometry';

export function QiblaScreen() {
  const router = useRouter();
  const {
    status,
    cityName,
    locationLabel,
    coordinates,
    qiblaBearing,
    directionLabel,
    deviceHeading,
    needleAngle,
    isAligned,
    accuracy,
    isLiveCompass,
    canAskAgain,
    refresh,
    requestPermission,
    openSettings,
  } = useQiblaCompass();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  // Calculate turn angle relative to target Qibla bearing
  const turnDiff =
    deviceHeading !== null ? Math.round(shortestAngleDiff(deviceHeading, qiblaBearing)) : null;

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
            onPress={refresh}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Recalibrate compass and refresh location"
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
            {qiblaBearing}°
          </ThemedText>
          <ThemedText style={styles.directionLabel}>{directionLabel}</ThemedText>

          {/* Dynamic Live Orientation & Alignment Status */}
          {isLiveCompass && deviceHeading !== null ? (
            <View style={styles.liveHeadingBadge}>
              <View
                style={[
                  styles.statusDot,
                  isAligned ? styles.statusDotAligned : styles.statusDotTracking,
                ]}
              />
              <ThemedText
                style={[styles.liveHeadingText, isAligned && styles.liveHeadingTextAligned]}
                weight="medium"
              >
                {isAligned
                  ? 'Aligned with the Kaaba'
                  : turnDiff !== null
                    ? `Heading: ${deviceHeading}° • Turn ${Math.abs(turnDiff)}° ${turnDiff > 0 ? 'right' : 'left'}`
                    : `Device Heading: ${deviceHeading}°`}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.staticNoticeBadge}>
              <ThemedText style={styles.staticNoticeText}>
                {status === 'permission_denied'
                  ? canAskAgain
                    ? 'Sample Location • Tap below to enable GPS'
                    : 'Sample Location • Enable in System Settings'
                  : status === 'sensor_unavailable'
                    ? 'Static Bearing • Compass sensor unavailable'
                    : 'Locating current coordinates...'}
              </ThemedText>
            </View>
          )}

          {/* Compass Calibration Hint if Low Accuracy */}
          {(accuracy === 'low' || accuracy === 'uncalibrated') && isLiveCompass && (
            <View style={styles.calibrationHintBadge}>
              <ThemedText style={styles.calibrationHintText}>
                ⚠️ Move phone in a figure-8 to calibrate compass
              </ThemedText>
            </View>
          )}

          {/* Actionable Permission Banner if Denied */}
          {status === 'permission_denied' && (
            <TouchableOpacity
              style={styles.permissionActionBanner}
              onPress={canAskAgain ? requestPermission : openSettings}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={
                canAskAgain
                  ? 'Enable location permissions'
                  : 'Open system settings to enable location permission'
              }
            >
              <ThemedText style={styles.permissionActionText} weight="bold">
                {canAskAgain
                  ? '📍 Tap to allow location permission for exact Qibla'
                  : '⚙️ Location access disabled. Tap to open Settings'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Realistic Compass Visual with Dynamic Rotation */}
        <CompassDial heading={needleAngle} isAligned={isAligned} />

        {/* Location Info Card */}
        <QiblaInfoCard
          data={{
            locationLabel,
            cityName,
            coordinates,
          }}
          onRefresh={refresh}
        />
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
    paddingBottom: 80, // Safe clearance above bottom tab bar without excessive whitespace
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
    gap: 4,
  },
  degreeValue: {
    fontSize: 34,
    lineHeight: 40,
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  directionLabel: {
    fontSize: 13,
    lineHeight: 17,
    color: '#64748B',
    fontWeight: '500',
  },
  liveHeadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotTracking: {
    backgroundColor: '#0A3B2A',
  },
  statusDotAligned: {
    backgroundColor: '#D4AF37', // Gold dot when aligned
  },
  liveHeadingText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#334155',
  },
  liveHeadingTextAligned: {
    color: '#0A3B2A',
    fontWeight: '700',
  },
  staticNoticeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 4,
  },
  staticNoticeText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  calibrationHintBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  calibrationHintText: {
    fontSize: 10,
    lineHeight: 13,
    color: '#92400E',
  },
  permissionActionBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  permissionActionText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#065F46',
  },
});
