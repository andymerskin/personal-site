---
name: code-review
description: Review code for quality, performance, accessibility, and adherence to project standards for this Astro + Vue + TypeScript portfolio site. Use when reviewing pull requests, examining code changes, or when the user asks for a code review.
---

# Code Review Guidelines

Review code changes for this Astro 5.x portfolio project following these guidelines. Reference [AGENTS.md](../../AGENTS.md) for project context and conventions.

## Quick Review Checklist

- [ ] Component choice: Astro preferred, Vue only when interactivity required
- [ ] TypeScript: Strict mode compliance, proper types, readonly for constants
- [ ] Tailwind: Utilities on separate lines, dark mode variants, mobile-first
- [ ] Content: Schema validation, kebab-case filenames, proper image handling
- [ ] Performance: Image optimization, minimal JS, appropriate hydration
- [ ] Accessibility: Screen reader support, motion preferences, semantic HTML
- [ ] SEO: Structured data, OG tags, canonical URLs, alt text
- [ ] Code quality: Import ordering, formatting, error handling

## Component Architecture

### Astro vs Vue Decision

**Critical**: Verify Vue components are only used when interactivity is absolutely required.

✅ **Use Astro for**:
- Static content and layouts
- Server-side rendered elements
- Components without client-side JavaScript needs
- Better SEO and performance

✅ **Use Vue for**:
- Client-side state management
- User interactions requiring JavaScript
- Complex animations with GSAP
- Components needing reactivity

**Example - Good (Astro)**:
```astro
---
export interface Props {
  title: string;
  class?: string;
}

const { title, class: className } = Astro.props;
---

<div class={className}>
  <h2>{title}</h2>
</div>
```

**Example - Bad (Unnecessary Vue)**:
```vue
<!-- ❌ Static content doesn't need Vue -->
<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
</template>
```

**Example - Good (Vue with interactivity)**:
```vue
<!-- ✅ Animation requires Vue -->
<script setup lang="ts">
import { gsap } from "gsap";
import { onMounted, onUnmounted, ref } from "vue";

const element = ref<HTMLElement>();
let tl: gsap.core.Timeline | undefined;

onMounted(() => {
  // Animation setup
});

onUnmounted(() => {
  tl?.kill(); // ✅ Proper cleanup
});
</script>
```

### Component Patterns

**Astro Components**:
- Export TypeScript `Props` interface
- Use PascalCase for component files
- Destructure props with defaults: `const { prop = defaultValue } = Astro.props`

**Vue Components**:
- Use `<script setup lang="ts">` syntax
- Proper cleanup in `onUnmounted` (clear intervals, kill GSAP timelines)
- Check `prefers-reduced-motion` for animations
- Use `ref` with proper TypeScript types

## TypeScript & Type Safety

### Strict Mode Compliance

Project uses `astro/tsconfigs/strict`. Verify:

- ✅ No `any` types (use `unknown` if needed)
- ✅ Proper null/undefined handling
- ✅ Type-only imports use `type` keyword
- ✅ Readonly arrays/objects for constants

**Example - Good**:
```typescript
import type { SkillId } from "../content/skills.gen";

const items = [
  { href: "/hello", label: "Hello!" },
] as const satisfies LinkItem[];

type LinkItem = {
  readonly href: string;
  readonly label: string;
};
```

**Example - Bad**:
```typescript
// ❌ Missing readonly, no type safety
const items = [
  { href: "/hello", label: "Hello!" },
];
```

### Content Collection Types

- ✅ Use generated types from content collections (e.g., `SkillId` from `skills.gen`)
- ✅ Import content types: `import type { CollectionEntry } from "astro:content"`
- ✅ Validate schemas match content structure in `content.config.ts`

## Styling & Tailwind CSS

### Utility Organization

**Critical**: Tailwind utilities must be on separate lines for readability.

✅ **Good**:
```astro
<div
  class="mt-16"
  class:px-8
  class:animate-[rocking-alert_5s_ease-in-out_alternate_infinite]"
>
```

❌ **Bad**:
```astro
<div class="mt-16 px-8 animate-[rocking-alert_5s_ease-in-out_alternate_infinite]">
```

### Dark Mode

- ✅ Always include `dark:` variants when styling
- ✅ Test both light and dark modes
- ✅ Use CSS custom properties for theme values

**Example**:
```astro
<div class="bg-cyan-100 dark:bg-cyan-700/40">
```

### Mobile-First Design

- ✅ Start with mobile styles, add breakpoints: `md:`, `lg:`
- ✅ Test responsive behavior
- ✅ Use appropriate Tailwind responsive utilities

### Custom CSS

- ✅ Avoid custom CSS unless absolutely necessary
- ✅ Prefer Tailwind utilities
- ✅ If custom CSS needed, use scoped styles in components
- ✅ Global styles only in `src/styles/global.css`

## Content Collections

### Schema Validation

- ✅ Verify Zod schemas in `content.config.ts` match content structure
- ✅ Required fields are properly typed
- ✅ Optional fields use `.optional()` or `.default()`
- ✅ Image fields use `image()` helper

**Example - Good**:
```typescript
schema: ({ image }) =>
  z.object({
    title: z.string(),
    pubDate: z.date(),
    image: image().optional(), // ✅ Proper image handling
  }),
```

### File Naming

- ✅ Use kebab-case for content files: `building-trust-through-transparency.mdx`
- ✅ Include dates when chronological order matters
- ✅ Match collection directory structure

### Content Queries

- ✅ Proper filtering: `getCollection("blog", ({ data }) => !data.draft)`
- ✅ Correct sorting: `sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())`
- ✅ Handle optional fields: `(a.data.order ?? 0) - (b.data.order ?? 0)`

