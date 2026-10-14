import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface PrayerSettingsCardProps {
  calculationMethod: string;
  madhab: string;
}

export function PrayerSettingsCard({ calculationMethod, madhab }: PrayerSettingsCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.settingsCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
    >
      <View style={styles.settingRow}>
        <View>
          <ThemedText style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>
            Calculation Method
          </ThemedText>
          <ThemedText
            style={[styles.settingValue, { color: theme.colors.text.primary }]}
            weight="medium"
          >
            {calculationMethod}
          </ThemedText>
        </View>
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
      </View>

      <View style={[styles.settingsDivider, { backgroundColor: theme.colors.border.subtle }]} />

      <View style={styles.settingRow}>
        <View>
          <ThemedText style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>
            Madhab
          </ThemedText>
          <ThemedText
            style={[styles.settingValue, { color: theme.colors.text.primary }]}
            weight="medium"
          >
            {madhab}
          </ThemedText>
        </View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 10,
    lineHeight: 14,
  },
  settingValue: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    marginVertical: 10,
  },
});
