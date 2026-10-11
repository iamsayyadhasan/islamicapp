import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import * as Location from 'expo-location';
import { MOCK_PERMISSIONS } from '../data/onboarding.mock';
import { PermissionItem } from '../types/onboarding.types';

function renderPermIcon(type: PermissionItem['icon']) {
  switch (type) {
    case 'location':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0A3B2A"
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
          stroke="#0A3B2A"
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
          stroke="#0A3B2A"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </Svg>
      );
  }
}

export function PermissionsScreen() {
  const router = useRouter();

  const [permissionsState, setPermissionsState] = useState<Record<string, boolean>>({
    location: true,
    notifications: true,
    storage: true,
  });

  const handleToggle = async (id: string) => {
    if (id === 'location') {
      const willEnable = !permissionsState.location;
      if (willEnable) {
        try {
          const res = await Location.requestForegroundPermissionsAsync();
          if (__DEV__) {
            console.log('[Onboarding Permission Request]', {
              status: res.status,
              granted: res.granted,
              canAskAgain: res.canAskAgain,
            });
          }

          if (res.status === Location.PermissionStatus.GRANTED) {
            setPermissionsState((prev) => ({ ...prev, location: true }));
            // Asynchronously warm up location fix in background without blocking UI
            void Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
              .catch(() => Location.getLastKnownPositionAsync())
              .catch(() => null);
          } else {
            setPermissionsState((prev) => ({ ...prev, location: false }));
          }
        } catch (err) {
          if (__DEV__) {
            console.warn('[Onboarding Location Error]', err);
          }
          setPermissionsState((prev) => ({ ...prev, location: false }));
        }
      } else {
        setPermissionsState((prev) => ({ ...prev, location: false }));
      }
    } else {
      setPermissionsState((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handleComplete = async () => {
    if (permissionsState.location) {
      try {
        const check = await Location.getForegroundPermissionsAsync();
        if (check.status !== Location.PermissionStatus.GRANTED && check.canAskAgain) {
          const req = await Location.requestForegroundPermissionsAsync();
          if (__DEV__) {
            console.log('[Onboarding Complete Permission]', {
              status: req.status,
              granted: req.granted,
              canAskAgain: req.canAskAgain,
            });
          }
          if (req.status === Location.PermissionStatus.GRANTED) {
            void Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
              .catch(() => Location.getLastKnownPositionAsync())
              .catch(() => null);
          }
        }
      } catch (err) {
        if (__DEV__) {
          console.warn('[Onboarding Complete Location Check Failed]', err);
        }
      }
    }

    // Always continue onboarding without blocking the user
    router.replace('/(tabs)' as Href);
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topSection}>
        {/* Header Title & Subtitle */}
        <ThemedText style={styles.headerTitle} weight="bold" align="center">
          Allow Permissions
        </ThemedText>
        <ThemedText style={styles.subtitle} align="center">
          We need the following permissions to provide you best experience.
        </ThemedText>

        {/* Permission Row Cards */}
        <View style={styles.cardsList}>
          {MOCK_PERMISSIONS.map((perm) => {
            const isEnabled = !!permissionsState[perm.id];

            return (
              <TouchableOpacity
                key={perm.id}
                style={styles.permCard}
                onPress={() => handleToggle(perm.id)}
                activeOpacity={0.75}
              >
                <View style={styles.leftGroup}>
                  <View style={styles.iconCircle}>{renderPermIcon(perm.icon)}</View>
                  <View style={styles.textGroup}>
                    <ThemedText style={styles.permTitle} weight="bold">
                      {perm.title}
                    </ThemedText>
                    <ThemedText style={styles.permDesc}>{perm.description}</ThemedText>
                  </View>
                </View>

                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    isEnabled ? styles.checkboxActive : styles.checkboxInactive,
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
          })}
        </View>
      </View>

      {/* Bottom Continue Button */}
      <View style={styles.bottomSection}>
        <PrimaryButton title="Continue" onPress={handleComplete} />
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
  topSection: {
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: '#0F172A',
    marginBottom: 6,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  cardsList: {
    gap: 14,
  },
  permCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
  },
  permTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#1E293B',
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
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 4,
  },
});
