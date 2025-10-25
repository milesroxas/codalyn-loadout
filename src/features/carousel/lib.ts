import Swiper from 'swiper';
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

import { buildCarouselConfig } from './model';
import type { CarouselDataset, CarouselInstance } from './types';

// Register Swiper modules once
Swiper.use([Navigation, Pagination, EffectFade]);

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
  const config = buildCarouselConfig(element, dataset);

  const swiper = new Swiper(element, config);

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
