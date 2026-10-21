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
 * Global standard: Muslim World League calculation method with Shafi'i Asr.
 * User can change this at any time without geographic auto-inference.
 */
export const DEFAULT_CALCULATION_METHOD: CalculationMethodKey = 'MuslimWorldLeague';
export const DEFAULT_MADHAB: MadhabKey = 'Shafi';

export const CALCULATION_METHOD_OPTIONS: CalculationMethodInfo[] = [
  {
    key: 'MuslimWorldLeague',
    label: 'Muslim World League',
    description: 'Standard international reference (Fajr 18°, Isha 17°)',
    region: 'International / Europe / Asia',
  },
  {
    key: 'Karachi',
    label: 'Univ. of Islamic Sciences, Karachi',
    description: 'Standard across India, Pakistan, Bangladesh (Fajr 18°, Isha 18°)',
    region: 'South Asia (India, Pakistan, Bangladesh)',
  },
  {
    key: 'UmmAlQura',
    label: 'Umm al-Qura University, Makkah',
    description: 'Standard in Saudi Arabia & Arabian Peninsula (Fajr 18.5°, Isha +90m)',
    region: 'Saudi Arabia & Gulf',
  },
  {
    key: 'Egyptian',
    label: 'Egyptian General Authority',
    description: 'Standard in Egypt, Africa & parts of Middle East (Fajr 19.5°, Isha 17.5°)',
    region: 'Egypt & North Africa',
  },
  {
    key: 'NorthAmerica',
    label: 'ISNA (North America)',
    description: 'Standard for USA and Canada (Fajr 15°, Isha 15°)',
    region: 'United States & Canada',
  },
  {
    key: 'Dubai',
    label: 'Dubai Islamic Affairs',
    description: 'Official method for the United Arab Emirates (Fajr 18.2°, Isha 18.2°)',
    region: 'United Arab Emirates',
  },
  {
    key: 'Singapore',
    label: 'MUIS (Singapore)',
    description: 'Official method for Singapore (Fajr 20°, Isha 18°)',
    region: 'Singapore & Southeast Asia',
  },
  {
    key: 'Turkey',
    label: 'Diyanet İşleri Başkanlığı',
    description: 'Official method for Turkey (Fajr 18°, Isha 17°)',
    region: 'Turkey',
  },
  {
    key: 'Qatar',
    label: 'Qatar Ministry of Awqaf',
    description: 'Standard in Qatar (Fajr 18°, Isha +90m)',
    region: 'Qatar',
  },
  {
    key: 'Kuwait',
    label: 'Kuwait Ministry of Awqaf',
    description: 'Standard in Kuwait (Fajr 18°, Isha 17.5°)',
    region: 'Kuwait',
  },
  {
    key: 'Tehran',
    label: 'University of Tehran',
    description: 'Institute of Geophysics (Fajr 17.7°, Isha 14°)',
    region: 'Iran',
  },
  {
    key: 'MoonsightingCommittee',
    label: 'Moonsighting Committee Worldwide',
    description: 'Standardized criteria by Moonsighting Committee',
    region: 'Global',
  },
];

export const MADHAB_OPTIONS: MadhabInfo[] = [
  {
    key: 'Shafi',
    label: "Shafi'i (Standard)",
    description: 'Asr begins when shadow equals object length (Shafi, Maliki, Hanbali)',
  },
  {
    key: 'Hanafi',
    label: 'Hanafi (Later Asr)',
    description:
      'Asr begins when shadow is twice object length (common in India, Pakistan, Turkey)',
  },
];
