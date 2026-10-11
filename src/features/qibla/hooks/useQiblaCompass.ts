import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
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
import { DynamicQiblaState, SensorAccuracy } from '../types/qibla.types';
import { MOCK_QIBLA_SCREEN } from '../data/qibla.mock';

// Default fallback reference coordinates (New Delhi, India)
const FALLBACK_LAT = 28.6139;
const FALLBACK_LNG = 77.209;
const FALLBACK_DISTANCE = calculateQiblaDistance(FALLBACK_LAT, FALLBACK_LNG);

export function useQiblaCompass() {
  const isMountedRef = useRef(true);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

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
    ? `${formatCoordinates(activeLat, activeLng)} • ~${distanceKm.toLocaleString()} km to Kaaba`
    : `${MOCK_QIBLA_SCREEN.coordinates} • ~${FALLBACK_DISTANCE} km to Kaaba`;

  const [compassState, setCompassState] = useState<{
    deviceHeading: number | null;
    needleAngle: number;
    isAligned: boolean;
    accuracy: SensorAccuracy | null;
    isLiveCompass: boolean;
    sensorUnavailable: boolean;
  }>({
    deviceHeading: null,
    needleAngle: qiblaBearing,
    isAligned: false,
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
  const startWatchingHeading = useCallback((targetBearing: number) => {
    if (headingSubscriptionRef.current) return;

    if (Platform.OS === 'web') {
      if (isMountedRef.current) {
        setCompassState((prev) => ({
          ...prev,
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: targetBearing,
          sensorUnavailable: true,
        }));
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
        const needleAngle = calculateNeedleAngle(targetBearing, normalizedHeading);
        const aligned = isQiblaAligned(targetBearing, normalizedHeading);

        setCompassState({
          deviceHeading: Math.round(normalizedHeading),
          needleAngle: Math.round(needleAngle),
          isAligned: aligned,
          accuracy: currentAccuracy,
          isLiveCompass: true,
          sensorUnavailable: false,
        });
      },
      () => {
        if (!isMountedRef.current) return;
        setCompassState((prev) => ({
          ...prev,
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: targetBearing,
          sensorUnavailable: true,
        }));
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
        setCompassState((prev) => ({
          ...prev,
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: targetBearing,
          sensorUnavailable: true,
        }));
      });
  }, []);

  // Subscribe to device heading on mount
  useEffect(() => {
    isMountedRef.current = true;
    startWatchingHeading(qiblaBearing);

    return () => {
      isMountedRef.current = false;
      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
        headingSubscriptionRef.current = null;
      }
    };
  }, [startWatchingHeading, qiblaBearing]);

  const refresh = useCallback(async () => {
    if (headingSubscriptionRef.current) {
      headingSubscriptionRef.current.remove();
      headingSubscriptionRef.current = null;
    }
    await sharedLocation.refreshLocation();
    startWatchingHeading(qiblaBearing);
  }, [sharedLocation, startWatchingHeading, qiblaBearing]);

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
    needleAngle: compassState.isLiveCompass ? compassState.needleAngle : qiblaBearing,
    isAligned: compassState.isAligned,
    accuracy: compassState.accuracy,
    isLiveCompass: compassState.isLiveCompass,
    isUsingFallback: !isLive,
    canAskAgain: sharedLocation.canAskAgain,
    statusMessage: sharedLocation.statusMessage,
  };

  return {
    ...dynamicState,
    refresh,
    requestPermission: sharedLocation.requestPermission,
    openSettings: sharedLocation.openSettings,
  };
}
