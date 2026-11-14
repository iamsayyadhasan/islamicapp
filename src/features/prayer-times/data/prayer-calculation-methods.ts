import {
  CalculationMethodInfo,
  CalculationMethodKey,
  MadhabInfo,
  MadhabKey,
} from '../types/prayer-times.types';

/**
 * Standard fallback coordinates when live GPS is denied or unavailable.
 * Explicitly labeled as Sample Location.
 */
export const FALLBACK_PRAYER_COORDINATES = {
  latitude: 28.6139,
  longitude: 77.209,
  locationLabel: 'New Delhi, India (Sample)',
};

/**
 * Clearly defined default configuration:
 * University of Islamic Sciences, Karachi calculation method with Hanafi Asr.
 * User can change this at any time without geographic auto-inference.
 */
export const DEFAULT_CALCULATION_METHOD: CalculationMethodKey = 'Karachi';
export const DEFAULT_MADHAB: MadhabKey = 'Hanafi';

export const CALCULATION_METHOD_OPTIONS: CalculationMethodInfo[] = [
  {
    key: 'Karachi',
    label: 'University of Islamic Sciences, Karachi',
    description: 'Fajr 18°, Isha 18°',
    region: 'Pakistan, India, Bangladesh, Afghanistan',
  },
  {
    key: 'MuslimWorldLeague',
    label: 'Muslim World League',
    description: 'Fajr 18°, Isha 17°',
    region: 'Nigeria, Morocco, Australia',
  },
  {
    key: 'Egyptian',
    label: 'Egyptian General Authority',
    description: 'Fajr 19.5°, Isha 17.5°',
    region: 'Egypt',
  },
  {
    key: 'Kuwait',
    label: 'Kuwait',
    description: 'Fajr 18°, Isha 17.5°',
    region: 'Kuwait',
  },
  {
    key: 'Qatar',
    label: 'Qatar',
    description: 'Fajr 18°, Isha 90 min after Maghrib',
    region: 'Qatar',
  },
  {
    key: 'Turkey',
    label: 'Diyanet (Turkey)',
    description: 'Fajr 18°, Isha 17°',
    region: 'Turkey',
  },
  {
    key: 'Singapore',
    label: 'Singapore / Malaysia / Indonesia',
    description: 'Fajr 20°, Isha 18°',
    region: 'Indonesia, Malaysia, Singapore',
  },
];

export const MADHAB_OPTIONS: MadhabInfo[] = [
  {
    key: 'Hanafi',
    label: 'Hanafi (Later Asr)',
    description:
      'Asr begins when shadow is twice object length (common in India, Pakistan, Turkey)',
  },
  {
    key: 'Shafi',
    label: "Shafi'i (Standard)",
    description: 'Asr begins when shadow equals object length (Shafi, Maliki, Hanbali)',
  },
];
