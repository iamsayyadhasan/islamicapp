import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useLocation } from '@/context/LocationContext';
import { useTheme } from '@/theme';
import { MOCK_PERMISSIONS } from '../data/onboarding.mock';
import { PermissionCard } from './PermissionCard';

export function PermissionsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { refreshLocation } = useLocation();

  const [permissionsState, setPermissionsState] = useState<Record<string, boolean>>({
    location: false,
    notifications: true,
    storage: true,
  });

  useEffect(() => {
    let isMounted = true;
    Location.getForegroundPermissionsAsync()
      .then((res) => {
        if (isMounted) {
          setPermissionsState((prev) => ({
            ...prev,
            location: res.status === Location.PermissionStatus.GRANTED,
          }));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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
            void refreshLocation();
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
            void refreshLocation();
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
        <ThemedText
          style={[styles.subtitle, { color: theme.colors.text.secondary }]}
          align="center"
        >
          We need the following permissions to provide you best experience.
        </ThemedText>

        {/* Permission Row Cards */}
        <View style={styles.cardsList}>
          {MOCK_PERMISSIONS.map((perm) => {
            const isEnabled = !!permissionsState[perm.id];
            return (
              <PermissionCard
                key={perm.id}
                permission={perm}
                isEnabled={isEnabled}
                onToggle={() => handleToggle(perm.id)}
              />
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
    marginBottom: 6,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  cardsList: {
    gap: 14,
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 4,
  },
});
