import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { FeatureMilestoneList } from './FeatureMilestoneList';
import { FeatureUnderReviewProps } from './feature-review.types';

export function FeatureUnderReview({
  iconType,
  badgeText = 'Under Active Scholarly Review',
  englishTitle,
  arabicTitle,
  tagline,
  overviewText,
  milestones,
  scholarlyNote,
  etaLabel = 'Expected in the next milestone release, in sha Allah',
}: FeatureUnderReviewProps) {
  const { theme, isDark } = useTheme();

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Active Status Pill */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isDark ? 'rgba(70, 143, 117, 0.2)' : theme.colors.brand.primaryLight,
              borderColor: theme.colors.brand.primary,
            },
          ]}
        >
          <View style={[styles.pulseDot, { backgroundColor: theme.colors.brand.primary }]} />
          <ThemedText
            style={[styles.statusText, { color: theme.colors.brand.primary }]}
            weight="bold"
          >
            {badgeText}
          </ThemedText>
        </View>

        {/* Feature Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.12)',
              },
            ]}
          >
            {iconType === 'quran' ? (
              <Svg
                width={36}
                height={36}
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.colors.text.gold}
                strokeWidth={1.8}
              >
                <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </Svg>
            ) : (
              <Svg
                width={36}
                height={36}
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.colors.text.gold}
                strokeWidth={1.8}
              >
                <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <Circle cx={12} cy={9} r={2} />
              </Svg>
            )}
          </View>

          <ThemedText style={[styles.arabicTitle, { color: theme.colors.text.gold }]}>
            {arabicTitle}
          </ThemedText>
          <ThemedText variant="h2" weight="bold" align="center" style={styles.englishTitle}>
            {englishTitle}
          </ThemedText>
          <ThemedText variant="bodySmall" color="secondary" align="center" style={styles.tagline}>
            {tagline}
          </ThemedText>
          <ThemedText variant="caption" color="tertiary" align="center" style={styles.overview}>
            {overviewText}
          </ThemedText>
        </View>

        {/* Development & Verification Roadmap Card */}
        <FeatureMilestoneList milestones={milestones} />

        {/* Scholarly Assurance Callout */}
        <View
          style={[
            styles.assuranceBox,
            {
              backgroundColor: isDark ? 'rgba(12, 67, 38, 0.25)' : 'rgba(220, 237, 222, 0.5)',
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <ThemedText style={styles.assuranceIcon}>📜</ThemedText>
          <ThemedText
            variant="caption"
            color="secondary"
            align="center"
            style={styles.assuranceText}
          >
            {scholarlyNote}
          </ThemedText>
        </View>

        {/* ETA Footer */}
        <ThemedText variant="caption" color="tertiary" align="center" style={styles.etaText}>
          {etaLabel}
        </ThemedText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heroCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  arabicTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  englishTitle: {
    marginBottom: 4,
  },
  tagline: {
    marginBottom: 8,
  },
  overview: {
    lineHeight: 18,
  },
  assuranceBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  assuranceIcon: {
    fontSize: 20,
  },
  assuranceText: {
    lineHeight: 18,
  },
  etaText: {
    fontStyle: 'italic',
    paddingHorizontal: 12,
  },
});
