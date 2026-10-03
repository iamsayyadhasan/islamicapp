import { palette } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radii } from '../tokens/radii';
import { typography } from '../tokens/typography';
import { Theme } from '../types';

export const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  colors: {
    background: {
      primary: palette.slate[950],
      secondary: palette.slate[900],
      tertiary: palette.slate[800],
      card: palette.slate[900],
      elevated: palette.slate[800],
      scrim: 'rgba(0, 0, 0, 0.7)',
    },
    text: {
      primary: palette.slate[50],
      secondary: palette.slate[400],
      tertiary: palette.slate[500],
      inverse: palette.slate[900],
      brand: palette.forestGreen[400],
      gold: palette.gold[400],
    },
    border: {
      subtle: palette.slate[800],
      default: palette.slate[700],
      focus: palette.forestGreen[400],
      active: palette.forestGreen[500],
    },
    brand: {
      primary: palette.forestGreen[500],
      primaryLight: palette.forestGreen[950],
      primaryDark: palette.forestGreen[400],
      secondary: palette.gold[400],
      accent: palette.forestGreen[400],
    },
    qibla: {
      compassBg: palette.slate[900],
      compassRing: palette.slate[800],
      compassMarker: palette.slate[600],
      compassMarkerMajor: palette.slate[300],
      needleNorth: palette.forestGreen[400],
      needleSouth: palette.slate[600],
      needleKaaba: palette.gold[400],
      alignedGlow: palette.forestGreen[500],
      cardBg: palette.slate[900],
      badgeBg: 'rgba(12, 67, 38, 0.4)',
      badgeText: palette.forestGreen[300],
    },
    status: {
      success: palette.forestGreen[400],
      warning: palette.amber[500],
      error: palette.red[500],
      info: palette.blue[500],
    },
  },
  spacing,
  radii,
  typography,
};
