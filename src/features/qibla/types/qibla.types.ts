export type SensorAccuracy = 'low' | 'medium' | 'high' | 'uncalibrated';

export type QiblaSensorStatus =
  | 'idle'
  | 'requesting_permission'
  | 'permission_denied'
  | 'locating'
  | 'location_unavailable'
  | 'ready'
  | 'sensor_unavailable';

export interface QiblaLocationMock {
  id: string;
  city: string;
  country: string;
  qiblaBearing: number;
  distanceKm: number;
  directionLabel: string;
}

export interface QiblaUiState {
  currentHeading: number;
  qiblaBearing: number;
  isAligned: boolean;
  accuracy: SensorAccuracy;
  selectedLocation: QiblaLocationMock;
}

export interface DynamicQiblaState {
  status: QiblaSensorStatus;
  userCoordinates: { latitude: number; longitude: number } | null;
  cityName: string;
  locationLabel: string;
  coordinates: string;
  qiblaBearing: number;
  directionLabel: string;
  distanceKm: number;
  deviceHeading: number | null;
  needleAngle: number;
  isAligned: boolean;
  accuracy: SensorAccuracy | null;
  isLiveCompass: boolean;
  isUsingFallback: boolean;
  canAskAgain: boolean;
  statusMessage: string | null;
}
