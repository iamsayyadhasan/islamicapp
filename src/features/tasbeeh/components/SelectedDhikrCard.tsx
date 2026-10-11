import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MOCK_DHIKR_ITEMS } from '../data/tasbeeh.mock';
import { DhikrItem } from '../types/tasbeeh.types';

export interface SelectedDhikrCardProps {
  selectedDhikr: DhikrItem;
  onSelectDhikr: (dhikr: DhikrItem) => void;
}

export function SelectedDhikrCard({ selectedDhikr, onSelectDhikr }: SelectedDhikrCardProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.base,
        },
      ]}
    >
      {/* Horizontal Dhikr Selection Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContainer}
      >
        {MOCK_DHIKR_ITEMS.map((item) => {
          const isSelected = item.id === selectedDhikr.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chipButton,
                {
                  borderRadius: theme.radii.full,
                  borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.subtle,
                  backgroundColor: isSelected
                    ? isDark
                      ? theme.colors.brand.primary
                      : '#0A3B2A'
                    : isDark
                      ? theme.colors.background.secondary
                      : '#F8FAFC',
                },
              ]}
              onPress={() => onSelectDhikr(item)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.transliteration}`}
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isDark
                        ? theme.colors.text.secondary
                        : theme.colors.text.primary,
                  },
                ]}
                weight={isSelected ? 'bold' : 'medium'}
              >
                {item.transliteration}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Selected Dhikr Content */}
      <View style={styles.contentSection}>
        {/* Arabic Calligraphy Display */}
        <ThemedText
          variant="arabic"
          style={[
            styles.arabicText,
            {
              color: isDark ? theme.colors.brand.primary : '#0A3B2A',
            },
          ]}
          align="center"
          weight="bold"
        >
          {selectedDhikr.arabic}
        </ThemedText>

        {/* Transliteration */}
        <ThemedText variant="h2" weight="bold" align="center" style={styles.transliterationText}>
          {selectedDhikr.transliteration}
        </ThemedText>

        {/* English Meaning */}
        <ThemedText variant="bodySmall" color="secondary" align="center" style={styles.meaningText}>
          &ldquo;{selectedDhikr.meaning}&rdquo;
        </ThemedText>

        {/* Virtue / Benefit Tag */}
        {selectedDhikr.virtue && (
          <View
            style={[
              styles.virtuePill,
              {
                backgroundColor: isDark ? 'rgba(12, 67, 38, 0.3)' : '#ECFDF5',
                borderColor: isDark ? 'rgba(70, 143, 117, 0.4)' : '#DCEDDE',
              },
            ]}
          >
            <Svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.brand.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </Svg>
            <ThemedText
              variant="caption"
              style={[
                styles.virtueText,
                { color: isDark ? theme.colors.brand.primary : '#0A3B2A' },
              ]}
              weight="medium"
            >
              {selectedDhikr.virtue}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 14,
  },
  chipsScrollContainer: {
    gap: 8,
    paddingBottom: 12,
  },
  chipButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
  },
  contentSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 44,
    marginBottom: 2,
  },
  transliterationText: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  meaningText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    maxWidth: 280,
  },
  virtuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    maxWidth: '95%',
  },
  virtueText: {
    fontSize: 11,
    lineHeight: 15,
    flexShrink: 1,
  },
});
