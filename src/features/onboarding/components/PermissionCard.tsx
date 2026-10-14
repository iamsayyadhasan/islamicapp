import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { PermissionItem } from '../types/onboarding.types';

function renderPermIcon(type: PermissionItem['icon'], brandColor: string) {
  switch (type) {
    case 'location':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={brandColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <Circle cx={12} cy={10} r={3} />
        </Svg>
      );
    case 'notifications':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={brandColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </Svg>
      );
    case 'storage':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={brandColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </Svg>
      );
  }
}

export interface PermissionCardProps {
  permission: PermissionItem;
  isEnabled: boolean;
  onToggle: () => void;
}

export function PermissionCard({ permission, isEnabled, onToggle }: PermissionCardProps) {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.permCard,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
      onPress={onToggle}
      activeOpacity={0.75}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isEnabled }}
      accessibilityLabel={`${permission.title} permission: ${permission.description}`}
    >
      <View style={styles.leftGroup}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isDark ? 'rgba(12, 67, 38, 0.35)' : theme.colors.brand.primaryLight,
            },
          ]}
        >
          {renderPermIcon(permission.icon, theme.colors.brand.primary)}
        </View>
        <View style={styles.textGroup}>
          <ThemedText style={styles.permTitle} weight="bold">
            {permission.title}
          </ThemedText>
          <ThemedText style={[styles.permDesc, { color: theme.colors.text.secondary }]}>
            {permission.description}
          </ThemedText>
        </View>
      </View>

      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          isEnabled
            ? [styles.checkboxActive, { backgroundColor: theme.colors.brand.primary }]
            : [
                styles.checkboxInactive,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.background.card,
                },
              ],
        ]}
      >
        {isEnabled && (
          <Svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Polyline points="20 6 9 17 4 12" />
          </Svg>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  permCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
  },
  permTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  permDesc: {
    fontSize: 11,
    lineHeight: 15,
    color: '#64748B',
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0A3B2A',
  },
  checkboxInactive: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
});
