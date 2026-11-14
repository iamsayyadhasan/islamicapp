import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polyline } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useTheme } from '@/theme';
import { MOCK_LANGUAGES } from '../data/onboarding.mock';
import { LanguageOption } from '../types/onboarding.types';

export function LanguageSelectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(MOCK_LANGUAGES[0]);

  const handleContinue = () => {
    router.push('/permissions');
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.mainContent}>
        {/* Title */}
        <ThemedText
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          weight="bold"
          align="center"
        >
          Choose Language
        </ThemedText>

        {/* Language Selection Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {MOCK_LANGUAGES.map((lang, index) => {
              const isSelected = selectedLanguage.id === lang.id;
              const isLast = index === MOCK_LANGUAGES.length - 1;

              return (
                <View key={lang.id}>
                  <TouchableOpacity
                    style={[
                      styles.languageRow,
                      isSelected && [
                        styles.languageRowSelected,
                        { backgroundColor: theme.colors.brand.primaryLight },
                      ],
                    ]}
                    onPress={() => setSelectedLanguage(lang)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.textGroup}>
                      <ThemedText
                        style={[styles.langName, { color: theme.colors.text.primary }]}
                        weight="bold"
                      >
                        {lang.name}
                      </ThemedText>
                      <ThemedText style={[styles.langSub, { color: theme.colors.text.tertiary }]}>
                        {lang.nativeName || lang.name}
                      </ThemedText>
                    </View>

                    {isSelected ? (
                      <Svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme.colors.brand.primary}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="20 6 9 17 4 12" />
                      </Svg>
                    ) : (
                      <Svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme.colors.border.default}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="9 18 15 12 9 6" />
                      </Svg>
                    )}
                  </TouchableOpacity>

                  {!isLast && (
                    <View
                      style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    overflow: 'hidden',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  languageRowSelected: {},
  textGroup: {
    gap: 2,
  },
  langName: {
    fontSize: 14,
    lineHeight: 18,
  },
  langSub: {
    fontSize: 10,
    lineHeight: 14,
  },
  divider: {
    height: 1,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 4,
  },
});
