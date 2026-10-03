# Multi-Theme System Guide

The **Islamic Companion** design system uses a 2-tier tokenized theme architecture supporting Light Mode, Dark Mode, and System Theme preferences.

---

## 1. Architecture Overview

```
src/theme/
├── tokens/              # Primitive values (raw palette, spacing, typography, radii)
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── radii.ts
├── themes/              # Semantic theme implementations
│   ├── light.ts         # Light mode color & token bindings
│   └── dark.ts          # Dark mode color & token bindings
├── types.ts             # Strict Theme & Token TypeScript interfaces
├── ThemeProvider.tsx    # React Context Provider managing active theme
├── useTheme.ts          # Hook to consume theme values in components
└── index.ts             # Public export barrier
```

---

## 2. Consuming the Theme in Components

Components consume theme tokens via the `useTheme()` hook:

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
          borderRadius: theme.radii.md,
          padding: theme.spacing.base,
        },
      ]}
    >
      <ThemedText variant="h3" color="primary">
        Sample Title
      </ThemedText>
      <ThemedText variant="bodySmall" color="secondary">
        Theme: {isDark ? 'Dark' : 'Light'}
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

---

## 3. Semantic Token Reference

### Backgrounds

- `theme.colors.background.primary`: Base screen canvas.
- `theme.colors.background.secondary`: Secondary elevated cards and modals.
- `theme.colors.background.tertiary`: Grouped lists, chips, and muted surfaces.
- `theme.colors.background.card`: Standard content card container.

### Text

- `theme.colors.text.primary`: High-contrast primary reading text.
- `theme.colors.text.secondary`: Muted body text and metadata labels.
- `theme.colors.text.tertiary`: Placeholders and disabled text.
- `theme.colors.text.brand`: Islamic emerald green accent text.
- `theme.colors.text.gold`: Gold accent text.
- `theme.colors.text.inverse`: High-contrast text on solid brand/status backgrounds.

### Qibla Specific

- `theme.colors.qibla.compassBg`: Dial circular background.
- `theme.colors.qibla.compassRing`: Outer compass ring border.
- `theme.colors.qibla.needleNorth`: Red magnetic North pointer.
- `theme.colors.qibla.needleKaaba`: Kaaba indicator badge & accent pointer.
- `theme.colors.qibla.alignedGlow`: Bright emerald glow ring displayed upon alignment.
