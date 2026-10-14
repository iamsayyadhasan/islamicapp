import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import {
  calculateNeedleAngle,
  calculateQiblaBearing,
  calculateQiblaDistance,
  formatCoordinates,
  getDirectionLabel,
  isQiblaAligned,
} from '../utils/qibla-geometry';
import {
  cancelActiveHapticSequence,
  evaluateAlignmentTransition,
  triggerQiblaHapticFeedback,
} from '../utils/qibla-haptics';
import { DynamicQiblaState } from '../types/qibla.types';
import { MOCK_QIBLA_SCREEN } from '../data/qibla.mock';
import { useDeviceHeading } from './useDeviceHeading';

// Default fallback reference coordinates (New Delhi, India)
const FALLBACK_LAT = 28.6139;
const FALLBACK_LNG = 77.209;

export function useQiblaCompass() {
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Alignment transition tracking refs
  const wasAlignedRef = useRef<boolean>(false);
  const hasEstablishedBaselineRef = useRef<boolean>(false);
  const lastHapticTimeRef = useRef<number>(0);

  // Shared location context
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

  // Magnetometer device heading subscription
  const { headingState, startWatchingHeading, stopWatchingHeading } = useDeviceHeading();

  const refresh = useCallback(async () => {
    stopWatchingHeading();
    await sharedLocation.refreshLocation();
    startWatchingHeading();
  }, [sharedLocation, startWatchingHeading, stopWatchingHeading]);

  // Derive needle angle and alignment dynamically from current bearing and heading
  const needleAngle =
    headingState.isLiveCompass && headingState.deviceHeading !== null
      ? Math.round(calculateNeedleAngle(qiblaBearing, headingState.deviceHeading))
      : qiblaBearing;

  const isAligned =
    headingState.isLiveCompass && headingState.deviceHeading !== null
      ? isQiblaAligned(qiblaBearing, headingState.deviceHeading)
      : false;

  // Evaluate alignment transition for haptic feedback
  useEffect(() => {
    if (!headingState.isLiveCompass || headingState.deviceHeading === null) {
      wasAlignedRef.current = false;
      hasEstablishedBaselineRef.current = false;
      cancelActiveHapticSequence();
      return;
    }

    if (!isAligned) {
      cancelActiveHapticSequence();
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

    return () => {
      cancelActiveHapticSequence();
    };
  }, [isAligned, hapticsEnabled, headingState.isLiveCompass, headingState.deviceHeading]);

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
  } else if (headingState.sensorUnavailable) {
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
    deviceHeading: headingState.deviceHeading,
    needleAngle,
    isAligned,
    accuracy: headingState.accuracy,
    isLiveCompass: headingState.isLiveCompass,
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
