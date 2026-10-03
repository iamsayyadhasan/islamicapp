export type SensorAccuracy = 'low' | 'medium' | 'high';

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
