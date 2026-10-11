import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
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
const FALLBACK_BEARING = calculateQiblaBearing(FALLBACK_LAT, FALLBACK_LNG);
const FALLBACK_DISTANCE = calculateQiblaDistance(FALLBACK_LAT, FALLBACK_LNG);

/**
 * Development-only structured logger for location boundaries.
 * Coordinates are intentionally redacted to preserve privacy.
 * Entire logging is eliminated in production builds.
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
  address?: Location.LocationGeocodedAddress | null;
}) {
  if (!__DEV__) return;

  let addressAudit: Record<string, unknown> | null = null;
  if (info.address) {
    const addr = info.address;
    const allFields: (keyof Location.LocationGeocodedAddress)[] = [
      'city',
      'district',
      'streetNumber',
      'street',
      'region',
      'subregion',
      'country',
      'postalCode',
      'name',
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
      summary: {
        city: addr.city,
        district: addr.district,
        region: addr.region,
        subregion: addr.subregion,
        country: addr.country,
        postalCode: addr.postalCode,
        isoCountryCode: addr.isoCountryCode,
      },
    };
  }

  console.log('[Location Boundary Audit (DEV)]', {
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

export function useQiblaCompass() {
  const isMountedRef = useRef(true);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const [state, setState] = useState<DynamicQiblaState>({
    status: 'locating',
    userCoordinates: null,
    cityName: MOCK_QIBLA_SCREEN.cityName,
    locationLabel: 'Sample Location',
    coordinates: `${MOCK_QIBLA_SCREEN.coordinates} • ~${FALLBACK_DISTANCE} km to Kaaba`,
    qiblaBearing: Math.round(FALLBACK_BEARING),
    directionLabel: getDirectionLabel(FALLBACK_BEARING),
    distanceKm: FALLBACK_DISTANCE,
    deviceHeading: null,
    needleAngle: Math.round(FALLBACK_BEARING),
    isAligned: false,
    accuracy: null,
    isLiveCompass: false,
    isUsingFallback: true,
    canAskAgain: true,
    statusMessage: null,
  });

  // Helper to map numeric accuracy from LocationHeadingObject to SensorAccuracy
  const mapAccuracy = (acc: number): SensorAccuracy => {
    if (acc >= 3) return 'high';
    if (acc === 2) return 'medium';
    if (acc === 1) return 'low';
    return 'uncalibrated';
  };

  /**
   * Starts watching device heading (compass orientation).
   */
  const startWatchingHeading = useCallback((bearing: number) => {
    // If already watching, don't create duplicate subscriptions
    if (headingSubscriptionRef.current) {
      return;
    }

    // Compass heading is not supported on web
    if (Platform.OS === 'web') {
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          status: 'sensor_unavailable',
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: prev.qiblaBearing,
          statusMessage: 'Compass hardware is not supported on web. Showing static Qibla bearing.',
        }));
      }
      return;
    }

    Location.watchHeadingAsync(
      (headingData) => {
        if (!isMountedRef.current) return;

        // trueHeading is relative to True North; fallback to magHeading if trueHeading < 0
        const rawHeading =
          headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;

        // Validate heading reading
        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) {
          return;
        }

        const normalizedHeading = ((rawHeading % 360) + 360) % 360;
        const currentAccuracy = mapAccuracy(headingData.accuracy);
        const needleAngle = calculateNeedleAngle(bearing, normalizedHeading);
        const aligned = isQiblaAligned(bearing, normalizedHeading);

        setState((prev) => ({
          ...prev,
          status: 'ready',
          deviceHeading: Math.round(normalizedHeading),
          needleAngle: Math.round(needleAngle),
          isAligned: aligned,
          accuracy: currentAccuracy,
          isLiveCompass: true,
          statusMessage:
            currentAccuracy === 'uncalibrated' || currentAccuracy === 'low'
              ? 'Move phone in a figure-8 motion to calibrate the compass.'
              : aligned
                ? 'Aligned with the Kaaba'
                : null,
        }));
      },
      (error) => {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          status: 'sensor_unavailable',
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: prev.qiblaBearing,
          statusMessage: `Compass error: ${error}. Showing static Qibla bearing.`,
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
      .catch((err) => {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          status: 'sensor_unavailable',
          deviceHeading: null,
          isLiveCompass: false,
          needleAngle: prev.qiblaBearing,
          statusMessage: 'Compass sensor unavailable. Showing static Qibla bearing.',
        }));
      });
  }, []);

  /**
   * Obtains location and calculates Qibla bearing.
   */
  const initializeLocationAndCompass = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // 1. Check existing permission without prompting prematurely
      let permResponse = await Location.getForegroundPermissionsAsync();

      // Request permission only if not determined yet and canAskAgain
      if (permResponse.status !== Location.PermissionStatus.GRANTED && permResponse.canAskAgain) {
        permResponse = await Location.requestForegroundPermissionsAsync();
      }

      if (permResponse.status !== Location.PermissionStatus.GRANTED) {
        if (!isMountedRef.current) return;
        const fallbackBearing = Math.round(FALLBACK_BEARING);

        logLocationDevBoundary({
          permissionStatus: permResponse.status,
          canAskAgain: permResponse.canAskAgain,
          fixSource: 'fallback_denied',
        });

        setState((prev) => ({
          ...prev,
          status: 'permission_denied',
          isUsingFallback: true,
          canAskAgain: permResponse.canAskAgain,
          locationLabel: 'Sample Location',
          cityName: MOCK_QIBLA_SCREEN.cityName,
          coordinates: `${MOCK_QIBLA_SCREEN.coordinates} • ~${FALLBACK_DISTANCE} km to Kaaba`,
          qiblaBearing: fallbackBearing,
          directionLabel: getDirectionLabel(fallbackBearing),
          needleAngle: fallbackBearing,
          distanceKm: FALLBACK_DISTANCE,
          statusMessage:
            'Location permission is required for your exact Qibla. Showing reference location.',
        }));
        // Still attempt compass on sample location if sensors are available
        startWatchingHeading(fallbackBearing);
        return;
      }

      // 2. Fetch device location (try current, fallback to last-known)
      let fixSource: 'current' | 'last_known' = 'current';
      let position: Location.LocationObject | null = null;
      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        // Fallback to last known position if current fix times out or fails
        position = await Location.getLastKnownPositionAsync();
        fixSource = 'last_known';
      }

      if (!position || !position.coords) {
        throw new Error('Unable to obtain device coordinates.');
      }

      const { latitude, longitude, accuracy } = position.coords;
      const calculatedBearing = Math.round(calculateQiblaBearing(latitude, longitude));
      const calculatedDistance = calculateQiblaDistance(latitude, longitude);
      const coordString = formatCoordinates(latitude, longitude);
      const directionLabel = getDirectionLabel(calculatedBearing);

      // 3. Resolve city name via reverse geocoding
      let resolvedCity = coordString;
      let geocodeAddress: Location.LocationGeocodedAddress | null = null;
      try {
        const geocodeResults = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocodeResults && geocodeResults.length > 0) {
          geocodeAddress = geocodeResults[0];
          const city =
            geocodeAddress.city ||
            geocodeAddress.subregion ||
            geocodeAddress.district ||
            geocodeAddress.region;
          const country = geocodeAddress.country;
          if (city && country) {
            resolvedCity = `${city}, ${country}`;
          } else if (city) {
            resolvedCity = city;
          } else if (country) {
            resolvedCity = country;
          }
        }
      } catch {
        // Retain coordinate string if reverse geocode fails (never invent fake data)
      }

      // Structured dev boundary logging
      logLocationDevBoundary({
        permissionStatus: permResponse.status,
        canAskAgain: permResponse.canAskAgain,
        fixSource,
        coords: {
          latitude,
          longitude,
          accuracy,
        },
        timestamp: position.timestamp,
        address: geocodeAddress,
      });

      if (!isMountedRef.current) return;

      setState((prev) => ({
        ...prev,
        status: 'ready',
        userCoordinates: { latitude, longitude },
        cityName: resolvedCity,
        locationLabel: 'Your Location',
        coordinates: `${coordString} • ~${calculatedDistance.toLocaleString()} km to Kaaba`,
        qiblaBearing: calculatedBearing,
        directionLabel,
        distanceKm: calculatedDistance,
        needleAngle: calculatedBearing,
        isUsingFallback: false,
        canAskAgain: permResponse.canAskAgain,
        statusMessage: null,
      }));

      // 4. Start compass heading subscription with live coordinates' bearing
      startWatchingHeading(calculatedBearing);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : 'Location service unavailable.';
      const fallbackBearing = Math.round(FALLBACK_BEARING);

      logLocationDevBoundary({
        permissionStatus: 'error',
        canAskAgain: false,
        fixSource: 'fallback_error',
      });

      setState((prev) => ({
        ...prev,
        status: 'location_unavailable',
        isUsingFallback: true,
        locationLabel: 'Sample Location',
        cityName: MOCK_QIBLA_SCREEN.cityName,
        coordinates: `${MOCK_QIBLA_SCREEN.coordinates} • ~${FALLBACK_DISTANCE} km to Kaaba`,
        qiblaBearing: fallbackBearing,
        directionLabel: getDirectionLabel(fallbackBearing),
        needleAngle: fallbackBearing,
        distanceKm: FALLBACK_DISTANCE,
        statusMessage: `${msg} Showing reference location.`,
      }));
      startWatchingHeading(fallbackBearing);
    }
  }, [startWatchingHeading]);

  // Request permission explicitly (e.g. from banner or button when canAskAgain is true)
  const requestPermission = useCallback(async () => {
    const res = await Location.requestForegroundPermissionsAsync();
    setState((prev) => ({ ...prev, canAskAgain: res.canAskAgain }));
    if (res.status === Location.PermissionStatus.GRANTED) {
      void initializeLocationAndCompass();
    }
  }, [initializeLocationAndCompass]);

  // Open native system settings when canAskAgain is false
  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      if (__DEV__) {
        console.warn('[useQiblaCompass] Could not open system settings:', err);
      }
    }
  }, []);

  // Refresh location & sensor calibration
  const refresh = useCallback(() => {
    if (headingSubscriptionRef.current) {
      headingSubscriptionRef.current.remove();
      headingSubscriptionRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      status: 'locating',
      statusMessage: 'Refreshing location and compass...',
    }));
    void initializeLocationAndCompass();
  }, [initializeLocationAndCompass]);

  // Listen for AppState changes (e.g. user returns from system settings)
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active' && isMountedRef.current) {
        try {
          const perm = await Location.getForegroundPermissionsAsync();
          if (perm.status === Location.PermissionStatus.GRANTED) {
            // If previously denied or missing live user coordinates, refresh automatically
            setState((prev) => {
              if (prev.status === 'permission_denied' || !prev.userCoordinates) {
                setTimeout(() => {
                  void initializeLocationAndCompass();
                }, 0);
                return {
                  ...prev,
                  status: 'locating',
                  canAskAgain: perm.canAskAgain,
                };
              }
              return { ...prev, canAskAgain: perm.canAskAgain };
            });
          } else {
            setState((prev) => ({
              ...prev,
              canAskAgain: perm.canAskAgain,
            }));
          }
        } catch {
          // Passive check ignores errors
        }
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [initializeLocationAndCompass]);

  useEffect(() => {
    isMountedRef.current = true;
    const timer = setTimeout(() => {
      void initializeLocationAndCompass();
    }, 0);

    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
        headingSubscriptionRef.current = null;
      }
    };
  }, [initializeLocationAndCompass]);

  return {
    ...state,
    refresh,
    requestPermission,
    openSettings,
  };
}
