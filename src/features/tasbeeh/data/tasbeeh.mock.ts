import { DhikrItem, TasbeehTarget } from '../types/tasbeeh.types';

export const TASBEEH_TARGETS: TasbeehTarget[] = [33, 99, 100, 1000];

export const MOCK_DHIKR_ITEMS: DhikrItem[] = [
  {
    id: 'subhanallah',
    name: 'SubhanAllah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    defaultTarget: 33,
    virtue: "Declaring Allah's divine perfection above all creation.",
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah',
    defaultTarget: 33,
    virtue: 'Expressing sincere gratitude for all divine blessings.',
  },
  {
    id: 'allahu-akbar',
    name: 'Allahu Akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    defaultTarget: 33,
    virtue: 'Proclaiming the supreme majesty and greatness of Allah.',
  },
  {
    id: 'astaghfirullah',
    name: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    defaultTarget: 100,
    virtue: 'Seeking repentance, spiritual purification, and mercy.',
  },
  {
    id: 'la-ilaha-illallah',
    name: 'La ilaha illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'None has the right to be worshipped except Allah',
    defaultTarget: 100,
    virtue: 'The supreme declaration of Islamic Monotheism (Tawhid).',
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    name: 'SubhanAllahi wa bihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    meaning: 'Glory be to Allah and His is the praise',
    defaultTarget: 100,
    virtue: 'Whoever says this 100 times a day, their sins are forgiven.',
  },
];
