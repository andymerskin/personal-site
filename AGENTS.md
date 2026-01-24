# Agent Instructions for Personal Site Project

## Project Overview

This is a personal portfolio website built with Astro, featuring a content-driven approach with Vue components for interactive elements. The site showcases work, blog posts, thoughts, recommendations from colleagues, photos, and skills using MDX and YAML content collections. The site includes dark mode support and is deployed to Netlify.

## Tech Stack

- **Framework**: Astro 5.x with Vue 3 integration
- **Styling**: Tailwind CSS 4.x
- **Content**: MDX with Astro content collections
- **Animations**: GSAP
- **Icons**: RemixIcon (primary), Lucide (secondary)
- **Package Manager**: Bun
- **Formatting**: Prettier with Astro and Tailwind plugins

## Project Structure

### Content Organization

```
src/content/
├── blog/          # Blog posts (MDX files)
├── thoughts/      # Short thoughts/notes (MDX files)
├── work/          # Work/portfolio items (MDX files)
├── recommendations/ # Colleague recommendations (MDX files)
├── photos.yaml    # Photo gallery metadata
└── skills.yaml    # Skills and technologies metadata
```

### Components

```
src/components/
├── *.astro        # Static components (preferred for SSG)
├── *.vue          # Interactive components (use only when needed)
└── ...
```

### Pages & Layouts

```
src/pages/         # Route-based pages
├── hello.astro    # Homepage (redirected from /)
├── blog.astro     # Blog listing page
├── blog/[slug].astro  # Individual blog posts
├── work/
│   ├── public.astro   # Public work listing
│   ├── private.astro  # Private work listing
│   ├── fun.astro      # Fun projects listing
│   └── [slug].astro   # Individual work items
├── thoughts.astro # Thoughts listing page
├── colleagues.astro # Recommendations from colleagues
└── photos.astro   # Photo gallery

src/layouts/
└── Layout.astro   # Main site layout (includes navigation, theme toggle)
```

## Component Guidelines

### When to Use Astro Components

- **Default choice** for all components
- Static content and layouts
- Server-side rendered elements
- Components that don't need client-side JavaScript
- Better for SEO and performance

### When to Use Vue Components

- **Only when necessary** for interactivity
- Client-side state management
- User interactions requiring JavaScript
- Complex animations or dynamic behavior
- Components that need reactivity

### Component Naming

- Use PascalCase for component files
- Keep component names descriptive
- Group related components logically

## Content Management

### Content Collections Schema

**Work Collection** (`src/content/work/`):

```typescript
{
  title: string,
  category: "public" | "private" | "fun", // Work category
  type: string,      // e.g., "Product Design", "Development"
  year: string,      // e.g., "2024"
  headline: string,  // Short headline/description
  externalUrl: string, // URL to live project/demo
  classes?: string,  // Optional Tailwind classes
  logo: Image        // Project logo/image
}
```

**Blog Collection** (`src/content/blog/`):

```typescript
{
  title: string,
  pubDate: Date,
  image?: Image      // Optional hero image
}
```

**Thoughts Collection** (`src/content/thoughts/`):

```typescript
{
  date: Date,
  tags: string[]     // Default empty array
}
```

**Recommendations Collection** (`src/content/recommendations/`):

```typescript
{
  author: string,
  job: string,
  position?: string,  // Optional position/title
  photo: Image,
  previewBody?: string, // Optional preview text
  order?: number      // Optional ordering for display
}
```

**Photos Collection** (`src/content/photos.yaml`):

```typescript
{
  src: Image,
  caption: string
}
```

**Skills Collection** (`src/content/skills.yaml`):

```typescript
{
  id: SkillId,       // Must match SKILL_IDS enum
  name: string,
  icon: string,      // Icon identifier
  type: SkillType    // One of: "leadership", "design", "engineering", "frontend", "backend", "delivery", "old"
}
```

### Content File Naming

- Use kebab-case for filenames
- Include dates in filenames when chronological order matters
- Example: `building-trust-through-transparency.mdx`

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes for styling
- List Tailwind utilities on their own lines on HTML elements for better readability and management
- Leverage `@tailwindcss/typography` for prose content
- Follow mobile-first responsive design
- Use Tailwind's design tokens consistently

### CSS Organization

