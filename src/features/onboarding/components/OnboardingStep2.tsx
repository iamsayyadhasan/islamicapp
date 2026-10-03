import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MOCK_FEATURES } from '../data/onboarding.mock';
import { OnboardingFeatureItem } from '../types/onboarding.types';

function renderFeatureIcon(type: OnboardingFeatureItem['icon']) {
  switch (type) {
    case 'clock':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Circle cx={12} cy={12} r={10} />
          <Line x1={12} y1={6} x2={12} y2={12} />
          <Line x1={12} y1={12} x2={16} y2={14} />
        </Svg>
      );
    case 'book':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </Svg>
      );
    case 'compass':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Circle cx={12} cy={12} r={10} />
          <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="#FFFFFF" />
        </Svg>
      );
    case 'hadith':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </Svg>
      );
  }
}

export function OnboardingStep2() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/language');
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Features List */}
      <View style={styles.featuresList}>
        {MOCK_FEATURES.map((item) => (
          <View key={item.id} style={styles.featureCard}>
            <View style={styles.iconCircle}>{renderFeatureIcon(item.icon)}</View>

            <View style={styles.textColumn}>
              <ThemedText style={styles.featureTitle} weight="bold">
                {item.title}
              </ThemedText>
              <ThemedText style={styles.featureDesc}>{item.description}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Section with Pagination & Button */}
      <View style={styles.bottomSection}>
        <View style={styles.paginationRow}>
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>

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
  featuresList: {
    gap: 14,
    paddingTop: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A3B2A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textColumn: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#1E293B',
  },
  featureDesc: {
    fontSize: 11,
    lineHeight: 15,
    color: '#64748B',
    marginTop: 2,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 4,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});
