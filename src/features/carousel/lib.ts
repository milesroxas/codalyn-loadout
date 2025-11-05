import Swiper from 'swiper';

import { buildCarouselConfig } from './model';
import type { CarouselDataset, CarouselInstance } from './types';

/**
 * Validate carousel element structure
 */
function isValidCarouselElement(element: HTMLElement): boolean {
  return !!element.querySelector('.swiper-wrapper');
}

/**
 * Create a carousel instance from an HTML element
 */
export function createCarousel(element: HTMLElement): CarouselInstance | null {
  if (!isValidCarouselElement(element)) {
    return null;
  }

  const dataset = element.dataset as CarouselDataset;
  const { modules, options } = buildCarouselConfig(element, dataset);

  const swiper = new Swiper(element, {
    ...options,
    modules,
  });

  return {
    destroy: () => {
      try {
        swiper.destroy(true, true);
      } catch {
        // Silently handle destruction errors
      }
    },
    element,
  };
}
