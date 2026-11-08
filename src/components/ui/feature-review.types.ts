export interface MilestoneItem {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'review';
}

export interface FeatureUnderReviewProps {
  iconType: 'quran' | 'hadith';
  badgeText?: string;
  englishTitle: string;
  arabicTitle: string;
  tagline: string;
  overviewText: string;
  milestones: MilestoneItem[];
  scholarlyNote: string;
  etaLabel?: string;
}

