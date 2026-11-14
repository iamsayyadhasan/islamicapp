import type * as Location from 'expo-location';

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
