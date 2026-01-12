# Agent Instructions for Personal Site Project

## Project Overview

This is a personal portfolio website built with Astro, featuring a content-driven approach with Vue components for interactive elements. The site showcases work, blog posts, and thoughts using MDX content collections.

## Tech Stack

- **Framework**: Astro 5.x with Vue 3 integration
- **Styling**: Tailwind CSS 4.x
- **Content**: MDX with Astro content collections
- **Animations**: GSAP
- **Icons**: RemixIcon
- **Package Manager**: Bun
- **Formatting**: Prettier with Astro and Tailwind plugins

## Project Structure

### Content Organization

```
src/content/
├── blog/          # Blog posts (MDX files)
├── thoughts/      # Short thoughts/notes (MDX files)
└── work/          # Work/portfolio items (MDX files)
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
├── blog.astro     # Blog listing page
├── blog/[slug].astro  # Individual blog posts
├── work.astro     # Work listing page
├── work/[slug].astro  # Individual work items
└── thoughts.astro # Thoughts listing page

src/layouts/
└── Layout.astro   # Main site layout
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
  type: string,      // e.g., "Product Design", "Development"
  year: string,      // e.g., "2024"
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
- Static site ready for any static hosting
- No server-side requirements

## Common Patterns

### Layout Usage

```astro
---
// pages/blog/[slug].astro
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";

const posts = await getCollection("blog");
---

<Layout title="Blog">
  <!-- page content -->
</Layout>
```

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
---
```

Remember: **Favor Astro components and static generation** whenever possible. Only reach for Vue components and client-side JavaScript when interactivity is absolutely required.
