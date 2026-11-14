import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { palette } from '@/theme/tokens/colors';
import { DynamicQiblaState, SensorAccuracy } from '../types/qibla.types';

export interface QiblaStatusBannerProps {
  qiblaBearing: number;
  directionLabel: string;
  isLiveCompass: boolean;
  isAligned: boolean;
  status: DynamicQiblaState['status'];
  canAskAgain: boolean;
  accuracy: SensorAccuracy | null;
  onRequestPermission: () => void;
  onOpenSettings: () => void;
}

export function QiblaStatusBanner({
  qiblaBearing,
  directionLabel,
  isLiveCompass,
  isAligned,
  status,
  canAskAgain,
  accuracy,
  onRequestPermission,
  onOpenSettings,
}: QiblaStatusBannerProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.degreeSection}>
      <ThemedText style={[styles.degreeValue, { color: theme.colors.text.primary }]} weight="bold">
        {qiblaBearing}°
      </ThemedText>
      <ThemedText style={[styles.directionLabel, { color: theme.colors.text.secondary }]}>
        {directionLabel}
      </ThemedText>

      {/* Dynamic Status Feedback */}
      {isLiveCompass && isAligned && (
        <View style={styles.alignedBadge}>
          <View style={styles.alignedDot} />
          <ThemedText style={styles.alignedText} weight="bold">
            Qibla Aligned
          </ThemedText>
        </View>
      )}

      {(!isLiveCompass ||
        status === 'permission_denied' ||
        status === 'location_unavailable' ||
        status === 'locating') &&
        !isAligned && (
          <View style={styles.staticNoticeBadge}>
            <ThemedText style={styles.staticNoticeText}>
              {status === 'permission_denied'
                ? canAskAgain
                  ? 'Sample Location • Tap below to enable GPS'
                  : 'Sample Location • Enable in System Settings'
                : status === 'sensor_unavailable'
                  ? 'Static Bearing • Compass sensor unavailable'
                  : status === 'location_unavailable'
                    ? 'Location Unavailable • Live GPS required'
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
          onPress={canAskAgain ? onRequestPermission : onOpenSettings}
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
  );
}

const styles = StyleSheet.create({
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
});
