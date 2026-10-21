import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface PrayerSettingsCardProps {
  calculationMethod: string;
  madhab: string;
  onPressMethod?: () => void;
  onPressMadhab?: () => void;
}

export function PrayerSettingsCard({
  calculationMethod,
  madhab,
  onPressMethod,
  onPressMadhab,
}: PrayerSettingsCardProps) {
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
      <TouchableOpacity
        style={styles.settingRow}
        onPress={onPressMethod}
        activeOpacity={onPressMethod ? 0.7 : 1}
        disabled={!onPressMethod}
        accessibilityRole="button"
        accessibilityLabel={`Calculation Method: ${calculationMethod}. Tap to change.`}
      >
        <View style={styles.textContainer}>
          <ThemedText style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>
            Calculation Method
          </ThemedText>
          <ThemedText
            style={[styles.settingValue, { color: theme.colors.text.primary }]}
            weight="medium"
            numberOfLines={1}
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
      </TouchableOpacity>

      <View style={[styles.settingsDivider, { backgroundColor: theme.colors.border.subtle }]} />

      <TouchableOpacity
        style={styles.settingRow}
        onPress={onPressMadhab}
        activeOpacity={onPressMadhab ? 0.7 : 1}
        disabled={!onPressMadhab}
        accessibilityRole="button"
        accessibilityLabel={`Madhab: ${madhab}. Tap to change.`}
      >
        <View style={styles.textContainer}>
          <ThemedText style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>
            Madhab
          </ThemedText>
          <ThemedText
            style={[styles.settingValue, { color: theme.colors.text.primary }]}
            weight="medium"
            numberOfLines={1}
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
      </TouchableOpacity>
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
    paddingVertical: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
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
