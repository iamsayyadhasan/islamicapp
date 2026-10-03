import { LanguageOption, OnboardingFeatureItem, PermissionItem } from '../types/onboarding.types';

export const MOCK_FEATURES: OnboardingFeatureItem[] = [
  {
    id: 'prayer',
    icon: 'clock',
    title: 'Prayer Times',
    description: 'Accurate times with Adhan & notifications',
  },
  {
    id: 'quran',
    icon: 'book',
    title: "Qur'an",
    description: 'Read, listen and reflect anytime, anywhere',
  },
  {
    id: 'qibla',
    icon: 'compass',
    title: 'Qibla Direction',
    description: 'Find the Qibla wherever you are',
  },
  {
    id: 'hadith',
    icon: 'hadith',
    title: 'Hadith',
    description: 'Authentic collections and search',
  },
];

export const MOCK_LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English', nativeName: 'English', code: 'en' },
  { id: 'ar', name: 'العربية', nativeName: 'Arabic', code: 'ar', isRtl: true },
  { id: 'ur', name: 'اردو', nativeName: 'Urdu', code: 'ur', isRtl: true },
  { id: 'bn', name: 'বাংলা', nativeName: 'Bangla', code: 'bn' },
  { id: 'tr', name: 'Türkçe', nativeName: 'Turkish', code: 'tr' },
  { id: 'fa', name: 'فارسی', nativeName: 'Persian', code: 'fa', isRtl: true },
  { id: 'id', name: 'Indonesia', nativeName: 'Indonesian', code: 'id' },
];

export const MOCK_PERMISSIONS: PermissionItem[] = [
  {
    id: 'location',
    title: 'Location',
    description: 'To show prayer times accurately',
    icon: 'location',
    required: true,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'To send Adhan reminders',
    icon: 'notifications',
    required: false,
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'To download audio for offline use',
    icon: 'storage',
    required: false,
  },
];
