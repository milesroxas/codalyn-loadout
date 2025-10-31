# Codalyn Loadout

A professional development environment optimized for creating, testing, and deploying custom JavaScript/TypeScript scripts that embed into Webflow sites. This project provides a complete build pipeline that compiles TypeScript code into production-ready JavaScript bundles.

**For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)**

## Included tools

This project contains preconfigured development tools:

- [TypeScript](https://www.typescriptlang.org/): Type-safe JavaScript development with full IDE support
- [Biome](https://biomejs.dev/): Fast, all-in-one linter and formatter
- [Playwright](https://playwright.dev/): End-to-end browser testing
- [esbuild](https://esbuild.github.io/): Ultra-fast JavaScript bundler for compilation and minification
- [Changesets](https://github.com/changesets/changesets): Version management and changelog generation
- [Finsweet's TypeScript Utils](https://github.com/finsweet/ts-utils): Utilities for Webflow development
- [Swiper](https://swiperjs.com/): Modern touch slider component

## Requirements

This project requires [pnpm](https://pnpm.io/installation) version 10 or higher:

```bash
npm i -g pnpm
```

### Installing

Install dependencies:

```bash
pnpm install
```

Install Playwright browsers (if testing):

```bash
pnpm playwright install
```

**Recommended VSCode extensions:**
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

### Building

Two build scripts are available:

- `pnpm dev`: Development mode with hot reload server at `http://localhost:3000`
- `pnpm build`: Production build (minified to `dist/`)

### Development workflow

1. **Start development server:**
   ```bash
   pnpm dev
   ```

2. **Add to Webflow:**
   Add the script tag to your Webflow project's Footer Code:
   ```html
   <script defer src="http://localhost:3000/index.js"></script>
   ```

3. **Develop:**
   - Edit files in `src/`
   - Browser auto-reloads on save
   - Check console for errors

4. **Build for production:**
   ```bash
   pnpm build
   ```
   Deploy `dist/` files to your hosting and update Webflow to use the production URL.

### Building multiple files

Configure multiple entry points in `bin/build.js`:

```javascript
const ENTRY_POINTS = [
  'src/index.ts',      // Main script
  'src/home/index.ts', // Page-specific script
];
```

### CSS support

CSS is bundled automatically when imported:

```typescript
import './styles.css';
```

Or add CSS files as entry points in `bin/build.js`.

### Path aliases

Clean imports using aliases defined in `tsconfig.json`:

```typescript
import { greetUser } from '$utils/greet';
```

Pre-configured alias: `$utils/*` → `src/utils/*`

Add more aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "$utils/*": ["src/utils/*"],
      "$features/*": ["src/features/*"]
    }
  }
}
```

## Testing

End-to-end tests using Playwright:

```bash
# Headless mode
pnpm test

# Visual UI mode
pnpm test:ui
```

Tests are located in `tests/` directory. The dev server automatically starts during testing.

## Code quality

Quality checks before committing:

```bash
# Lint only
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Format code
pnpm format

# Full check (lint + type check)
pnpm check

# Full check with auto-fix
pnpm check:fix
```

## Available scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production (minified) |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Fix linting issues automatically |
| `pnpm format` | Format code with Biome |
| `pnpm check` | Full check (lint + type check) |
| `pnpm check:fix` | Fix all issues automatically |
| `pnpm test` | Run Playwright tests (headless) |
| `pnpm test:ui` | Run Playwright tests with UI |
| `pnpm update` | Interactive dependency updates |

## Project structure

```
codalyn-loadout/
├── bin/                          # Build scripts
│   ├── build.js                  # Main build configuration
│   └── live-reload.js            # Live reload client script
├── dist/                         # Build output (gitignored)
├── src/                          # Source code
│   ├── index.ts                  # Main entry point
│   ├── features/                 # Feature modules
│   │   └── carousel/             # Carousel component
│   └── utils/                    # Utility modules
├── tests/                        # Playwright tests
├── biome.json                    # Biome configuration
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project metadata
```

## Documentation

For comprehensive documentation on:
- Build system architecture
- Development workflow details
- Production deployment
- Code quality & best practices
- Webflow integration patterns
- Troubleshooting

See [DOCUMENTATION.md](./DOCUMENTATION.md)
