import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';
import * as Location from 'expo-location';
import {
  formatCoordinates,
  formatLocationAddress,
  isValidCoordinate,
} from '@/utils/location-formatter';
import { logLocationDevBoundary } from '@/utils/location-dev-logger';
import type {
  LocationCoords,
  SharedLocationContextValue,
  SharedLocationStatus,
} from '@/types/location.types';

export type { LocationCoords, SharedLocationContextValue, SharedLocationStatus };

const DEFAULT_SAMPLE_LOCATION = 'Badaun, India (Sample)';

const LocationContext = createContext<SharedLocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const isMountedRef = useRef(true);

  const [status, setStatus] = useState<SharedLocationStatus>('locating');
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>(DEFAULT_SAMPLE_LOCATION);
  const [isLiveLocation, setIsLiveLocation] = useState<boolean>(false);
  const [canAskAgain, setCanAskAgain] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rawAddress, setRawAddress] = useState<Location.LocationGeocodedAddress | null>(null);

  const resetToFallback = useCallback((newStatus: SharedLocationStatus, msg: string | null) => {
    setStatus(newStatus);
    setCoords(null);
    setAccuracy(null);
    setLocationLabel(DEFAULT_SAMPLE_LOCATION);
    setIsLiveLocation(false);
    setStatusMessage(msg);
  }, []);

  // Acquires GPS coordinates and reverse-geocodes into a human-readable address.
  const resolveLocation = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // 1. Passive check of current permission
      let permResponse = await Location.getForegroundPermissionsAsync();
      if (permResponse.status !== Location.PermissionStatus.GRANTED && permResponse.canAskAgain) {
        permResponse = await Location.requestForegroundPermissionsAsync();
      }
      setCanAskAgain(permResponse.canAskAgain);
      if (permResponse.status !== Location.PermissionStatus.GRANTED) {
        if (!isMountedRef.current) return;
        logLocationDevBoundary({
          permissionStatus: permResponse.status,
          canAskAgain: permResponse.canAskAgain,
          fixSource: 'fallback_denied',
        });
        resetToFallback(
          'permission_denied',
          'Location permission is needed for your exact location.',
        );
        return;
      }

      // 2. Verify device location services (GPS hardware switch)
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (!isMountedRef.current) return;
        resetToFallback(
          'location_unavailable',
          'Location services are disabled on your device. Please enable GPS.',
        );
        return;
      }

      // 3. Obtain device location fix
      let fixSource: 'current' | 'last_known' = 'current';
      let position: Location.LocationObject | null = null;

      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        position = await Location.getLastKnownPositionAsync();
        fixSource = 'last_known';
      }

      if (!position || !position.coords) {
        throw new Error('Unable to obtain device coordinates.');
      }

      const { latitude, longitude, accuracy: posAccuracy } = position.coords;

      // Coordinate boundary and validity assertion
      if (!isValidCoordinate(latitude, longitude)) {
        throw new Error('Invalid GPS coordinates received from device.');
      }

      // 4. Reverse geocode to resolve locality/sector, city, region, country
      let geocodeAddress: Location.LocationGeocodedAddress | null = null;
      let formatted = '';

      try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results && results.length > 0) {
          geocodeAddress = results[0];
          formatted = formatLocationAddress(geocodeAddress) || '';
        }
      } catch {
        // Reverse geocoding failed or offline
      }

      // If reverse geocoding didn't yield text, fall back to coordinate representation
      if (!formatted) {
        formatted = formatCoordinates(latitude, longitude);
      }

      logLocationDevBoundary({
        permissionStatus: permResponse.status,
        canAskAgain: permResponse.canAskAgain,
        fixSource,
        coords: { latitude, longitude, accuracy: posAccuracy },
        timestamp: position.timestamp,
        formattedLocation: formatted,
        rawAddress: geocodeAddress,
      });

      if (!isMountedRef.current) return;

      setStatus('ready');
      setCoords({ latitude, longitude });
      setAccuracy(posAccuracy);
      setLocationLabel(formatted);
      setIsLiveLocation(true);
      setRawAddress(geocodeAddress);
      setStatusMessage(null);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : 'Location service unavailable.';

      logLocationDevBoundary({
        permissionStatus: 'error',
        canAskAgain: false,
        fixSource: 'fallback_error',
      });
      resetToFallback('location_unavailable', msg);
    }
  }, [resetToFallback]);

  const requestPermission = useCallback(async () => {
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      setCanAskAgain(res.canAskAgain);
      if (res.status === Location.PermissionStatus.GRANTED) {
        setStatus('locating');
        void resolveLocation();
      }
    } catch {
      // Handled gracefully
    }
  }, [resolveLocation]);

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Ignored if settings cannot be opened
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setStatus('locating');
    await resolveLocation();
  }, [resolveLocation]);

  // Synchronize on AppState active (e.g. when returning from device Settings)
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active' && isMountedRef.current) {
        try {
          const perm = await Location.getForegroundPermissionsAsync();
          setCanAskAgain(perm.canAskAgain);
          if (perm.status === Location.PermissionStatus.GRANTED) {
            // Re-resolve if location was not active, or passively verify services
            if (!isLiveLocation) {
              setStatus('locating');
              setTimeout(() => {
                void resolveLocation();
              }, 0);
            }
          } else if (isLiveLocation) {
            // Permission was revoked in settings while backgrounded
            void resolveLocation();
          }
        } catch {
          // Passive check ignored
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isLiveLocation, resolveLocation]);

  // Initial resolve on mount
  useEffect(() => {
    isMountedRef.current = true;
    const timer = setTimeout(() => {
      void resolveLocation();
    }, 0);

    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
    };
  }, [resolveLocation]);

  const value: SharedLocationContextValue = {
    status,
    coords,
    accuracy,
    locationLabel,
    isLiveLocation,
    canAskAgain,
    statusMessage,
    rawAddress,
    refreshLocation,
    requestPermission,
    openSettings,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): SharedLocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
