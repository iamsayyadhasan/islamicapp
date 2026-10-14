import type * as Location from 'expo-location';

export interface LocationDevBoundaryInfo {
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
}

/**
 * Development-only structured logger for location boundaries.
 * Coordinates are intentionally redacted to preserve user privacy.
 * Stripped completely from production builds.
 */
export function logLocationDevBoundary(info: LocationDevBoundaryInfo): void {
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
