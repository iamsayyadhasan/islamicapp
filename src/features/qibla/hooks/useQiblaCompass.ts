import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useLocation } from '@/context/LocationContext';
import {
  calculateNeedleAngle,
  calculateQiblaBearing,
  calculateQiblaDistance,
  formatCoordinates,
  getDirectionLabel,
  isQiblaAligned,
} from '../utils/qibla-geometry';
import { evaluateAlignmentTransition, triggerQiblaHapticFeedback } from '../utils/qibla-haptics';
import { DynamicQiblaState, SensorAccuracy } from '../types/qibla.types';
import { MOCK_QIBLA_SCREEN } from '../data/qibla.mock';

// Default fallback reference coordinates (New Delhi, India)
const FALLBACK_LAT = 28.6139;
const FALLBACK_LNG = 77.209;

export function useQiblaCompass() {
  const isMountedRef = useRef(true);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Haptic feedback user preference (enabled by default)
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Alignment transition tracking refs
  const wasAlignedRef = useRef<boolean>(false);
  const hasEstablishedBaselineRef = useRef<boolean>(false);
  const lastHapticTimeRef = useRef<number>(0);

  // Consume the single shared location context used by Home and Qibla
  const sharedLocation = useLocation();

  const isLive = sharedLocation.isLiveLocation && sharedLocation.coords !== null;
  const activeLat = isLive ? sharedLocation.coords!.latitude : FALLBACK_LAT;
  const activeLng = isLive ? sharedLocation.coords!.longitude : FALLBACK_LNG;

  const qiblaBearing = Math.round(calculateQiblaBearing(activeLat, activeLng));
  const distanceKm = calculateQiblaDistance(activeLat, activeLng);
  const directionLabel = getDirectionLabel(qiblaBearing);

  const cityName = isLive ? sharedLocation.locationLabel : MOCK_QIBLA_SCREEN.cityName;
  const locationLabel = isLive ? 'Your Location' : 'Sample Location';
  const coordinatesText = isLive
    ? formatCoordinates(activeLat, activeLng)
    : MOCK_QIBLA_SCREEN.coordinates;

  const [compassState, setCompassState] = useState<{
    deviceHeading: number | null;
    accuracy: SensorAccuracy | null;
    isLiveCompass: boolean;
    sensorUnavailable: boolean;
  }>({
    deviceHeading: null,
    accuracy: null,
    isLiveCompass: false,
    sensorUnavailable: false,
  });

  const mapAccuracy = (acc: number): SensorAccuracy => {
    if (acc >= 3) return 'high';
    if (acc === 2) return 'medium';
    if (acc === 1) return 'low';
    return 'uncalibrated';
  };

  /**
   * Starts watching compass heading from hardware magnetometer.
   */
  const startWatchingHeading = useCallback(() => {
    if (headingSubscriptionRef.current) return;

    if (Platform.OS === 'web') {
      if (isMountedRef.current) {
        setCompassState({
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

        setCompassState({
          deviceHeading: Math.round(normalizedHeading),
          accuracy: currentAccuracy,
          isLiveCompass: true,
          sensorUnavailable: false,
        });
      },
      () => {
        if (!isMountedRef.current) return;
        setCompassState({
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
        setCompassState({
          deviceHeading: null,
          accuracy: null,
          isLiveCompass: false,
          sensorUnavailable: true,
        });
      });
  }, []);

  // Subscribe to device heading on mount and handle AppState transitions
  useEffect(() => {
    isMountedRef.current = true;
    startWatchingHeading();

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        startWatchingHeading();
      } else {
        if (headingSubscriptionRef.current) {
          headingSubscriptionRef.current.remove();
          headingSubscriptionRef.current = null;
        }
      }
    });

    return () => {
      isMountedRef.current = false;
      appStateSub.remove();
      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
        headingSubscriptionRef.current = null;
      }
    };
  }, [startWatchingHeading]);

  const refresh = useCallback(async () => {
    if (headingSubscriptionRef.current) {
      headingSubscriptionRef.current.remove();
      headingSubscriptionRef.current = null;
    }
    await sharedLocation.refreshLocation();
    startWatchingHeading();
  }, [sharedLocation, startWatchingHeading]);

  // Derive needle angle and alignment dynamically from current bearing and heading
  const needleAngle =
    compassState.isLiveCompass && compassState.deviceHeading !== null
      ? Math.round(calculateNeedleAngle(qiblaBearing, compassState.deviceHeading))
      : qiblaBearing;

  const isAligned =
    compassState.isLiveCompass && compassState.deviceHeading !== null
      ? isQiblaAligned(qiblaBearing, compassState.deviceHeading)
      : false;

  // Evaluate alignment transition for haptic feedback
  useEffect(() => {
    if (!compassState.isLiveCompass || compassState.deviceHeading === null) {
      wasAlignedRef.current = false;
      hasEstablishedBaselineRef.current = false;
      return;
    }

    const {
      shouldTriggerHaptic,
      nextWasAligned,
      nextHasEstablishedBaseline,
      nextLastTriggerTimeMs,
    } = evaluateAlignmentTransition({
      isAligned,
      wasAligned: wasAlignedRef.current,
      hasEstablishedBaseline: hasEstablishedBaselineRef.current,
      hapticsEnabled,
      lastTriggerTimeMs: lastHapticTimeRef.current,
      currentTimeMs: Date.now(),
    });

    wasAlignedRef.current = nextWasAligned;
    hasEstablishedBaselineRef.current = nextHasEstablishedBaseline;
    lastHapticTimeRef.current = nextLastTriggerTimeMs;

    if (shouldTriggerHaptic) {
      void triggerQiblaHapticFeedback();
    }
  }, [isAligned, hapticsEnabled, compassState.isLiveCompass, compassState.deviceHeading]);

  const toggleHaptics = useCallback(() => {
    setHapticsEnabled((prev) => !prev);
  }, []);

  // Derive consolidated status
  let overallStatus: DynamicQiblaState['status'] = 'ready';
  if (sharedLocation.status === 'permission_denied') {
    overallStatus = 'permission_denied';
  } else if (sharedLocation.status === 'location_unavailable') {
    overallStatus = 'location_unavailable';
  } else if (sharedLocation.status === 'locating') {
    overallStatus = 'locating';
  } else if (compassState.sensorUnavailable) {
    overallStatus = 'sensor_unavailable';
  }

  const dynamicState: DynamicQiblaState = {
    status: overallStatus,
    userCoordinates: sharedLocation.coords,
    cityName,
    locationLabel,
    coordinates: coordinatesText,
    qiblaBearing,
    directionLabel,
    distanceKm,
    deviceHeading: compassState.deviceHeading,
    needleAngle,
    isAligned,
    accuracy: compassState.accuracy,
    isLiveCompass: compassState.isLiveCompass,
    isUsingFallback: !isLive,
    canAskAgain: sharedLocation.canAskAgain,
    statusMessage: sharedLocation.statusMessage,
    hapticsEnabled,
  };

  return {
    ...dynamicState,
    refresh,
    requestPermission: sharedLocation.requestPermission,
    openSettings: sharedLocation.openSettings,
    toggleHaptics,
    setHapticsEnabled,
  };
}
