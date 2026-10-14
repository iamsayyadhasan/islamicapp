import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Location from 'expo-location';
import { SensorAccuracy } from '../types/qibla.types';

export interface DeviceHeadingState {
  deviceHeading: number | null;
  accuracy: SensorAccuracy | null;
  isLiveCompass: boolean;
  sensorUnavailable: boolean;
}

const mapAccuracy = (acc: number): SensorAccuracy => {
  if (acc >= 3) return 'high';
  if (acc === 2) return 'medium';
  if (acc === 1) return 'low';
  return 'uncalibrated';
};

export function useDeviceHeading() {
  const isMountedRef = useRef(true);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const [headingState, setHeadingState] = useState<DeviceHeadingState>({
    deviceHeading: null,
    accuracy: null,
    isLiveCompass: false,
    sensorUnavailable: false,
  });

  const stopWatchingHeading = useCallback(() => {
    if (headingSubscriptionRef.current) {
      headingSubscriptionRef.current.remove();
      headingSubscriptionRef.current = null;
    }
  }, []);

  const startWatchingHeading = useCallback(() => {
    if (headingSubscriptionRef.current) return;

    if (Platform.OS === 'web') {
      if (isMountedRef.current) {
        setHeadingState({
          deviceHeading: null,
          accuracy: null,
          isLiveCompass: false,
          sensorUnavailable: true,
        });
      }
      return;
    }

    Location.watchHeadingAsync(
      (headingData) => {
        if (!isMountedRef.current) return;

        const rawHeading =
          headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;

        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) return;

        const normalizedHeading = ((rawHeading % 360) + 360) % 360;
        const currentAccuracy = mapAccuracy(headingData.accuracy);

        setHeadingState({
          deviceHeading: Math.round(normalizedHeading),
          accuracy: currentAccuracy,
          isLiveCompass: true,
          sensorUnavailable: false,
        });
      },
      () => {
        if (!isMountedRef.current) return;
        setHeadingState({
          deviceHeading: null,
          accuracy: null,
          isLiveCompass: false,
          sensorUnavailable: true,
        });
      },
    )
      .then((sub) => {
        if (!isMountedRef.current) {
          sub.remove();
        } else {
          headingSubscriptionRef.current = sub;
        }
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        setHeadingState({
          deviceHeading: null,
          accuracy: null,
          isLiveCompass: false,
          sensorUnavailable: true,
        });
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    startWatchingHeading();

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        startWatchingHeading();
      } else {
        stopWatchingHeading();
      }
    });

    return () => {
      isMountedRef.current = false;
      appStateSub.remove();
      stopWatchingHeading();
    };
  }, [startWatchingHeading, stopWatchingHeading]);

  return {
    headingState,
    startWatchingHeading,
    stopWatchingHeading,
  };
}
