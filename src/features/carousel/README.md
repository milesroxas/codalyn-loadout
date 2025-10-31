# Carousel Feature

Swiper-based carousel implementation with advanced features and type-safe configuration.

## Architecture

Follows Feature-Sliced Design (FSD) and Domain-Driven Design (DDD) principles with clear separation of concerns.

### Structure

```
src/features/carousel/
├── index.ts      # Public API and initialization
├── lib.ts        # Core carousel creation logic
├── model.ts      # Configuration building and domain logic
├── types.ts      # Type definitions (derived from Swiper)
├── styles.css    # Carousel styles
└── README.md     # This file
```

## Basic Usage

### HTML Structure in Webflow

```html
<div class="swiper" data-slider-instance>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
</div>
```

### TypeScript Initialization

```typescript
import { initCarousel } from './features/carousel';

window.Webflow ||= [];
window.Webflow.push(() => {
  initCarousel();
});
```

## Configuration via Data Attributes

All configuration is done through HTML data attributes on the carousel container.

### Basic Configuration

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-slider-instance` | Required | - | Identifies element as carousel |
| `data-effect` | string | `'slide'` | Transition effect (see Effects section) |
| `data-slides-per-view` | number\|'auto' | `1` | Number of slides visible at once |
| `data-space-between` | number | `0` | Space between slides in pixels |
| `data-crossfade` | boolean | `false` | Enable cross-fade for fade effect (empty string or 'true' = true) |

**Example:**

```html
<div class="swiper"
     data-slider-instance
     data-effect="slide"
     data-slides-per-view="3"
     data-space-between="20">
  <!-- slides -->
</div>
```

### Available Effects

All effects are type-safe and derived from Swiper's library types:

- `slide` (default) - Standard horizontal/vertical sliding
- `fade` - Cross-fade transitions
- `cube` - 3D cube rotation
- `coverflow` - Apple Cover Flow effect
- `flip` - 3D flip animation
- `creative` - Custom creative transitions
- `cards` - Stack of cards effect

**Example with fade effect:**

```html
<div class="swiper"
     data-slider-instance
     data-effect="fade"
     data-crossfade>
  <!-- slides -->
</div>
```

## Navigation Configuration

**NEW FEATURE**: Attribute-based navigation element assignment with flexible selector options.

### Method 1: Class-based (Traditional)

```html
<div class="swiper" data-slider-instance>
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Navigation buttons with default classes -->
  <button class="slider-prev">Previous</button>
  <button class="slider-next">Next</button>
</div>
```

### Method 2: Attribute-based Assignment

```html
<div class="swiper"
     data-slider-instance
     data-nav-prev="prev-button"
     data-nav-next="next-button">
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Assign elements using data attributes -->
  <button data-carousel-element="prev-button">Prev</button>
  <button data-carousel-element="next-button">Next</button>
</div>
```

### Method 3: CSS Selector

```html
<div class="swiper"
     data-slider-instance
     data-nav-prev=".custom-prev"
     data-nav-next=".custom-next">
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Use custom CSS selectors -->
  <button class="custom-prev">Previous</button>
  <button class="custom-next">Next</button>
</div>
```

**Fallback Behavior**: If no custom selectors are provided, defaults to `.slider-prev` and `.slider-next` classes.

## Pagination Configuration

**NEW FEATURE**: Attribute-based pagination element assignment.

### Method 1: Class-based (Traditional)

```html
<div class="swiper" data-slider-instance>
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Pagination with default class -->
  <div class="swiper-pagination"></div>
</div>
```

### Method 2: Attribute-based Assignment

```html
<div class="swiper"
     data-slider-instance
     data-pagination="dots">
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Assign pagination element -->
  <div data-carousel-element="dots"></div>
</div>
```

### Method 3: CSS Selector

```html
<div class="swiper"
     data-slider-instance
     data-pagination=".custom-pagination">
  <div class="swiper-wrapper"><!-- slides --></div>

  <!-- Use custom CSS selector -->
  <div class="custom-pagination"></div>
</div>
```

**Fallback Behavior**: If no custom selector is provided, defaults to `.swiper-pagination` class.

## Responsive Breakpoints

**NEW FEATURE**: Configure different slide counts at different screen sizes.

### Configuration Format

Breakpoints are configured via JSON in the `data-breakpoints` attribute:

```html
<div class="swiper"
     data-slider-instance
     data-slides-per-view="1"
     data-breakpoints='{"640":{"slidesPerView":2,"spaceBetween":20},"1024":{"slidesPerView":3,"spaceBetween":30}}'>
  <div class="swiper-wrapper"><!-- slides --></div>
</div>
```

### Breakpoint Object Structure

```typescript
{
  [breakpointWidth: number]: {
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    slidesPerGroup?: number;
  }
}
```

**Example Configuration:**

```json
{
  "320": {
    "slidesPerView": 1,
    "spaceBetween": 10
  },
  "640": {
    "slidesPerView": 2,
    "spaceBetween": 20
  },
  "1024": {
    "slidesPerView": 3,
    "spaceBetween": 30
  },
  "1440": {
    "slidesPerView": 4,
    "spaceBetween": 40
  }
}
```

### Alternative: CSS-Based Responsive Pattern

For Webflow-friendly editing, you can use CSS custom properties with container queries:

**HTML:**

```html
<div class="slider-container" data-slider-instance>
  <div class="swiper-wrapper">
    <!-- Slides -->
  </div>
</div>
```

**CSS:**

```css
.slider-container {
  /* Define breakpoint variables */
  --slide-count: var(--lg);
  --lg: 3;
  --md: var(--lg);
  --sm: var(--md);
  --xs: var(--sm);
}

