import React from 'react';
import { FeatureUnderReview, MilestoneItem } from '@/components';

const HADITH_MILESTONES: MilestoneItem[] = [
  {
    id: 'bukhari_muslim',
    label: 'Sahih al-Bukhari & Sahih Muslim Catalog',
    status: 'completed',
  },
  {
    id: 'categories',
    label: 'Categorized Topical Chapters (Iman, Salah, Akhlaq)',
    status: 'completed',
  },
  {
    id: 'bilingual',
    label: 'Arabic & English Dual Text Synchronization',
    status: 'in_progress',
  },
  {
    id: 'isnad',
    label: 'Chain of Transmission (Isnad) & Grading Verification',
    status: 'review',
  },
];

export default function HadithTab() {
  return (
    <FeatureUnderReview
      iconType="hadith"
      badgeText="Compilation & Grading In Progress"
      arabicTitle="الحديث الشريف"
      englishTitle="Hadith Collections"
      tagline="Authentic Teachings of Prophet Muhammad (ﷺ)"
      overviewText="Comprehensive searchable compilations from the primary Kutub al-Sittah with authentic Isnad chains and scholarly commentary."
      milestones={HADITH_MILESTONES}
      scholarlyNote="All Hadith narrations and authenticity gradings (Sahih, Hasan) are cross-verified by Hadith specialists against classical references."
      etaLabel="Scheduled for release in the upcoming milestone update, in sha Allah"
    />
  );
}
