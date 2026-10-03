import { spacing } from './tokens/spacing';
import { radii } from './tokens/radii';
import { typography } from './tokens/typography';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SemanticColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    elevated: string;
    scrim: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    brand: string;
    gold: string;
  };
  border: {
    subtle: string;
    default: string;
    focus: string;
    active: string;
  };
  brand: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
  };
  qibla: {
    compassBg: string;
    compassRing: string;
    compassMarker: string;
    compassMarkerMajor: string;
    needleNorth: string;
    needleSouth: string;
    needleKaaba: string;
    alignedGlow: string;
    cardBg: string;
    badgeBg: string;
    badgeText: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Theme {
  name: 'light' | 'dark';
  isDark: boolean;
  colors: SemanticColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
}
