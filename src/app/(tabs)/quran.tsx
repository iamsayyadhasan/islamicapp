import React from 'react';
import { FeatureUnderReview, MilestoneItem } from '@/components';

const QURAN_MILESTONES: MilestoneItem[] = [
  {
    id: 'script',
    label: 'Uthmani Script & Verified Typography',
    status: 'completed',
  },
  {
    id: 'audio',
    label: 'High-Fidelity Audio Recitations (Alafasy & Al-Ghamdi)',
    status: 'completed',
  },
  {
    id: 'translation',
    label: 'Verse-by-Verse Multi-Language Translations',
    status: 'in_progress',
  },
  {
    id: 'verification',
    label: 'Scholarly Tajweed & Tashkeel Accuracy Audit',
    status: 'review',
  },
];

export default function QuranTab() {
  return (
    <FeatureUnderReview
      iconType="quran"
      badgeText="Under Active Scholarly Review"
      arabicTitle="القرآن الكريم"
      englishTitle="The Holy Qur'an"
      tagline="Read, listen, and reflect upon the Divine Words"
      overviewText="A complete digital Quran reader featuring verified Madani Mushaf typography, verse-by-verse audio recitations, and authentic commentaries."
      milestones={QURAN_MILESTONES}
      scholarlyNote="To maintain absolute reverence and sacred accuracy, all text and Tajweed markers are undergoing rigorous audit by certified scholars before public launch."
      etaLabel="Scheduled for release in the upcoming milestone update, in sha Allah"
    />
  );
}
