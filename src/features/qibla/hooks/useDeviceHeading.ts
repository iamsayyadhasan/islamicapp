import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Location from 'expo-location';
import { SensorAccuracy } from '../types/qibla.types';

export interface DeviceHeadingState {
  deviceHeading: number | null;
  accuracy: SensorAccuracy | null;
  isLiveCompass: boolean;
  sensorUnavailable: boolean;
  trueHeading: number | null;
  magHeading: number | null;
  isTrueNorth: boolean;
}

/**
 * Maps heading accuracy to standard SensorAccuracy levels.
 *
 * Platform Payload details:
 * - Android (SensorManager): Discrete integers where 3 = HIGH, 2 = MEDIUM, 1 = LOW, 0 = UNRELIABLE.
 * - iOS (expo-location normalization): Expo's LocationUtils.swift normalizes CLHeading.headingAccuracy:
 *   3 (<20° uncertainty), 2 (20-35° uncertainty), 1 (35-50° uncertainty), 0 (>50° or uncalibrated).
 * - Fallback / raw degree safeguard: If a platform passes raw degrees (>3), smaller is better:
 *   <= 15° = high, <= 30° = medium, <= 45° = low, > 45° or <= 0 = uncalibrated.
 */
export const mapAccuracy = (acc: number | undefined | null): SensorAccuracy => {
  if (typeof acc !== 'number' || isNaN(acc) || acc <= 0) {
    return 'uncalibrated';
  }
  // Standard Expo normalized level (0-3)
  if (acc === 3) return 'high';
  if (acc === 2) return 'medium';
  if (acc === 1) return 'low';

  // Safeguard if a raw degree deviation (>3) is ever emitted
  if (acc <= 15) return 'high';
  if (acc <= 30) return 'medium';
  if (acc <= 45) return 'low';
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
    trueHeading: null,
    magHeading: null,
    isTrueNorth: false,
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
          trueHeading: null,
          magHeading: null,
          isTrueNorth: false,
        });
      }
      return;
    }

    Location.watchHeadingAsync(
      (headingData) => {
        if (!isMountedRef.current) return;

        // If trueHeading >= 0, OS provides heading adjusted for magnetic declination (True North)
        // If trueHeading < 0 or unavailable, fallback to magHeading (Magnetic North)
        const isTrueNorth =
          typeof headingData.trueHeading === 'number' &&
          !isNaN(headingData.trueHeading) &&
          headingData.trueHeading >= 0;

        const rawHeading = isTrueNorth ? headingData.trueHeading : headingData.magHeading;

        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) return;

        const normalizedHeading = ((rawHeading % 360) + 360) % 360;
        const currentAccuracy = mapAccuracy(headingData.accuracy);

        setHeadingState({
          deviceHeading: Math.round(normalizedHeading),
          accuracy: currentAccuracy,
          isLiveCompass: true,
          sensorUnavailable: false,
          trueHeading: isTrueNorth ? Math.round(headingData.trueHeading) : null,
          magHeading:
            typeof headingData.magHeading === 'number' && !isNaN(headingData.magHeading)
              ? Math.round(((headingData.magHeading % 360) + 360) % 360)
              : null,
          isTrueNorth,
        });
      },
      () => {
        if (!isMountedRef.current) return;
        setHeadingState({
          deviceHeading: null,
          accuracy: null,
          isLiveCompass: false,
          sensorUnavailable: true,
          trueHeading: null,
          magHeading: null,
          isTrueNorth: false,
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
          trueHeading: null,
          magHeading: null,
          isTrueNorth: false,
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
