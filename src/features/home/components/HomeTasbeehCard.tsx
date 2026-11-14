import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';

export interface HomeTasbeehCardProps {
  onPress: () => void;
}

export function HomeTasbeehCard({ onPress }: HomeTasbeehCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.tasbeehCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Tasbeeh: Take a moment for dhikr. Start Tasbeeh."
    >
      {/* Tasbeeh Beads Icon Badge */}
      <View style={styles.tasbeehIconBadge}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={5.5} r={2.2} fill="#FBE19A" />
          <Circle cx={17} cy={8} r={2.2} fill="#FBE19A" />
          <Circle cx={18.5} cy={13} r={2.2} fill="#FBE19A" />
          <Circle cx={15.5} cy={17.5} r={2.2} fill="#FBE19A" />
          <Circle cx={8.5} cy={17.5} r={2.2} fill="#FBE19A" />
          <Circle cx={5.5} cy={13} r={2.2} fill="#FBE19A" />
          <Circle cx={7} cy={8} r={2.2} fill="#FBE19A" />
          <Path d="M12 2.5v2M12 18v3.5" stroke="#FBE19A" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.tasbeehTextGroup}>
        <ThemedText
          style={[styles.tasbeehTitle, { color: theme.colors.text.primary }]}
          weight="bold"
        >
          Tasbeeh
        </ThemedText>
        <ThemedText style={[styles.tasbeehSubtitle, { color: theme.colors.text.secondary }]}>
          Take a moment for dhikr
        </ThemedText>
      </View>

      {/* Clear 'Start Tasbeeh' Affordance */}
      <View style={[styles.tasbeehActionPill, { backgroundColor: theme.colors.brand.primary }]}>
        <ThemedText
          style={[styles.tasbeehActionText, { color: theme.colors.text.inverse }]}
          weight="bold"
        >
          Start Tasbeeh
        </ThemedText>
        <Svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.colors.text.inverse}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Polyline points="9 18 15 12 9 6" />
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tasbeehCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 12,
    minHeight: 56, // Accessible touch target > 44 pt
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  tasbeehIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A3B2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 225, 154, 0.5)',
    flexShrink: 0,
  },
  tasbeehTextGroup: {
    flex: 1,
    gap: 2,
  },
  tasbeehTitle: {
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: 0.2,
  },
  tasbeehSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  tasbeehActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    flexShrink: 0,
  },
  tasbeehActionText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
});
