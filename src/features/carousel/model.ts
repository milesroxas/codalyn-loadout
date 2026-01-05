import { EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { SwiperModule, SwiperOptions } from 'swiper/types';

import type { CarouselDataset } from './types';

export interface CarouselConfig {
  modules: SwiperModule[];
  options: SwiperOptions;
}

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
 * Searches within container first, then expands to document level
 */
function findElement(
  container: HTMLElement,
  selectorOrAttribute: string | undefined,
  fallbackSelector: string
): HTMLElement | null {
  console.log('[Carousel] findElement called:', {
    selectorOrAttribute,
    fallbackSelector,
    containerClass: container.className,
  });

  if (!selectorOrAttribute) {
    // Use fallback class-based selector (container only)
    const fallbackElement = container.querySelector<HTMLElement>(fallbackSelector);
    console.log(
      '[Carousel] Using fallback selector:',
      fallbackSelector,
      'Found:',
      !!fallbackElement
    );
    return fallbackElement;
  }

  // First try as a data attribute value within container
  const attributeSelector = `[data-carousel-element="${selectorOrAttribute}"]`;
  let byAttribute = container.querySelector<HTMLElement>(attributeSelector);
  console.log(
    '[Carousel] Trying attribute selector in container:',
    attributeSelector,
    'Found:',
    !!byAttribute
  );

  // If not found in container, search document
  if (!byAttribute) {
    byAttribute = document.querySelector<HTMLElement>(attributeSelector);
    console.log(
      '[Carousel] Trying attribute selector in document:',
      attributeSelector,
      'Found:',
      !!byAttribute
    );
  }

  if (byAttribute) return byAttribute;

  // Then try as a CSS selector within container
  try {
    let byCSSSelector = container.querySelector<HTMLElement>(selectorOrAttribute);
    console.log(
      '[Carousel] Trying CSS selector in container:',
      selectorOrAttribute,
      'Found:',
      !!byCSSSelector
    );

    // If not found in container, search document
    if (!byCSSSelector) {
      byCSSSelector = document.querySelector<HTMLElement>(selectorOrAttribute);
      console.log(
        '[Carousel] Trying CSS selector in document:',
        selectorOrAttribute,
        'Found:',
        !!byCSSSelector
      );
    }

    return byCSSSelector;
  } catch (error) {
    console.warn('[Carousel] CSS selector failed:', selectorOrAttribute, error);
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
  console.log('[Carousel] Building navigation config:', {
    navNext: dataset.navNext,
    navPrev: dataset.navPrev,
  });

  const nextButton = findElement(element, dataset.navNext, '.slider-next');
  const prevButton = findElement(element, dataset.navPrev, '.slider-prev');

  console.log('[Carousel] Navigation buttons found:', {
    nextButton: !!nextButton,
    prevButton: !!prevButton,
  });

  if (nextButton && prevButton) {
    return {
      nextEl: nextButton,
      prevEl: prevButton,
    };
  }

  if (!nextButton || !prevButton) {
    console.warn('[Carousel] Navigation not configured - missing buttons:', {
      hasNext: !!nextButton,
      hasPrev: !!prevButton,
    });
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
 * Returns both the config and required modules to avoid global registration issues
 */
export function buildCarouselConfig(
  element: HTMLElement,
  dataset: CarouselDataset
): CarouselConfig {
  console.log('[Carousel] buildCarouselConfig called for element:', element.className);
  console.log('[Carousel] Dataset:', dataset);

  const effect = dataset.effect as SwiperOptions['effect'];

  const centeredSlides = parseBoolean(dataset.centeredSlides);
  const loop = dataset.loop !== undefined ? parseBoolean(dataset.loop) : true;

  const config: SwiperOptions = {
    effect: effect ?? 'slide',
    loop,
    slidesPerView: parseNumberOrAuto(dataset.slidesPerView, 1),
    spaceBetween: parseNumber(dataset.spaceBetween, 0),
    centeredSlides,
    // When centered, start at first slide (index 0) to ensure first slide is centered
    initialSlide: centeredSlides ? 0 : undefined,
    // No swiping configuration - allows preventing swipe on specific elements
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
  };

  const modules: SwiperModule[] = [];

  // Fade effect configuration
  if (effect === 'fade') {
    config.fadeEffect = {
      crossFade: parseBoolean(dataset.crossfade),
    };
    modules.push(EffectFade);
  }

  // Navigation controls (attribute-based)
  const navigation = buildNavigationConfig(element, dataset);
  if (navigation) {
    config.navigation = navigation;
    modules.push(Navigation);
    console.log('[Carousel] Navigation module registered');
  }

  // Pagination (attribute-based)
  const pagination = buildPaginationConfig(element, dataset);
  if (pagination) {
    config.pagination = pagination;
    modules.push(Pagination);
    console.log('[Carousel] Pagination module registered');
  }

  // Responsive breakpoints
  const breakpoints = parseBreakpoints(dataset.breakpoints);
  if (breakpoints) {
    config.breakpoints = breakpoints;
  }

  console.log('[Carousel] Final config:', { modules: modules.length, config });

  return { modules, options: config };
}
