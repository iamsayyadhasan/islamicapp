import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';
import * as Location from 'expo-location';
import { formatLocationAddress } from '@/utils/location-formatter';
import { formatCoordinates } from '@/features/qibla/utils/qibla-geometry';

export type SharedLocationStatus =
  | 'idle'
  | 'locating'
  | 'ready'
  | 'permission_denied'
  | 'location_unavailable'
  | 'services_disabled';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface SharedLocationContextValue {
  status: SharedLocationStatus;
  coords: LocationCoords | null;
  accuracy: number | null;
  locationLabel: string;
  isLiveLocation: boolean;
  canAskAgain: boolean;
  statusMessage: string | null;
  rawAddress: Location.LocationGeocodedAddress | null;
  refreshLocation: () => Promise<void>;
  requestPermission: () => Promise<void>;
  openSettings: () => Promise<void>;
}

const DEFAULT_SAMPLE_LOCATION = 'Badaun, India (Sample)';

const LocationContext = createContext<SharedLocationContextValue | undefined>(undefined);

/**
 * Development-only structured logger for location boundaries.
 * Coordinates are intentionally redacted to preserve user privacy.
 * Stripped completely from production builds.
 */
function logLocationDevBoundary(info: {
  permissionStatus: string;
  canAskAgain: boolean;
  fixSource: 'current' | 'last_known' | 'fallback_denied' | 'fallback_error';
  coords?: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
  };
  timestamp?: number;
  formattedLocation?: string | null;
  rawAddress?: Location.LocationGeocodedAddress | null;
}) {
  if (!__DEV__) return;

  let addressAudit: Record<string, unknown> | null = null;
  if (info.rawAddress) {
    const addr = info.rawAddress;
    const allFields: (keyof Location.LocationGeocodedAddress)[] = [
      'name',
      'street',
      'district',
      'subregion',
      'city',
      'region',
      'country',
      'postalCode',
      'isoCountryCode',
      'timezone',
      'formattedAddress',
    ];

    const availableFields = allFields.filter(
      (f) => addr[f] !== null && addr[f] !== undefined && addr[f] !== '',
    );
    const missingFields = allFields.filter(
      (f) => addr[f] === null || addr[f] === undefined || addr[f] === '',
    );

    addressAudit = {
      availableFields,
      missingFields,
      formattedResult: info.formattedLocation,
    };
  }

  console.log('[Location Audit (DEV)]', {
    permissionStatus: info.permissionStatus,
    canAskAgain: info.canAskAgain,
    fixSource: info.fixSource,
    latitude: info.coords ? `${info.coords.latitude.toFixed(2)}*** (redacted)` : 'none',
    longitude: info.coords ? `${info.coords.longitude.toFixed(2)}*** (redacted)` : 'none',
    accuracyMeters: info.coords?.accuracy ?? 'unavailable',
    timestamp: info.timestamp ? new Date(info.timestamp).toISOString() : 'unavailable',
    reverseGeocoding: addressAudit ?? 'not_performed_or_unavailable',
  });
}

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

  /**
   * Acquires GPS coordinates and reverse-geocodes into a human-readable address.
   */
  const resolveLocation = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // 1. Passive check of current permission
      let permResponse = await Location.getForegroundPermissionsAsync();

      // If undetermined and allowed, request once
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

        setStatus('permission_denied');
        setCoords(null);
        setAccuracy(null);
        setLocationLabel(DEFAULT_SAMPLE_LOCATION);
        setIsLiveLocation(false);
        setStatusMessage('Location permission is needed for your exact location.');
        return;
      }

      // 2. Obtain device location fix
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

      // 3. Reverse geocode to resolve locality/sector, city, region, country
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
        coords: {
          latitude,
          longitude,
          accuracy: posAccuracy,
        },
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

      setStatus('location_unavailable');
      setCoords(null);
      setAccuracy(null);
      setLocationLabel(DEFAULT_SAMPLE_LOCATION);
      setIsLiveLocation(false);
      setStatusMessage(msg);
    }
  }, []);

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
    } catch (err) {
      if (__DEV__) {
        console.warn('[LocationContext] Could not open device settings:', err);
      }
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
          if (perm.status === Location.PermissionStatus.GRANTED && !isLiveLocation) {
            setStatus('locating');
            setTimeout(() => {
              void resolveLocation();
            }, 0);
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
