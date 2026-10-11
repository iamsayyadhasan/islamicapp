export interface QiblaScreenMock {
  angle: string;
  direction: string;
  locationLabel: string;
  cityName: string;
  coordinates: string;
}

export const MOCK_QIBLA_SCREEN: QiblaScreenMock = {
  angle: '267°',
  direction: 'West',
  locationLabel: 'Sample Location',
  cityName: 'New Delhi, India',
  coordinates: '28.6139° N, 77.2090° E',
};
