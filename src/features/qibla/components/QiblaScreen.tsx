import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CompassDial } from './CompassDial';
import { QiblaInfoCard } from './QiblaInfoCard';
import { QiblaHeader } from './QiblaHeader';
import { QiblaStatusBanner } from './QiblaStatusBanner';
import { useQiblaCompass } from '../hooks/useQiblaCompass';

export function QiblaScreen() {
  const router = useRouter();
  const {
    status,
    cityName,
    locationLabel,
    coordinates,
    qiblaBearing,
    directionLabel,
    needleAngle,
    dialAngle,
    isAligned,
    accuracy,
    isLiveCompass,
    canAskAgain,
    hapticsEnabled,
    toggleHaptics,
    refresh,
    requestPermission,
    openSettings,
  } = useQiblaCompass();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <QiblaHeader
          onBack={handleBack}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={toggleHaptics}
          onRefresh={refresh}
        />

        <QiblaStatusBanner
          qiblaBearing={qiblaBearing}
          directionLabel={directionLabel}
          isLiveCompass={isLiveCompass}
          isAligned={isAligned}
          status={status}
          canAskAgain={canAskAgain}
          accuracy={accuracy}
          onRequestPermission={requestPermission}
          onOpenSettings={openSettings}
        />

        {/* Main UI Focus: Large Circular Compass Dial */}
        <View style={styles.compassWrapper}>
          <CompassDial heading={needleAngle} dialHeading={dialAngle} isAligned={isAligned} />
        </View>

        {/* Bottom Rounded Location Card */}
        <QiblaInfoCard
          data={{
            locationLabel,
            cityName,
            coordinates,
          }}
          onRefresh={refresh}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 88, // Safe clearance above bottom tab bar without clipping
    justifyContent: 'space-between',
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
});
