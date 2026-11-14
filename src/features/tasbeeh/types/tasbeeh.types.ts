export type TasbeehTarget = 33 | 99 | 100 | 1000;

export interface DhikrItem {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  defaultTarget: TasbeehTarget;
  virtue?: string;
}

export interface TasbeehState {
  count: number;
  target: TasbeehTarget;
  selectedDhikrId: string;
  completedRounds: number;
  soundEnabled?: boolean;
}

export type TasbeehSoundCue = 'tick' | 'complete' | 'none';

export interface TasbeehAudioOptions {
  soundEnabled: boolean;
  onToggleSound: () => void;
  playTapFeedback: (isTargetReached: boolean) => void;
}
