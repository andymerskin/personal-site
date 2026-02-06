# Personal Portfolio Website

A modern, content-driven personal portfolio website built with Astro. The site showcases work, blog posts, thoughts, recommendations from colleagues, photos, and skills using MDX and YAML content collections. Features interactive Vue components, dark mode support, and is optimized for static site generation.

## Tech Stack

| Category            | Technology                               |
| ------------------- | ---------------------------------------- |
| **Framework**       | Astro 5.x                                |
| **UI Framework**    | Vue 3                                    |
| **Styling**         | Tailwind CSS 4.x                         |
| **Content**         | MDX, Astro Content Collections           |
| **Animations**      | GSAP                                     |
| **Icons**           | RemixIcon, Lucide                        |
| **Deployment**      | Netlify                                  |
| **Package Manager** | Bun                                      |
| **Type Checking**   | TypeScript                               |
| **Code Formatting** | Prettier (with Astro & Tailwind plugins) |

## Project Overview

This portfolio site uses a content-driven architecture where content is managed through Astro's content collections. The site is built with a focus on performance, using Astro components for static content and Vue components only when interactivity is required.

### Key Features

- **Content Collections**: Blog posts, work items, thoughts, and recommendations managed via MDX
- **Skills Management**: YAML-based skills catalog with grouping and categorization
- **Photo Gallery**: Image gallery with metadata stored in YAML
- **Dark Mode**: Theme switching support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Static Site Generation**: Fully static output for optimal performance

## Project Structure

```
/
├── public/              # Static assets (images, favicon, etc.)
├── scripts/             # Utility scripts for content management
├── src/
│   ├── components/     # Astro and Vue components
│   ├── content/        # Content collections
│   │   ├── blog/       # Blog posts (MDX)
│   │   ├── thoughts/   # Short thoughts (MDX)
│   │   ├── work/       # Portfolio items (MDX)
│   │   ├── recommendations/ # Colleague recommendations (MDX)
│   │   ├── photos.yaml # Photo gallery metadata
│   │   └── skills.yaml # Skills catalog
│   ├── images/         # Image assets
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route-based pages
│   ├── styles/         # Global styles and fonts
│   └── utils/          # Utility functions
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A code editor (VS Code recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd personal-site-2026
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:4321`

## Development

### Development Server

The development server runs on `http://localhost:4321` by default. Hot module replacement (HMR) is enabled for fast development iteration.

**Note**: The dev server should be started manually. Automated testing should use the build command instead.

### Code Formatting

Format code before committing:

```bash
bun run format
```

This runs Prettier with Astro and Tailwind CSS plugins to ensure consistent code style.

## Build

### Production Build

Build the site for production:

```bash
bun run build
```

This generates a static site in the `dist/` directory, ready for deployment to any static hosting service.

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

This serves the `dist/` directory locally, allowing you to test the production build before deploying.

### Build Output

- **Output Directory**: `dist/`
- **Build Type**: Static Site Generation (SSG)
- **Deployment Target**: Netlify (configured with adapter)

## Scripts

| Script                   | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `bun run dev`            | Start the development server at `localhost:4321`         |
| `bun run build`          | Build the production site to `./dist/`                   |
| `bun run preview`        | Preview the production build locally                     |
| `bun run format`         | Format all code with Prettier (Astro & Tailwind plugins) |
| `bun run update-link-previews` | Refresh cached Open Graph metadata for LinkWithPreview cards |
| `bun run astro`          | Run Astro CLI commands (e.g., `bun run astro check`)     |
| `bun run sort-skills`    | Sort skills in `src/content/skills.yaml` alphabetically  |
| `bun run add-skill`      | Interactive script to add a new skill to the catalog     |
| `bun run sync-skill-ids` | Syncs skill IDs from skills.yaml to skills.gen.ts        |

### Content Management Scripts

- **`sort-skills`**: Automatically sorts skills in the YAML file alphabetically
- **`add-skill`**: Interactive CLI tool to add new skills with proper formatting
- **`sync-skill-ids`**: Syncs skill IDs from skills.yaml to skills.gen.ts
- **`update-link-previews`**: Fetches Open Graph metadata for `<LinkWithPreview />` and updates the cache

## Content Management

### Adding Content

- **Blog Posts**: Create new `.mdx` files in `src/content/blog/`
- **Work Items**: Create new `.mdx` files in `src/content/work/`
- **Thoughts**: Create new `.mdx` files in `src/content/thoughts/`
- **Recommendations**: Create new `.mdx` files in `src/content/recommendations/`
- **Skills**: Use `bun run add-skill` or edit `src/content/skills.yaml` directly
- **Photos**: Edit `src/content/photos.yaml` to add photo metadata

All content files use frontmatter for metadata. See individual content collection schemas in `src/content.config.ts` for required fields.

### Test Blog Posts

For E2E fixtures, blog posts can include `test: true` in frontmatter. These posts:

- appear in `/blog` and render at `/blog/<slug>` during local dev
- are excluded from production builds unless `VITE_SHOW_TEST_CONTENT` is exactly `"true"`

## Deployment

The site is configured for deployment to Netlify. The build output (`dist/`) is a fully static site that can be deployed to any static hosting service.

### Netlify Deployment

The project includes Netlify adapter configuration. Deploy by connecting your repository to Netlify or using the Netlify CLI.

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vue 3 Documentation](https://vuejs.org)
- [MDX Documentation](https://mdxjs.com)
