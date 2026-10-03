import { useThemeContext } from './ThemeProvider';

/**
 * Access the active theme, theme mode, and toggle functions.
 */
export function useTheme() {
  return useThemeContext();
}
