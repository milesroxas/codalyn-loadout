/**
 * Interaction Bridge - Webflow IX3 Event Emitter
 *
 * Provides a safe interface to emit custom events to Webflow's GSAP IX3 system.
 * This is the single source of truth for IX3 integration across all features.
 */

/**
 * IX3 API interface from Webflow
 */
interface IX3API {
  trigger: (eventName: string, payload?: unknown) => void;
}

/**
 * Global Webflow interface
 */
interface WebflowGlobal {
  require: (module: string) => IX3API | undefined;
}

declare const Webflow: WebflowGlobal | undefined;

/**
 * Cached IX3 instance
 * Resolved once on first emit call to avoid repeated lookups
 */
let ix3Cache: IX3API | null | undefined;

/**
 * Resolve and cache IX3 API
 * Returns null if IX3 is unavailable, caches the result
 */
function resolveIX3(): IX3API | null {
  // Return cached result if already resolved
  if (ix3Cache !== undefined) {
    return ix3Cache;
  }

  // Check if running in Webflow environment
  if (typeof Webflow === 'undefined' || typeof Webflow.require !== 'function') {
    ix3Cache = null;
    return null;
  }

  try {
    const ix3 = Webflow.require('ix3');
    ix3Cache = ix3 || null;
    return ix3Cache;
  } catch {
    ix3Cache = null;
    return null;
  }
}

/**
 * Check if IX3 is available in the current environment
 *
 * @returns true if Webflow IX3 is available
 */
export function isAvailable(): boolean {
  return resolveIX3() !== null;
}

/**
 * Emit a custom event to Webflow IX3
 *
 * Safe to call in any environment - no-ops when IX3 is unavailable.
 * Events are prefixed with 'interaction:' by default for consistency.
 *
 * @param eventName - Event name (will be prefixed if not already)
 * @param payload - Optional event payload
 *
 * @example
 * ```ts
 * // Emit a canonical event
 * emit('state-change:start');
 *
 * // Emit a feature-namespaced event
 * emit('carousel:state-change:start', { slideIndex: 0 });
 * ```
 */
export function emit(eventName: string, payload?: unknown): void {
  const ix3 = resolveIX3();

  if (!ix3) {
    return;
  }

  try {
    // Normalize event name - add interaction: prefix if not present
    const normalizedName = eventName.startsWith('interaction:')
      ? eventName
      : `interaction:${eventName}`;

    ix3.trigger(normalizedName, payload);
  } catch (error) {
    console.warn('[InteractionBridge] Failed to emit event:', eventName, error);
  }
}

/**
 * Reset the IX3 cache
 * Primarily for testing purposes
 * @internal
 */
export function resetCache(): void {
  ix3Cache = undefined;
}
