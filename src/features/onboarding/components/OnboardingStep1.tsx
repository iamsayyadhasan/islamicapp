import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingMosqueArt } from '@/components/illustrations';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function OnboardingStep1() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/step-2');
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Mosque Landscape Illustration */}
      <View style={styles.illustrationArea}>
        <OnboardingMosqueArt width={270} height={210} />
      </View>

      {/* Central Welcome & Content */}
      <View style={styles.contentArea}>
        <ThemedText style={styles.title} weight="bold" align="center">
          Welcome
        </ThemedText>

        <ThemedText style={styles.subtitle} align="center" weight="medium">
          Your spiritual journey starts here
        </ThemedText>

        <ThemedText style={styles.bodyText} align="center">
          Qur&apos;an, Prayer times, Qibla, Hadith and more
        </ThemedText>

        {/* Pagination Dots (Screen 1 of 3) */}
        <View style={styles.paginationRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
        </View>
      </View>

      {/* Bottom Action Button */}
      <View style={styles.bottomArea}>
        <PrimaryButton title="Next" onPress={handleNext} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F2', // Warm cream
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  contentArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#0A3B2A',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    maxWidth: 240,
    textAlign: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A3B2A',
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  bottomArea: {
    width: '100%',
    paddingBottom: 4,
  },
});