/* Apply breakpoints using container queries */
@container (width < 50em) {
  .slider-container { --slide-count: var(--md); }
}
@container (width < 35em) {
  .slider-container { --slide-count: var(--sm); }
}
@container (width < 20em) {
  .slider-container { --slide-count: var(--xs); }
}

/* Apply to slides */
.swiper-wrapper > .swiper-slide {
  width: calc(100% / var(--slide-count)) !important;
  padding-inline: calc(var(--gap-size, 1rem) / 2);
}
```

**Benefits:**
- Easy to edit in Webflow's style panel
- No JSON configuration needed
- Visual feedback in Webflow Designer
- Container query support for nested layouts

## Complete Example

```html
<!-- Full-featured carousel with all options -->
<div class="swiper"
     data-slider-instance
     data-effect="slide"
     data-slides-per-view="1"
     data-space-between="0"
     data-nav-prev="my-prev"
     data-nav-next="my-next"
     data-pagination="my-dots"
     data-breakpoints='{"640":{"slidesPerView":2,"spaceBetween":20},"1024":{"slidesPerView":3,"spaceBetween":30}}'>

  <!-- Slides wrapper -->
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
    <div class="swiper-slide">Slide 4</div>
    <div class="swiper-slide">Slide 5</div>
  </div>

  <!-- Custom navigation -->
  <button data-carousel-element="my-prev">←</button>
  <button data-carousel-element="my-next">→</button>

  <!-- Custom pagination -->
  <div data-carousel-element="my-dots"></div>
</div>
```

## Type Safety

This feature follows best practices by:
- Using Swiper's types directly where needed (no redundant re-exports)
- Only defining domain-specific types (e.g., `CarouselDataset`, `CarouselInstance`)
- Maintaining single source of truth from the Swiper library
- Avoiding type duplication and unnecessary abstraction layers

**Type Imports:**

```typescript
// Domain-specific types from our carousel feature
import type { CarouselInstance } from './features/carousel';

// Use Swiper types directly when needed
import type { SwiperOptions } from 'swiper/types';

// Example: Custom configuration
const customConfig: SwiperOptions = {
  slidesPerView: 3,
  spaceBetween: 20,
  // Full autocomplete support
};
```

## Programmatic Usage

### Create a single carousel

```typescript
import { createCarousel } from './features/carousel';

const element = document.querySelector('.my-carousel') as HTMLElement;
const carousel = createCarousel(element);

// Later, destroy when needed
carousel?.destroy();
```

### Initialize all carousels

```typescript
import { initCarousel, destroyCarousel } from './features/carousel';

// Initialize all carousels on page
initCarousel();

// Destroy all carousels (e.g., on route change)
destroyCarousel();
```

## Best Practices

1. **Always include required HTML structure:**
   - Container with `data-slider-instance`
   - `.swiper-wrapper` for slides container
   - `.swiper-slide` for each slide

2. **Use data attributes for configuration:**
   - Keeps HTML semantic
   - Easy to manage in Webflow
   - No JavaScript configuration needed

3. **Leverage type safety:**
   - Import types for custom implementations
   - Use IDE autocomplete for valid values
   - Catch errors at compile time

4. **Performance considerations:**
   - Use `data-slides-per-view="auto"` for variable-width slides
   - Enable loop only when needed (currently always enabled)
   - Consider lazy loading for image-heavy carousels

5. **Accessibility:**
   - Navigation buttons are automatically keyboard accessible
   - Pagination dots are clickable by default
   - Consider adding ARIA labels to navigation elements

## Troubleshooting

### Carousel not initializing

- Verify `data-slider-instance` attribute is present
- Check that `.swiper-wrapper` exists inside container
- Ensure slides have `.swiper-slide` class
- Check browser console for errors

### Navigation buttons not working

- Verify button selectors are correct
- Check that buttons are inside or adjacent to carousel container
- Ensure Navigation module is registered (done automatically)

### Breakpoints not applying

- Validate JSON syntax in `data-breakpoints` attribute
- Check browser console for parsing warnings
- Ensure breakpoint keys are numbers, not strings

### Effects not working

- Import and register required effect modules in `lib.ts:8`
- Currently registered: `EffectFade`, `Navigation`, `Pagination`
- Add others as needed: `EffectCube`, `EffectCoverflow`, etc.

## API Reference

### Exported Functions

#### `initCarousel(): void`

Initializes all carousel instances on the page by finding all elements with `[data-slider-instance]` attribute.

#### `destroyCarousel(): void`

Destroys all carousel instances and cleans up event listeners.

#### `createCarousel(element: HTMLElement): CarouselInstance | null`

Creates a single carousel instance from an HTML element.

**Parameters:**
- `element`: The carousel container element

**Returns:**
- `CarouselInstance` object with `destroy()` method, or `null` if invalid

### Exported Types

#### `CarouselInstance`

Our domain-specific interface for initialized carousels:

```typescript
interface CarouselInstance {
  element: HTMLElement;
  destroy: () => void;
}
```

#### Using Swiper Types

For Swiper-specific types, import directly from the library:

```typescript
import type { SwiperOptions } from 'swiper/types';

// Access specific option types
type Effect = SwiperOptions['effect'];
type Breakpoints = SwiperOptions['breakpoints'];
type Navigation = SwiperOptions['navigation'];
type Pagination = SwiperOptions['pagination'];
```

This approach:
- Eliminates redundant type definitions
- Ensures types stay in sync with Swiper updates
- Provides full IDE autocomplete from the source
- Follows single source of truth principle

## Version Information

- **Swiper Version**: 12.0.3
- **Type Definitions**: Directly from Swiper library
- **Last Updated**: October 2025
