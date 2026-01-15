# Per-Slide Interaction Events Example

This guide shows you how to emit unique interaction events for each slide in your carousel.

## Basic Usage

```javascript
import { emitPerSlide } from './shared/interaction-bridge';

// When initializing your carousel
const swiper = new Swiper('.swiper', {
  // ... your swiper config
});

// Emit initial event for the first slide
emitPerSlide(swiper.realIndex, swiper.slides.length, {
  eventPattern: 'state-change:start-slide-{index}',
  oneBasedIndex: true, // Use 1, 2, 3 instead of 0, 1, 2
  featureId: 'hero'
});

// Listen for slide changes and emit per-slide events
swiper.on('slideChangeTransitionStart', () => {
  emitPerSlide(swiper.realIndex, swiper.slides.length, {
    eventPattern: 'state-change:start-slide-{index}',
    oneBasedIndex: true,
    featureId: 'hero'
  });
});
```

## What Gets Emitted

With 5 slides and `oneBasedIndex: true`, the following events will be emitted:

- Slide 1: `interaction:state-change:start-slide-1`
- Slide 2: `interaction:state-change:start-slide-2`
- Slide 3: `interaction:state-change:start-slide-3`
- Slide 4: `interaction:state-change:start-slide-4`
- Slide 5: `interaction:state-change:start-slide-5`

## Setting Up in Webflow Designer

1. Select the element you want to animate
2. Create a new interaction triggered by "Custom Event"
3. Enter the event name (e.g., `interaction:state-change:start-slide-1`)
4. Configure your animation
5. Repeat for each slide (slide-2, slide-3, etc.)

## Advanced Example: Both Start and End Events

```javascript
// Emit events for both transition start and end
swiper.on('slideChangeTransitionStart', () => {
  emitPerSlide(swiper.realIndex, swiper.slides.length, {
    eventPattern: 'state-change:start-slide-{index}',
    oneBasedIndex: true,
    featureId: 'hero'
  });
});

swiper.on('slideChangeTransitionEnd', () => {
  emitPerSlide(swiper.realIndex, swiper.slides.length, {
    eventPattern: 'state-change:end-slide-{index}',
    oneBasedIndex: true,
    featureId: 'hero'
  });
});
```

## Using with Direct Webflow API

If you prefer to use the Webflow API directly:

```javascript
const wfIx = Webflow.require("ix3");
const totalSlides = swiper.slides.length;

swiper.on('slideChangeTransitionStart', () => {
  const slideIndex = swiper.realIndex + 1; // 1-based
  wfIx.emit(`interaction:state-change:start-slide-${slideIndex}`);
});
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `eventPattern` | `string` | Required | Event name pattern with `{index}` placeholder |
| `oneBasedIndex` | `boolean` | `false` | Use 1-based indexing (1, 2, 3) instead of 0-based (0, 1, 2) |
| `featureId` | `string` | `undefined` | Optional identifier included in the event payload |

## Tips

- Use `oneBasedIndex: true` if you prefer thinking in terms of "Slide 1, 2, 3" instead of "Slide 0, 1, 2"
- The `featureId` is useful for debugging when you have multiple carousels
- Remember to create a separate Webflow interaction for each slide event
- The event payload includes `slideIndex`, `totalSlides`, and `featureId` for reference
