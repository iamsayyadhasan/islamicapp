import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Path, Polyline } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { CompassDial } from './CompassDial';
import { QiblaInfoCard } from './QiblaInfoCard';
import { useQiblaCompass } from '../hooks/useQiblaCompass';
import { palette } from '@/theme/tokens/colors';

export function QiblaScreen() {
  const router = useRouter();
  const {
    status,
    cityName,
    locationLabel,
    coordinates,
    qiblaBearing,
    directionLabel,
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

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A2E22"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="15 18 9 12 15 6" />
            </Svg>
          </TouchableOpacity>

          <ThemedText style={styles.headerTitle} weight="bold">
            Qibla Direction
          </ThemedText>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={refresh}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Recalibrate compass and refresh location"
          >
            <Svg
              width={20}
              height={20}
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

        {/* Live Qibla Bearing Readout */}
        <View style={styles.degreeSection}>
          <ThemedText style={styles.degreeValue} weight="bold">
            {qiblaBearing}°
          </ThemedText>
          <ThemedText style={styles.directionLabel}>{directionLabel}</ThemedText>

          {/* Dynamic Status Feedback */}
          {isLiveCompass && isAligned && (
            <View style={styles.alignedBadge}>
              <View style={styles.alignedDot} />
              <ThemedText style={styles.alignedText} weight="semibold">
                Aligned with Kaaba
              </ThemedText>
            </View>
          )}

          {!isLiveCompass && (
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

        {/* Main UI Focus: Large Circular Compass Dial */}
        <View style={styles.compassWrapper}>
          <CompassDial heading={needleAngle} isAligned={isAligned} />
        </View>

        {/* Bottom Rounded Location Card */}
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
    backgroundColor: palette.cream[200], // #FAF8F2 warm cream background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 88, // Safe clearance above bottom tab bar without clipping
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: '#1A2E22',
  },
  degreeSection: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  degreeValue: {
    fontSize: 40,
    lineHeight: 46,
    color: '#1A2E22',
    letterSpacing: -0.5,
  },
  directionLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: '#6A7870',
    fontWeight: '500',
  },
  alignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.forestGreen[50],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.gold[400],
    marginTop: 4,
  },
  alignedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.gold[500],
  },
  alignedText: {
    fontSize: 11,
    lineHeight: 15,
    color: palette.forestGreen[800],
  },
  staticNoticeBadge: {
    backgroundColor: palette.cream[300],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 4,
  },
  staticNoticeText: {
    fontSize: 11,
    lineHeight: 15,
    color: palette.slate[600],
  },
  calibrationHintBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  calibrationHintText: {
    fontSize: 10,
    lineHeight: 14,
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
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
});
