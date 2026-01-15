---
name: OxlintHybridLinting
overview: Add fast Oxlint-based linting across JS/TS + Astro/Vue script blocks, and keep ESLint narrowly scoped to Vue template linting to preserve coverage while minimizing lint runtime.
todos:
  - id: repo-scan
    content: Confirm any existing typecheck/lint expectations (e.g., CI scripts, pre-commit hooks) and identify generated files to ignore.
    status: completed
  - id: add-oxlint
    content: Add `oxlint` and create `.oxlintrc.json` + ignore rules for dist/node_modules/.astro.
    status: in_progress
  - id: add-eslint-vue
    content: Add ESLint + Vue template linting (flat config, only `src/**/*.vue`), optionally using `eslint-plugin-oxlint` to minimize overlap.
    status: pending
  - id: scripts
    content: Add `lint`, `lint:fix`, and optional `check` scripts in `package.json` using Bun-friendly commands.
    status: pending
  - id: verify
    content: Run lint on representative `.astro` and `.vue` files and tune env/globals to eliminate false positives while keeping signal high.
    status: pending
---

## Goals

- Make linting **significantly faster** by using **Oxlint** for the bulk of checks.
- Preserve **Vue template** linting coverage via **ESLint** (scoped to `.vue` only), since Oxlint lints only `<script>` blocks.
- Keep Tailwind-related class ordering/formatting handled by existing **Prettier plugins**.

## What the repo is using today (compatibility notes)

- **Astro 5 + Vue 3 + Tailwind v4** (`astro.config.mjs` integrates `@astrojs/vue` and `@tailwindcss/vite`).
- No existing lint runner: `package.json` has **Prettier** but **no `lint` script** and no ESLint config.
- Vue SFCs use `<script setup>` and compiler macros like `defineProps` (e.g. `src/components/Accordion.vue`).
- `.astro` files rely on the **`Astro` global** in frontmatter and include **inline browser scripts** (e.g. `src/layouts/Layout.astro` uses `document`, `window`, `localStorage`).

## Recommended approach

### 1) Add Oxlint for fast “most of the codebase” linting

- Install `oxlint` as a dev dependency.
- Add `.oxlintrc.json` configured for your environments and file types:
- **env**: `browser` and `node` (because you have both inline browser scripts and Node scripts).
- **globals**: declare `Astro` as `readonly` (so `.astro` frontmatter doesn’t trigger undefined-global issues).
- **plugins**: enable `vue` (for Vue `<script setup>` rules/macros) and optionally `import` if you want import hygiene rules (kept minimal at first).
- **categories**: enable `correctness` as `error`, optionally `suspicious` as `warn` (since you chose “CI allows warnings”).
- Add `.oxlintignore` (or `ignorePatterns` in config) for typical build outputs and generated artifacts (`dist/`, `node_modules/`, `.astro/`, etc.).

### 2) Add ESLint (scoped) for Vue template linting only

- Install:
- `eslint`
- `eslint-plugin-vue`
- `vue-eslint-parser`
- `@typescript-eslint/parser` (for `<script setup lang="ts">` parsing)
- `eslint-plugin-oxlint` (optional but recommended): disables overlapping ESLint rules already covered by Oxlint, so ESLint remains lightweight.
- Add an `eslint.config.js` (flat config, ESM-compatible since `package.json` is `type: "module"`) that:
- Targets only `src/**/*.vue`.
- Enables Vue 3 recommended rules (template-focused).
- Sets `env: { "vue/setup-compiler-macros": true }` to avoid false `defineProps`/`defineEmits` undefined errors.
- Keeps general JS/TS rules minimal (Oxlint is the primary linter).

### 3) Add package scripts (Bun-first)

Update `package.json` scripts to include:

- `lint`: run `oxlint` across the repo, then `eslint` scoped to `src/**/*.vue`.
- `lint:fix`: run `oxlint --fix` then `eslint --fix` for `.vue`.
- (Optional) `check`: run `astro check` for typechecking (separate from lint to keep lint fast).

### 4) Validate on this repo

- Run lint on representative files:
- `.astro` with frontmatter + inline browser script (`src/layouts/Layout.astro`).
- Vue SFC using `<script setup lang="ts">` and template bindings (`src/components/Accordion.vue`, `src/components/Tooltip.vue`).
- Adjust Oxlint `env/globals` and ESLint Vue config to remove any false positives.

## Files likely to change

- [`package.json`](package.json) (add deps + scripts)
- Add [`.oxlintrc.json`](.oxlintrc.json) and optionally [`.oxlintignore`](.oxlintignore)
- Add [`eslint.config.js`](eslint.config.js) (flat config)
- Optionally add [`.eslintignore`](.eslintignore) if needed

## Key implementation details (why these settings)

- `.astro` frontmatter uses the `Astro` global, so Oxlint needs it declared (otherwise undefined-global lint noise).
- Inline browser scripts in Astro layout use `window/document/localStorage`, so Oxlint needs `env.browser` enabled.
- Vue SFCs rely on `<script setup>` macros; Oxlint’s `vue` plugin handles script-block rules, while ESLint is retained for template AST linting (which Oxlint does not do).
