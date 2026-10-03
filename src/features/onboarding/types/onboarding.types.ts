export interface OnboardingFeatureItem {
  id: string;
  icon: 'clock' | 'book' | 'compass' | 'hadith';
  title: string;
  description: string;
}

export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  isRtl?: boolean;
}

export interface PermissionItem {
  id: 'location' | 'notifications' | 'storage';
  title: string;
  description: string;
  icon: 'location' | 'notifications' | 'storage';
  required: boolean;
}
