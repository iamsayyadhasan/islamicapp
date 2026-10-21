import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useLocation } from '@/context/LocationContext';
import { FALLBACK_PRAYER_COORDINATES } from '../data/prayer-calculation-methods';
import { calculateDailyPrayerSchedule } from '../services/prayer-calculation.service';
import { usePrayerSettings } from '../context/PrayerSettingsContext';

export function useDynamicPrayerTimes() {
  const sharedLocation = useLocation();
  const { calculationMethod, madhab, setCalculationMethod, setMadhab } = usePrayerSettings();

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const isMountedRef = useRef(true);

  // Active geographic coordinates (live GPS or clearly labeled fallback)
  const isLive = sharedLocation.isLiveLocation && sharedLocation.coords !== null;
  const activeCoords = useMemo(
    () =>
      isLive
        ? sharedLocation.coords!
        : {
            latitude: FALLBACK_PRAYER_COORDINATES.latitude,
            longitude: FALLBACK_PRAYER_COORDINATES.longitude,
          },
    [isLive, sharedLocation.coords],
  );

  const displayLocation = isLive
    ? sharedLocation.locationLabel
    : sharedLocation.status === 'locating'
      ? 'Locating...'
      : FALLBACK_PRAYER_COORDINATES.locationLabel;

  // Calculate schedule dynamically based on active coordinates and settings
  const scheduleResult = useMemo(
    () =>
      calculateDailyPrayerSchedule({
        coords: activeCoords,
        now: currentTime,
        calculationMethod,
        madhab,
        isUsingFallback: !isLive,
      }),
    [activeCoords, currentTime, calculationMethod, madhab, isLive],
  );

  // 1-second timer to update clock, countdown, and active-prayer boundary
  useEffect(() => {
    isMountedRef.current = true;
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTime(new Date());
      }
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Recompute immediately when returning to foreground (AppState === 'active')
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isMountedRef.current) {
        setCurrentTime(new Date());
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setCurrentTime(new Date());
    await sharedLocation.refreshLocation();
  }, [sharedLocation]);

  return {
    ...scheduleResult,
    locationLabel: displayLocation,
    isLiveLocation: isLive,
    locationStatus: sharedLocation.status,
    canAskAgain: sharedLocation.canAskAgain,
    calculationMethodKey: calculationMethod,
    madhabKey: madhab,
    setCalculationMethod,
    setMadhab,
    refresh: handleRefresh,
    requestPermission: sharedLocation.requestPermission,
    openSettings: sharedLocation.openSettings,
  };
}
