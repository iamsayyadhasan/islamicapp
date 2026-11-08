import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';

export interface HomeUserBarProps {
  userName: string;
  greeting: string;
  locationLabel: string;
  onOpenQibla: () => void;
  onOpenNotifications: () => void;
  onOpenLocation?: () => void;
}

export function HomeUserBar({
  userName,
  greeting,
  locationLabel,
  onOpenQibla,
  onOpenNotifications,
  onOpenLocation,
}: HomeUserBarProps) {
  return (
    <View style={styles.userBar}>
      <View style={styles.userProfileGroup}>
        <View style={styles.avatarCircle}>
          <ThemedText style={styles.avatarInitial} weight="bold">
            {userName.charAt(0)}
          </ThemedText>
        </View>
        <View style={styles.userInfo}>
          <ThemedText style={styles.greetingText}>{greeting}</ThemedText>
          <ThemedText style={styles.userNameText} weight="bold">
            {userName}
          </ThemedText>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={onOpenLocation}
            disabled={!onOpenLocation}
            activeOpacity={onOpenLocation ? 0.7 : 1}
            accessibilityRole={onOpenLocation ? 'button' : undefined}
            accessibilityLabel={`Location: ${locationLabel}. Tap to view prayer times.`}
          >
            <Svg
              width={11}
              height={11}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <Circle cx={12} cy={10} r={3} />
            </Svg>
            <ThemedText style={styles.locationText} numberOfLines={1}>
              {locationLabel}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Right Actions */}
      <View style={styles.topRightActions}>
        <TouchableOpacity
          style={styles.actionCircleButton}
          onPress={onOpenQibla}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open Qibla compass"
        >
          <Svg
            width={16}
            height={16}
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
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCircleButton}
          onPress={onOpenNotifications}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Prayer notifications"
        >
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </Svg>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A523E',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    color: '#FBE19A',
  },
  userInfo: {
    gap: 1,
    flex: 1,
  },
  greetingText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userNameText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  locationText: {
    fontSize: 10,
    color: '#A7F3D0',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    position: 'absolute',
    top: 6,
    right: 6,
  },
});
