/**
 * Domain-specific types for carousel feature
 * Only types that are specific to our implementation, not re-exports from Swiper
 */

/**
 * Dataset attributes for carousel configuration
 * These are parsed from data-* attributes on the carousel element
 * Represents our domain model for how carousels are configured in HTML
 */
export interface CarouselDataset {
  /** Instance identifier for the carousel */
  sliderInstance?: string;

  /** Visual effect for slide transitions */
  effect?: string;

  /** Enable cross-fade for fade effect (empty string or 'true' for true) */
  crossfade?: string;

  /** Number of slides to show at once, or 'auto' */
  slidesPerView?: string;

  /** Space between slides in pixels */
  spaceBetween?: string;

  /** Selector or attribute for next navigation button */
  navNext?: string;

  /** Selector or attribute for previous navigation button */
  navPrev?: string;

  /** Selector or attribute for pagination container */
  pagination?: string;

  /** Responsive breakpoints configuration (JSON string) */
  breakpoints?: string;
}

/**
 * Carousel instance interface
 * Represents our public API for an initialized carousel
 */
export interface CarouselInstance {
  element: HTMLElement;
  destroy: () => void;
}
