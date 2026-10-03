export interface QiblaScreenMock {
  angle: string;
  direction: string;
  locationLabel: string;
  cityName: string;
  coordinates: string;
}

export const MOCK_QIBLA_SCREEN: QiblaScreenMock = {
  angle: '293°',
  direction: 'North West',
  locationLabel: 'Your Location',
  cityName: 'New Delhi, India',
  coordinates: '28.6139° N, 77.2090° E',
};