## Performance & Optimization

### Image Optimization

- ✅ Use `getImage` from `astro:assets` with proper widths/sizes
- ✅ Provide appropriate `sizes` attribute for responsive images
- ✅ Lazy load images when possible
- ✅ Use WebP/AVIF formats

**Example - Good**:
```astro
---
import { getImage } from "astro:assets";

const optimizedImage = await getImage({
  src: photo.data.src,
  widths: [360, 600],
  sizes: "(max-width: 639px) 600px, 360px",
});
---

<img src={optimizedImage.src} alt="Description" />
```

### Bundle Size

- ✅ Minimize client-side JavaScript
- ✅ Use appropriate Vue hydration directive:
  - `client:load` - Immediate (use sparingly)
  - `client:idle` - After page load (preferred)
  - `client:visible` - When visible (best for below-fold)
- ✅ Prefer SSG over SSR when possible
- ✅ Use dynamic imports for heavy components

### GSAP Animations

- ✅ Kill timelines in `onUnmounted`: `tl?.kill()`
- ✅ Check `prefers-reduced-motion` before animating
- ✅ Clean up tweens: `gsap.killTweensOf(element)`

**Example - Good**:
```typescript
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

if (prefersReducedMotion()) {
  setText(nextIdx); // Skip animation
  return;
}
```

## Accessibility

### Screen Readers

- ✅ Use `sr-only` class for visually hidden but accessible text
- ✅ Provide `aria-hidden="true"` for decorative elements
- ✅ Ensure all interactive elements have labels

**Example - Good**:
```astro
<h1>
  <span class="sr-only">{{ headlines[0] }}</span>
  <span aria-hidden="true">{{ headlines[0] }}</span>
</h1>
```

### Motion Preferences

- ✅ Always check `prefers-reduced-motion` in animations
- ✅ Provide non-animated fallback
- ✅ Respect user preferences

### Semantic HTML

- ✅ Use appropriate HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Form elements properly labeled

## SEO & Meta

### Structured Data

- ✅ Verify structured data components are present where needed
- ✅ Use `StructuredData.astro` component for JSON-LD

### Open Graph & Meta Tags

- ✅ Check Layout component receives proper props
- ✅ Verify OG image URLs are absolute
- ✅ Canonical URLs properly set
- ✅ `noindex`/`nofollow` used appropriately

**Example - Good**:
```astro
---
const ogImageUrl = new URL(image ?? DEFAULT_OG_PATH, Astro.site).href;
const canonicalUrl = canonical ?? Astro.url.href;
---

<SEO
  title={title}
  description={description}
  canonical={canonicalUrl}
/>
```

### Image Alt Text

- ✅ All images have descriptive alt text
- ✅ Decorative images use empty alt: `alt=""`
- ✅ Contextual alt text for content images

## Code Quality

### Import Ordering

Prettier enforces import order. Verify:

1. `astro:` imports first
2. External packages
3. Relative imports (`./`, `../`)
4. Type imports use `type` keyword

**Example - Good**:
```typescript
import { getCollection } from "astro:content";

import { gsap } from "gsap";

import Layout from "../../layouts/Layout.astro";
import type { SkillId } from "../content/skills.gen";
```

### Formatting

- ✅ Run `bun run format` before committing
- ✅ Prettier config includes Astro and Tailwind plugins
- ✅ Import separation enabled

### Package Manager

- ✅ Always use `bun` instead of `npm`
- ✅ Use `bunx` instead of `npx`
- ✅ Verify `bun.lock` is updated

### Error Handling

- ✅ Proper error handling in async operations
- ✅ Handle optional values: `value ?? defaultValue`
- ✅ Type guards for runtime checks

## Project-Specific Patterns

### Theme Support

- ✅ Dark mode uses `dark:` Tailwind variants
- ✅ Theme stored in `localStorage` as `themeMode`
- ✅ Theme initialization in `<head>` to prevent flash
- ✅ CSS uses `@custom-variant dark` for proper scoping

### Icon Usage

- ✅ RemixIcon (primary): `ri-github-fill`
- ✅ Lucide (secondary): Use `@lucide/astro` when needed
- ✅ Icons have proper `aria-label` or `sr-only` text

### Content Collection Patterns

- ✅ Work: Filter by `category` ("public" | "private" | "fun")
- ✅ Blog: Sort by `pubDate` descending
- ✅ Recommendations: Sort by `order` field (default 0)
- ✅ Skills: Use `SKILL_TYPE_ORDER` for consistent rendering

## Common Issues to Watch For

### Anti-Patterns

❌ **Vue component for static content**
- Use Astro instead

❌ **Missing cleanup in Vue components**
- Always clean up intervals, GSAP timelines, event listeners

❌ **Tailwind utilities on one line**
- Separate for readability

❌ **Missing dark mode variants**
- Always include `dark:` classes

❌ **Using `npm` instead of `bun`**
- Use `bun` for all package operations

❌ **Missing accessibility features**
- Check screen readers, motion preferences, semantic HTML

❌ **Unoptimized images**
- Use `getImage` with proper widths/sizes

❌ **Missing TypeScript types**
- Use strict mode, proper types, readonly for constants

## Review Feedback Format

When providing feedback, use this format:

- 🔴 **Critical**: Must fix before merge (bugs, security, accessibility)
- 🟡 **Suggestion**: Consider improving (performance, code quality)
- 🟢 **Nice to have**: Optional enhancement (polish, refactoring)

Provide specific file paths and line numbers when possible, with code examples showing the issue and suggested fix.
