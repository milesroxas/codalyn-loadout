/**
 * Interaction Bridge - DOM State Management
 *
 * Provides shared helpers for applying consistent state markers to DOM elements.
 * These state markers are used by Webflow IX3 to target elements for animations.
 */

/**
 * Configuration for state management
 */
export interface StateConfig {
  /** Attribute name to use for state markers (default: 'data-state') */
  attr?: string;
  /** Feature ID to enable logging for (e.g., 'events') */
  logForFeature?: string;
}

/**
 * State assignment for elements
 * Maps state values to indices
 */
export interface StateAssignment {
  /** Index of the active element */
  active?: number;
  /** Index of the previous element */
  prev?: number;
  /** Index of the next element */
  next?: number;
}

/**
 * Valid state values
 */
export type StateValue = 'active' | 'prev' | 'next' | 'inactive';

/**
 * Apply state markers to a collection of elements
 *
 * This is the canonical way to set state attributes across features.
 * Ensures consistent state application and cleanup.
 *
 * @param items - Array or NodeList of elements to update
 * @param assignment - State assignment mapping
 * @param config - Configuration options
 *
 * @example
 * ```ts
 * const slides = carousel.querySelectorAll('.slide');
 * setState(slides, { active: 0, prev: 2, next: 1 });
 * ```
 */
export function setState(
  items: Element[] | NodeListOf<Element>,
  assignment: StateAssignment,
  config: StateConfig = {}
): void {
  const attr = config.attr || 'data-state';
  const itemsArray = Array.from(items);
  const shouldLog = config.logForFeature !== undefined;

  if (shouldLog) {
    console.log(`[State:${config.logForFeature}] Setting states for`, itemsArray.length, 'items:', assignment);
  }

  // Clear all states from all items
  for (const item of itemsArray) {
    item.removeAttribute(attr);
  }

  // Apply new states
  if (assignment.active !== undefined && itemsArray[assignment.active]) {
    itemsArray[assignment.active].setAttribute(attr, 'active');
    if (shouldLog) {
      console.log(`[State:${config.logForFeature}] ✓ Set active:`, assignment.active);
    }
  }

  if (assignment.prev !== undefined && itemsArray[assignment.prev]) {
    itemsArray[assignment.prev].setAttribute(attr, 'prev');
    if (shouldLog) {
      console.log(`[State:${config.logForFeature}] ✓ Set prev:`, assignment.prev);
    }
  }

  if (assignment.next !== undefined && itemsArray[assignment.next]) {
    itemsArray[assignment.next].setAttribute(attr, 'next');
    if (shouldLog) {
      console.log(`[State:${config.logForFeature}] ✓ Set next:`, assignment.next);
    }
  }

  // Mark remaining items as inactive
  // Count how many slides actually got active/prev/next states
  const statedSlides = [assignment.active, assignment.prev, assignment.next]
    .filter(idx => idx !== undefined).length;
  const inactiveCount = itemsArray.length - statedSlides;

  for (let i = 0; i < itemsArray.length; i++) {
    if (i !== assignment.active && i !== assignment.prev && i !== assignment.next) {
      itemsArray[i].setAttribute(attr, 'inactive');
    }
  }

  if (inactiveCount > 0 && shouldLog) {
    console.log(`[State:${config.logForFeature}] ✓ Set`, inactiveCount, 'items to inactive');
  }
}

/**
 * Clear state markers from elements
 *
 * @param items - Array or NodeList of elements to clear
 * @param config - Configuration options
 *
 * @example
 * ```ts
 * const slides = carousel.querySelectorAll('.slide');
 * clearState(slides);
 * ```
 */
export function clearState(items: Element[] | NodeListOf<Element>, config: StateConfig = {}): void {
  const attr = config.attr || 'data-state';
  const itemsArray = Array.from(items);

  console.log('[State] Clearing states for', itemsArray.length, 'items');

  for (const item of itemsArray) {
    item.removeAttribute(attr);
  }

  console.log('[State] ✓ All states cleared');
}

/**
 * Get the current state of an element
 *
 * @param element - Element to check
 * @param config - Configuration options
 * @returns Current state value or null if no state is set
 *
 * @example
 * ```ts
 * const slide = carousel.querySelector('.slide');
 * const state = getState(slide); // 'active' | 'prev' | 'next' | 'inactive' | null
 * ```
 */
export function getState(element: Element, config: StateConfig = {}): StateValue | null {
  const attr = config.attr || 'data-state';
  const value = element.getAttribute(attr);

  if (value === 'active' || value === 'prev' || value === 'next' || value === 'inactive') {
    return value;
  }

  return null;
}
