import './styles.css';

import { createCarousel } from './lib';
import type { CarouselInstance } from './types';

const CAROUSEL_SELECTOR = '[data-slider-instance]';

let instances: CarouselInstance[] = [];

/**
 * Initialize all carousel instances on the page
 */
export function initCarousel(): void {
  const elements = document.querySelectorAll<HTMLElement>(CAROUSEL_SELECTOR);

  instances = Array.from(elements)
    .map((element: HTMLElement) => createCarousel(element))
    .filter((instance: CarouselInstance | null): instance is CarouselInstance => instance !== null);
}

/**
 * Destroy all carousel instances
 */
export function destroyCarousel(): void {
  for (const instance of instances) {
    instance.destroy();
  }
  instances = [];
}

// Re-export domain-specific types only
export type { CarouselInstance } from './types';