- Global styles in `src/styles/global.css`
- Component-specific styles within components
- Avoid custom CSS unless absolutely necessary
- Use CSS custom properties for theme values

## Development Workflow

### Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
bun run format   # Format code with Prettier
bun run sort-skills    # Sort skills in skills.yaml
bun run add-skill      # Interactive script to add new skill
bun run sync-skill-ids # Generate TS types for skill IDs
```

### Development Server Usage

**Agents should not try to run `bun run dev` or the dev server to test changes.** I will test changes manually. If the agent needs to verify that changes build correctly, run the build script (`bun run build`) instead, if needed.

### Package Management

**Always use `bun` instead of `npm` for agent-initiated shell execution:**

- `bun install` - Install dependencies (faster than npm)
- `bun add <package>` - Add new dependencies
- `bun remove <package>` - Remove dependencies
- `bunx <command>` - Execute binaries from node_modules (equivalent to npx)

### Code Quality

- Run `bun run format` before committing
- Use TypeScript for type safety
- Follow Astro and Vue best practices
- Keep components small and focused

## Content Creation

### Adding a Blog Post

1. Create new `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields
3. Write content using Markdown/MDX
4. Add optional hero image to frontmatter

### Adding Work/Project

1. Create new `.mdx` file in `src/content/work/`
2. Include all required frontmatter fields
3. Add project logo to `src/images/work/`
4. Write project description and details

### Adding Thoughts

1. Create new `.mdx` file in `src/content/thoughts/`
2. Add date and optional tags in frontmatter
3. Keep content concise (thought-sized)

### Adding Recommendations

1. Create new `.mdx` file in `src/content/recommendations/`
2. Add required frontmatter fields (author, job, photo)
3. Optional: Add `order` field for custom sorting
4. Write recommendation content in MDX body

### Adding Photos

1. Add photo image to `src/images/photos/`
2. Add entry to `src/content/photos.yaml` with `src` and `caption`
3. Photos are automatically optimized by Astro

### Managing Skills

1. Use `bun run add-skill` for interactive skill addition
2. Or manually edit `src/content/skills.yaml`
3. Run `bun run sync-skill-ids` to ensure IDs are consistent
4. Run `bun run sort-skills` to maintain alphabetical order

## Performance Considerations

### Image Optimization

- Use Astro's built-in image optimization
- Compress images before adding to project
- Use appropriate image formats (WebP, AVIF)
- Lazy load images when possible

### Bundle Optimization

- Prefer Astro components over Vue when possible
- Use dynamic imports for heavy components
- Minimize client-side JavaScript
- Leverage Astro's partial hydration

## Deployment

- Build command: `bun run build`
- Output directory: `dist/`
- Deployed to: Netlify (via `@astrojs/netlify` adapter)
- Static site generation (SSG)
- Redirects configured in `astro.config.mjs`:
  - `/` → `/hello`
  - `/work` → `/work/public`

## Common Patterns

### Layout Usage

```astro
---
// pages/blog/[slug].astro
import { getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";

const posts = await getCollection("blog");
---

<Layout title="Blog">
  <!-- page content -->
</Layout>
```

### Theme Support

The site includes dark mode support:

- Theme preference stored in `localStorage` as `themeMode`
- Theme toggle component available in layout
- CSS uses `dark:` variant classes for dark mode styles
- Theme initialization happens inline in `<head>` to prevent flash

### Vue Component Integration

```astro
---
// Only use when client-side JS needed
---

<InteractiveComponent client:load />
```

### Content Queries

```astro
---
// Get all blog posts, sorted by date
const posts = await getCollection("blog", ({ data }) => {
  return !data.draft; // Filter out drafts
});
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
);

// Filter work by category
const publicWork = (await getCollection("work")).filter(
  (entry) => entry.data.category === "public",
);

// Sort recommendations by order field
const recommendations = (await getCollection("recommendations")).sort(
  (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0),
);
---
```

### Image Optimization

```astro
---
import { getImage } from "astro:assets";

// Optimize images with Astro's built-in optimization
const optimizedImage = await getImage({
  src: photo.data.src,
  widths: [360, 600],
  sizes: "(max-width: 639px) 600px, 360px",
});
---
```

Remember: **Favor Astro components and static generation** whenever possible. Only reach for Vue components and client-side JavaScript when interactivity is absolutely required.
