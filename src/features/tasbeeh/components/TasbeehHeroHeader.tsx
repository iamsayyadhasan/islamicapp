import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Path, Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface TasbeehHeroHeaderProps {
  canGoBack: boolean;
  onBack: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function TasbeehHeroHeader({
  canGoBack,
  onBack,
  soundEnabled = false,
  onToggleSound,
}: TasbeehHeroHeaderProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.heroHeader,
        {
          backgroundColor: isDark ? theme.colors.brand.primaryDark : '#0A3B2A',
          borderRadius: theme.radii.xl,
        },
      ]}
    >
      {/* Subtle Islamic Girih Geometric Overlay */}
      <IslamicPatternOverlay opacity={0.08} />

      {/* Optional Back Button if pushed via Stack */}
      {canGoBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </TouchableOpacity>
      )}

      {/* Center Title and Subtitle */}
      <View style={styles.headerTextGroup}>
        <ThemedText style={styles.headerTitle} weight="bold">
          Tasbeeh
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>Remember Allah, one dhikr at a time</ThemedText>
      </View>

      {/* Sound Feedback Toggle Button */}
      {onToggleSound && (
        <TouchableOpacity
          style={[styles.soundButton, soundEnabled && styles.soundButtonActive]}
          onPress={onToggleSound}
          activeOpacity={0.8}
          accessibilityRole="switch"
          accessibilityState={{ checked: soundEnabled }}
          accessibilityLabel={
            soundEnabled
              ? 'Tasbeeh tap sound is enabled. Tap to turn off.'
              : 'Tasbeeh tap sound is disabled. Tap to turn on.'
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {soundEnabled ? (
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FBE19A"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M11 5L6 9H2v6h4l5 4V5z" />
              <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </Svg>
          ) : (
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M11 5L6 9H2v6h4l5 4V5z" />
              <Line x1={23} y1={9} x2={17} y2={15} />
              <Line x1={17} y1={9} x2={23} y2={15} />
            </Svg>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroHeader: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  soundButton: {
    position: 'absolute',
    right: 14,
    top: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  soundButtonActive: {
    backgroundColor: 'rgba(251, 225, 154, 0.22)',
    borderColor: 'rgba(251, 225, 154, 0.45)',
  },
  headerTextGroup: {
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FBE19A', // Islamic Warm Gold
    letterSpacing: 0.3,
  },
});
