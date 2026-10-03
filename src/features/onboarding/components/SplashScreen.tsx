import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IslamicPatternOverlay, SplashGoldenEmblem } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';

export function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/step-1');
    }, 2800);

    return () => clearTimeout(timer);
  }, [router]);

  const handleAdvance = () => {
    router.replace('/onboarding/step-1');
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 24,
        },
      ]}
      onPress={handleAdvance}
    >
      <StatusBar style="light" />

      {/* Subtle Islamic Girih Geometric Watermark */}
      <IslamicPatternOverlay opacity={0.11} />

      {/* Top Spacer */}
      <View style={styles.topSpacer} />

      {/* Central Brand Identity */}
      <View style={styles.centerBrand}>
        <SplashGoldenEmblem size={96} />

        <ThemedText style={styles.title} weight="bold" align="center">
          Islamic{'\n'}Companion
        </ThemedText>

        <View style={styles.goldDivider} />

        <ThemedText style={styles.tagline} align="center">
          Faith · Worship · Knowledge
        </ThemedText>
      </View>

      {/* Bottom Loading Progress Pill */}
      <View style={styles.bottomSection}>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingPill} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3B2A', // Deep Forest Islamic Green
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  topSpacer: {
    height: 32,
  },
  centerBrand: {
    alignItems: 'center',
    marginTop: -20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    color: '#FFFFFF',
    marginTop: 20,
    letterSpacing: 0.5,
  },
  goldDivider: {
    width: 36,
    height: 2.5,
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
    borderRadius: 2,
    marginVertical: 14,
  },
  tagline: {
    fontSize: 12,
    color: '#DCEDDE',
    letterSpacing: 1.1,
    fontWeight: '300',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingTrack: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  loadingPill: {
    width: '66%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#E6C875',
  },
});
