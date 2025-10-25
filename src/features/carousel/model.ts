import type { CarouselConfig, CarouselDataset, CarouselEffect } from './types';

/**
 * Parse string to boolean following Webflow attribute conventions
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
 * Build Swiper configuration from element dataset
 */
export function buildCarouselConfig(
  element: HTMLElement,
  dataset: CarouselDataset
): CarouselConfig {
  const effect = (dataset.effect as CarouselEffect) ?? 'slide';

  const config: CarouselConfig = {
    effect,
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

  // Navigation controls
  const nextButton = element.querySelector<HTMLElement>('.slider-next');
  const prevButton = element.querySelector<HTMLElement>('.slider-prev');

  if (nextButton && prevButton) {
    config.navigation = {
      nextEl: nextButton,
      prevEl: prevButton,
    };
  }

  // Pagination
  const pagination = element.querySelector<HTMLElement>('.swiper-pagination');

  if (pagination) {
    config.pagination = {
      clickable: true,
      el: pagination,
    };
  }

  return config;
}
