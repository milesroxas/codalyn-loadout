import type { SwiperOptions } from 'swiper/types';

import type { CarouselDataset } from './types';

/**
 * Parse string to boolean following Webflow attribute conventions
 * Empty string or 'true' evaluates to true
 */
function parseBoolean(value: string | undefined): boolean {
  return value === '' || value === 'true';
}

/**
 * Parse string to number with fallback
 */
function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Parse string to number or "auto"
 */
function parseNumberOrAuto(value: string | undefined, fallback: number): number | 'auto' {
  if (value === 'auto') return 'auto';
  return parseNumber(value, fallback);
}

/**
 * Parse JSON string to breakpoints object
 * Safely handles invalid JSON by returning undefined
 */
function parseBreakpoints(value: string | undefined): SwiperOptions['breakpoints'] {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    // Validate that it's an object with numeric keys
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as SwiperOptions['breakpoints'];
    }
  } catch {
    console.warn('Invalid breakpoints JSON:', value);
  }

  return undefined;
}

/**
 * Find element by selector or attribute
 * Supports both CSS selectors and data attribute values
 */
function findElement(
  container: HTMLElement,
  selectorOrAttribute: string | undefined,
  fallbackSelector: string
): HTMLElement | null {
  if (!selectorOrAttribute) {
    // Use fallback class-based selector
    return container.querySelector<HTMLElement>(fallbackSelector);
  }

  // First try as a data attribute value
  const byAttribute = container.querySelector<HTMLElement>(
    `[data-carousel-element="${selectorOrAttribute}"]`
  );
  if (byAttribute) return byAttribute;

  // Then try as a CSS selector
  try {
    return container.querySelector<HTMLElement>(selectorOrAttribute);
  } catch {
    return null;
  }
}

/**
 * Build navigation configuration
 * Supports attribute-based element assignment
 */
function buildNavigationConfig(
  element: HTMLElement,
  dataset: CarouselDataset
): SwiperOptions['navigation'] {
  const nextButton = findElement(element, dataset.navNext, '.slider-next');
  const prevButton = findElement(element, dataset.navPrev, '.slider-prev');

  if (nextButton && prevButton) {
    return {
      nextEl: nextButton,
      prevEl: prevButton,
    };
  }

  return undefined;
}

/**
 * Build pagination configuration
 * Supports attribute-based element assignment
 */
function buildPaginationConfig(
  element: HTMLElement,
  dataset: CarouselDataset
): SwiperOptions['pagination'] {
  const paginationEl = findElement(element, dataset.pagination, '.swiper-pagination');

  if (paginationEl) {
    return {
      clickable: true,
      el: paginationEl,
    };
  }

  return undefined;
}

/**
 * Build Swiper configuration from element dataset
 * Implements DDD principles with clear domain logic separation
 */
export function buildCarouselConfig(element: HTMLElement, dataset: CarouselDataset): SwiperOptions {
  const effect = dataset.effect as SwiperOptions['effect'];

  const config: SwiperOptions = {
    effect: effect ?? 'slide',
    loop: true,
    observeParents: true,
    observer: true,
    slidesPerView: parseNumberOrAuto(dataset.slidesPerView, 1),
    spaceBetween: parseNumber(dataset.spaceBetween, 0),
  };

  // Fade effect configuration
  if (effect === 'fade') {
    config.fadeEffect = {
      crossFade: parseBoolean(dataset.crossfade),
    };
  }

  // Navigation controls (attribute-based)
  config.navigation = buildNavigationConfig(element, dataset);

  // Pagination (attribute-based)
  config.pagination = buildPaginationConfig(element, dataset);

  // Responsive breakpoints
  const breakpoints = parseBreakpoints(dataset.breakpoints);
  if (breakpoints) {
    config.breakpoints = breakpoints;
  }

  return config;
}
