# Developer Quick Reference: Islamic Companion

A practical guide and reference sheet for engineers working on or extending the **Islamic Companion** codebase.

---

## 1. Directory Placement Rules

| What are you adding?              | Target Directory                                | Convention / Pattern                                              |
| :-------------------------------- | :---------------------------------------------- | :---------------------------------------------------------------- |
| **New Navigation Screen**         | `src/app/` or `src/app/(tabs)/`                 | Thin mount file importing from `src/features/<feature>`.          |
| **New Domain Feature**            | `src/features/<feature-name>/`                  | Create `components/`, `data/`, `types/`, and `index.ts`.          |
| **Reusable Generic UI Primitive** | `src/components/`                               | Place under `layout/`, `typography/`, `ui/`, or `illustrations/`. |
| **Global Cross-Cutting Types**    | `src/types/`                                    | Add to `src/types/common.ts` or new declaration file.             |
| **Feature-Specific Types**        | `src/features/<feature>/types/`                 | Name as `<feature>.types.ts`. Export via `index.ts`.              |
| **Static Mock Data Fixture**      | `src/features/<feature>/data/`                  | Name as `<feature>.mock.ts`. Export typed fixtures.               |
| **Future API Services**           | `src/features/<feature>/services/`              | Encapsulate endpoints, requests, and DTO mappers.                 |
| **Custom React Hooks**            | `src/features/<feature>/hooks/` or `src/hooks/` | Prefix with `use` (e.g., `usePrayerTimes.ts`).                    |
| **Color / Typography Tokens**     | `src/theme/tokens/`                             | Add to `colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`.    |
| **Semantic Theme Mappings**       | `src/theme/themes/`                             | Update `light.ts` and `dark.ts` simultaneously.                   |
| **Bottom Tab Navigation Item**    | `src/app/(tabs)/_layout.tsx`                    | Add `<Tabs.Screen name="..." />` with SVG icon.                   |
| **App Configuration & Metadata**  | `app.json`                                      | Configure package name, version, icons, or plugins.               |
| **EAS Build Configuration**       | `eas.json`                                      | Configure build profiles, channels, and output types.             |

---

## 2. Essential Commands

### Development Server

```bash
# Start Metro bundler (interactive)
npm start

# Start directly for Android
npm run android

# Start directly for iOS (macOS required)
npm run ios

# Start directly for Web
npm run web
```

### Pre-Commit Code Quality Checklist

Always run and pass all four verification commands before submitting code:

```bash
# 1. TypeScript compilation check
npm run typecheck

# 2. ESLint static analysis check
npm run lint

# 3. Prettier formatting check
npm run format:check

# 4. Auto-format all code
npm run format

# 5. Expo SDK & configuration health check
npx expo-doctor
```

### Build & EAS Deployment

```bash
# Check EAS login status
npx eas-cli whoami

# Build installable Android APK (preview profile)
eas build --platform android --profile preview

# View active build details & logs
eas build:view <build-id>
```

---

## 3. How-To Cheat Sheet

### How to Add a New Screen

1. Create your feature component in `src/features/<feature>/components/<ScreenName>.tsx`.
2. Export it from `src/features/<feature>/index.ts`.
3. Create the route file in `src/app/<route-name>.tsx` (e.g., `src/app/settings.tsx`):
   ```tsx
   import { SettingsScreen } from '@/features/settings';

   export default function SettingsRoute() {
     return <SettingsScreen />;
   }
   ```
4. Register the route in `src/app/_layout.tsx` if it requires custom stack options:
   ```tsx
   <Stack.Screen name="settings" options={{ headerShown: false }} />
   ```

### How to Use the Theme System

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { ThemedText } from '@/components/typography/ThemedText';

export function ExampleCard() {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.base,
        },
      ]}
    >
      <ThemedText variant="h3" color="primary" weight="bold">
        Title
      </ThemedText>
      <ThemedText variant="bodySmall" color="secondary">
        Subtext ({isDark ? 'Dark Mode' : 'Light Mode'})
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
```

### How to Wrap Screens for Safe Area Handling

Always use `ScreenContainer` from `@/components/layout/ScreenContainer` to ensure proper safe area insets on notched devices:

```tsx
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export function MyScreen() {
  return <ScreenContainer style={styles.container}>{/* Screen Content */}</ScreenContainer>;
}
```
