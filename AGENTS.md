# Senior Engineering Guidelines: Islamic Companion (Expo & React Native)

This is a production-grade Expo / React Native mobile application for iOS and Android. Prioritize mobile-first patterns, performance, clean architecture, and cross-platform compatibility.

---

## 1. Core Engineering Principles

1. **Inspect Before Modifying:** Always inspect existing code, configurations (`package.json`, `app.json`, `tsconfig.json`), and theme tokens before creating or updating files.
2. **Single Source of Truth:**
   - Visual tokens (colors, spacing, typography, radii) are centrally managed in `src/theme/`. Never use arbitrary hardcoded hex codes or spacing values in component styles.
   - Types and domain models reside in `src/types/` or `src/features/<feature>/types/`.
3. **No Duplicate Logic:** Math, utility functions, or common components must be placed in their respective shared modules (`src/utils/`, `src/components/`).
4. **Thin Route Layer:** Files inside `src/app/` are exclusively navigation route mounts. They must not contain complex business logic or heavy styling. Always delegate rendering to feature components.
5. **Strict Type Ownership:** Avoid `any` or `@ts-ignore`. All components, hooks, and data fixtures must be strictly typed.
6. **No Premature Abstractions:** Do not create empty service stubs, placeholder API wrappers, or external state stores until the active milestone requires them.
7. **Mock Data Hygiene:** Static fixtures must be placed in `src/features/<feature>/data/` and never embedded directly inside UI components or hooks.
8. **Continuous Native Generation (CNG):** Never manually edit or create `/android` or `/ios` directories. All native customizations must be declared in `app.json` or config plugins.

---

## 2. Directory Architecture & Layering

- **`src/app/`**: Expo Router screen routes and navigation layouts.
- **`src/features/<feature>/`**: Modular, self-contained domain features (`components/`, `data/`, `types/`, `index.ts`).
- **`src/components/`**: Reusable, domain-agnostic UI primitives (`ScreenContainer`, `ThemedText`).
- **`src/theme/`**: Centralized token system (`tokens/`, `themes/`, `ThemeProvider`, `useTheme`).
- **`src/types/`**: Global cross-cutting TypeScript definitions.
- **`docs/`**: Living architectural documentation.

---

## 3. Expo & React Native SDK Guidelines

1. Always install packages with `npx expo install <package>` to resolve SDK 57 compatible versions.
2. Keep the New Architecture enabled (default for Expo SDK 57 / React Native 0.86+).
3. Do not trust outdated LLM memory regarding Expo APIs—refer to official SDK 57 documentation.

---

## 4. Verification Workflow

Always run and verify the following commands before declaring any task complete:

```bash
npm run typecheck       # TypeScript compilation check
npm run lint            # ESLint static analysis
npm run format:check    # Prettier code formatting validation
npx expo-doctor         # Expo dependencies & config health check
```
