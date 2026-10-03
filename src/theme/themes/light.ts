import { palette } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radii } from '../tokens/radii';
import { typography } from '../tokens/typography';
import { Theme } from '../types';

export const lightTheme: Theme = {
  name: 'light',
  isDark: false,
  colors: {
    background: {
      primary: palette.cream[200], // #FBF9F4 warm cream background
      secondary: palette.white,
      tertiary: palette.cream[300],
      card: palette.white,
      elevated: palette.white,
      scrim: 'rgba(12, 67, 38, 0.4)',
    },
    text: {
      primary: '#1A2E22', // Dark Islamic slate-green text
      secondary: '#6A7870', // Subtle muted green-grey
      tertiary: '#9AA7A0',
      inverse: palette.white,
      brand: palette.forestGreen[800], // #0C4326 Deep green text
      gold: palette.gold[600],
    },
    border: {
      subtle: '#EAE6DC', // Warm subtle divider
      default: '#DDD8CB',
      focus: palette.forestGreen[800],
      active: palette.forestGreen[800],
    },
    brand: {
      primary: palette.forestGreen[800], // #0C4326
      primaryLight: palette.forestGreen[100], // #DCEDDE
      primaryDark: palette.forestGreen[950],
      secondary: palette.gold[500],
      accent: palette.forestGreen[600],
    },
    qibla: {
      compassBg: palette.cream[200], // #FAF8F2 Subtle warm compass dial
      compassRing: palette.cream[400], // #EFE8D6 Bezel ring
      compassMarker: '#8C9790',
      compassMarkerMajor: palette.forestGreen[800],
      needleNorth: palette.forestGreen[800],
      needleSouth: '#A0ACA5',
      needleKaaba: palette.gold[500],
      alignedGlow: palette.forestGreen[400],
      cardBg: palette.white,
      badgeBg: palette.forestGreen[100],
      badgeText: palette.forestGreen[800],
    },
    status: {
      success: palette.forestGreen[600],
      warning: palette.amber[500],
      error: palette.red[500],
      info: palette.blue[500],
    },
  },
  spacing,
  radii,
  typography,
};
