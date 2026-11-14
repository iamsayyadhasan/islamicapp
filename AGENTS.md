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
- **`src/components/`**: Reusable, domain-agnostic UI primitives (`ScreenContainer`, `ThemedText`, `PrimaryButton`).
- **`src/context/`**: Cross-cutting application state providers (`LocationContext`).
- **`src/utils/`**: Reusable, pure calculation and formatting utilities (`prayer-schedule`, `location-formatter`).
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

## 5. File Size & Modular Code Guidelines

1. **Preferred File Size:** Keep every source code file at approximately 200 lines or fewer whenever practical.

2. **Maximum File Size:** A source code file should not exceed 250 lines. If a file approaches or exceeds this limit, refactor it into smaller, logically organized modules.

3. **Split by Responsibility:** Separate large files according to their actual responsibilities. For example:
   - UI rendering → focused components
   - Business logic → domain functions or services
   - React state and side effects → custom hooks
   - Types and interfaces → dedicated type files
   - Static fixtures → data files
   - Reusable calculations → utility modules
   - Validation and formatting → dedicated helpers

4. **Keep Components Focused:** A component should primarily handle one coherent UI responsibility. Extract repeated or independently meaningful sections into child components when doing so improves readability and maintainability.

5. **Avoid Artificial Splitting:** Do not split files into tiny modules merely to satisfy the line limit. Every extracted module must have a clear responsibility and improve code organization.

6. **Preserve Existing Architecture:** Follow the current feature-based structure under `src/features/<feature>/`. Keep feature-specific code inside its feature directory unless it is genuinely shared across features.

7. **Keep Route Files Thin:** Files under `src/app/` must remain lightweight navigation route mounts. Move screen rendering and business logic into the appropriate feature modules.

8. **Count Code, Not Just Lines:** The limit is a maintainability guideline for source code. Blank lines, comments, and formatting should not be manipulated to evade it. Generated files, lockfiles, snapshots, and other machine-generated artifacts are exempt.

9. **Refactor Safely:** When splitting a file:
   - Preserve existing behavior, UI, navigation, and public interfaces.
   - Update imports and exports correctly.
   - Avoid circular dependencies.
   - Avoid duplicating logic or creating unnecessary abstractions.
   - Add or update tests where appropriate.
   - Run the project's required verification commands after the refactor.

10. **Existing Oversized Files:** When modifying a source file that already exceeds 250 lines, assess whether it can be safely split as part of the task. Do not perform unrelated, large-scale refactors without a clear benefit.

11. **Exceptions Require Justification:** If a file must exceed 250 lines for a legitimate technical reason, explain the reason in the final report and identify why splitting it would reduce maintainability.

12. **Final File Size Audit:** Before completing a task, check the size of newly created or substantially modified source files. Report any files exceeding 250 lines and explain any justified exceptions.

## 6. Definition of Done

A task is complete only when:

- The implementation follows the existing architecture and file-size guidelines.
- No avoidable source file exceeds 250 lines.
- TypeScript, lint, formatting, and relevant tests pass.
- `npx expo-doctor` has been executed when required by the project verification workflow.
- Any failed checks, environmental blockers, or justified file-size exceptions are explicitly reported.
- The final report lists the important files changed and the verification results.

Never claim a check passed unless its command was actually executed and the result was verified.
