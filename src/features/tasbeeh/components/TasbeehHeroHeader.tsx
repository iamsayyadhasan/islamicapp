import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface TasbeehHeroHeaderProps {
  canGoBack: boolean;
  onBack: () => void;
}

export function TasbeehHeroHeader({ canGoBack, onBack }: TasbeehHeroHeaderProps) {
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

      <View style={styles.headerTextGroup}>
        <ThemedText style={styles.headerTitle} weight="bold">
          Tasbeeh
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>Remember Allah, one dhikr at a time</ThemedText>
      </View>
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
