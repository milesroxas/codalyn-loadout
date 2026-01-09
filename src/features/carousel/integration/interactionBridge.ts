/**
 * Carousel Interaction Bridge Adapter
 *
 * Translates Swiper lifecycle events into:
 * - Shared DOM state contract (data-state attributes)
 * - Shared event emission (IX3 custom events)
 *
 * This adapter is domain-focused and owns the mapping between Swiper's API
 * and the shared interaction bridge contract.
 */

import type Swiper from 'swiper';

import { emit, setState } from '../../../shared/interaction-bridge';

/**
 * Configuration for IX3 integration
 */
export interface IX3Config {
  /** Feature ID for scoping (e.g., 'hero', 'testimonials') */
  featureId?: string;
  /** Whether to emit interaction events (default: true) */
  enabled?: boolean;
  /** Custom event prefix (default: 'interaction') */
  eventPrefix?: string;
  /** Custom start event name (overrides prefix) */
  eventStart?: string;
  /** Custom end event name (overrides prefix) */
  eventEnd?: string;
}

/**
 * Calculate prev/next indices with looping support
 */
function calculateIndices(
  activeIndex: number,
  totalSlides: number,
  loop: boolean
): { prev: number; next: number } {
  if (loop) {
    // With loop enabled, wrap around
    const prev = (activeIndex - 1 + totalSlides) % totalSlides;
    const next = (activeIndex + 1) % totalSlides;
    return { prev, next };
  }

  // Without loop, clamp to boundaries
  const prev = Math.max(0, activeIndex - 1);
  const next = Math.min(totalSlides - 1, activeIndex + 1);
  return { prev, next };
}

/**
 * Apply state markers to slides based on Swiper's active index
 */
function applySlideStates(swiper: Swiper): void {
  const slides = swiper.slides;
  const realIndex = swiper.realIndex; // Use realIndex for looping carousels
  const totalSlides = slides.length;
  const loop = swiper.params.loop || false;

  const { prev, next } = calculateIndices(realIndex, totalSlides, loop);

  setState(slides, {
    active: realIndex,
    prev,
    next,
  });
}

/**
 * Get event names based on configuration
 */
function getEventNames(config: IX3Config): { start: string; end: string } {
  // Use custom event names if provided
  if (config.eventStart && config.eventEnd) {
    return {
      start: config.eventStart,
      end: config.eventEnd,
    };
  }

  // Use prefix to build event names
  const prefix = config.eventPrefix || 'interaction';
  return {
    start: `${prefix}:state-change:start`,
    end: `${prefix}:state-change:end`,
  };
}

/**
 * Setup IX3 integration for a Swiper instance
 *
 * This is the main adapter function that connects Swiper to the interaction bridge.
 * It listens to Swiper events and translates them into:
 * - DOM state markers (data-state)
 * - IX3 custom events
 *
 * @param swiper - Swiper instance to integrate
 * @param config - IX3 configuration
 *
 * @example
 * ```ts
 * const swiper = new Swiper(element, options);
 * setupInteractionBridge(swiper, {
 *   featureId: 'hero',
 *   eventPrefix: 'carousel'
 * });
 * ```
 */
export function setupInteractionBridge(swiper: Swiper, config: IX3Config = {}): void {
  // Skip if explicitly disabled
  if (config.enabled === false) {
    return;
  }

  const eventNames = getEventNames(config);

  // Apply initial state markers on init
  swiper.on('init', () => {
    applySlideStates(swiper);

    // Emit init event
    emit('init', {
      featureId: config.featureId,
      type: 'carousel',
    });
  });

  // Update state markers when slide changes start
  swiper.on('slideChangeTransitionStart', () => {
    applySlideStates(swiper);

    // Emit state change start event
    emit(eventNames.start, {
      featureId: config.featureId,
      slideIndex: swiper.realIndex,
      type: 'carousel',
    });
  });

  // Optional: emit event when slide change ends
  swiper.on('slideChangeTransitionEnd', () => {
    emit(eventNames.end, {
      featureId: config.featureId,
      slideIndex: swiper.realIndex,
      type: 'carousel',
    });
  });
}

/**
 * Dataset interface for parsing IX3 configuration
 * Subset of dataset attributes needed for IX3 integration
 */
interface IX3Dataset {
  featureId?: string;
  interactionEvents?: string;
  interactionPrefix?: string;
  interactionEventStart?: string;
  interactionEventEnd?: string;
}

/**
 * Parse IX3 configuration from element dataset
 *
 * Maps data attributes to IX3Config:
 * - data-feature-id → featureId
 * - data-interaction-events → enabled
 * - data-interaction-prefix → eventPrefix
 * - data-interaction-event-start → eventStart
 * - data-interaction-event-end → eventEnd
 *
 * @param dataset - Element dataset (or compatible object with IX3 attributes)
 * @returns IX3 configuration
 */
export function parseIX3Config(dataset: IX3Dataset): IX3Config {
  const config: IX3Config = {};

  if (dataset.featureId) {
    config.featureId = dataset.featureId;
  }

  if (dataset.interactionEvents !== undefined) {
    config.enabled = dataset.interactionEvents === 'on' || dataset.interactionEvents === 'true';
  }

  if (dataset.interactionPrefix) {
    config.eventPrefix = dataset.interactionPrefix;
  }

  if (dataset.interactionEventStart) {
    config.eventStart = dataset.interactionEventStart;
  }

  if (dataset.interactionEventEnd) {
    config.eventEnd = dataset.interactionEventEnd;
  }

  return config;
}
