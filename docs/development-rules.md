# Development Rules & Engineering Standards

These rules ensure consistent code quality, cross-platform performance, and architectural discipline across the codebase.

---

## 1. Core Engineering Principles

- **Inspect Before Coding:** Inspect existing configurations (`package.json`, `app.json`, `tsconfig.json`) and existing modules before creating new code.
- **Single Source of Truth:** All styling decisions derive from `src/theme/`. Types derive from dedicated type definitions in `types/`.
- **Strict TypeScript:** No `any`, `@ts-ignore`, or untyped props. All component props and data models must be explicitly typed.
- **Component Responsibility:** Components are primarily responsible for layout, composition, and presentation.
- **No Premature Abstractions:** Avoid creating unused wrapper functions or empty service stubs before they are required by active feature implementations.
- **Continuous Native Generation (CNG):** Never edit or commit `/android` or `/ios` native project files. All native configurations must be declared in `app.json` or config plugins.

---

## 2. React Native & Performance Best Practices

1. **Inline Styles:** Avoid creating large inline style objects inside render loops. Use `StyleSheet.create` for static styles and combine with dynamic theme tokens from `useTheme()`.
2. **Safe Areas:** Always wrap screen layouts with `ScreenContainer` or use `useSafeAreaInsets` to respect device notches, dynamic islands, and home indicators.
3. **Typography:** Use `ThemedText` for all text rendering to ensure consistent font weights, colors, and line heights.
4. **Platform Compatibility:** Ensure components render gracefully on both Android and iOS without platform-specific rendering bugs.

---

## 3. Pre-Commit Verification Checklist

Before completing any task or submitting changes, run and verify the following commands:

```bash
# 1. Type check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Code formatting check
npm run format:check

# 4. Dependency & config health check
npx expo-doctor
```
