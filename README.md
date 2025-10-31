# Codalyn Loadout

A professional TypeScript development environment for building and deploying custom scripts to Webflow sites via jsDelivr CDN.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start local development
pnpm dev

# Add to Webflow (for testing)
# <script defer src="http://localhost:3000/index.js"></script>

# Commit and push changes
pnpm check:fix
git add src/
git commit -m "feat: your changes"
pnpm push  # Auto-syncs and deploys to jsDelivr
```

## Documentation

| Guide | Description |
|-------|-------------|
| **[Workflow Guide](docs/workflow.md)** | Daily development workflow and git integration |
| **[Development Guide](docs/development.md)** | Architecture, build system, and best practices |
| **[Deployment Guide](docs/deployment.md)** | jsDelivr CDN setup and version management |

## Features

Built with FSD and DDD principles for maintainable, scalable code organization.

### Carousel Feature

Pre-built Swiper carousel with type-safe configuration via data attributes:

```html
<div class="swiper"
     data-slider-instance
     data-slides-per-view="3"
     data-space-between="20"
     data-breakpoints='{"640":{"slidesPerView":2}}'>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
</div>
```

See [src/features/carousel/README.md](src/features/carousel/README.md) for full documentation.

## Tech Stack

- **[TypeScript](https://typescriptlang.org)** - Type-safe development
- **[esbuild](https://esbuild.github.io)** - Ultra-fast bundler
- **[Biome](https://biomejs.dev)** - Linting and formatting
- **[Playwright](https://playwright.dev)** - E2E testing
- **[Swiper](https://swiperjs.com)** - Touch slider component
- **[pnpm](https://pnpm.io)** ≥10 - Package manager

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (localhost:3000) |
| `pnpm build` | Build for production |
| `pnpm check` | Lint + type check |
| `pnpm check:fix` | Auto-fix issues |
| `pnpm push` | Smart git push with auto-sync |
| `pnpm test` | Run tests |

## Project Structure

```
src/
├── features/           # Feature modules (FSD)
│   └── carousel/
│       ├── index.ts   # Public API
│       ├── lib.ts     # Implementation
│       ├── model.ts   # Business logic
│       ├── types.ts   # Domain types
│       └── README.md  # Feature docs
├── utils/             # Shared utilities
└── index.ts           # Entry point

docs/                  # Project documentation
tests/                 # E2E tests
bin/                   # Build scripts
```

## Webflow Integration

**Development:**
```html
<script defer src="http://localhost:3000/index.js"></script>
```

**Production (auto-updating):**
```html
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@main/dist/index.js"></script>
```

**Production (pinned version):**
```html
<script defer src="https://cdn.jsdelivr.net/gh/milesroxas/codalyn-loadout@v1.0.0/dist/index.js"></script>
```

## License

ISC
