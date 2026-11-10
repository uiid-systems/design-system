/** Distance from the bottom, in px, within which the container counts as pinned. */
export const CONVERSATION_SCROLL_THRESHOLD = 70;

/**
 * Distance from the bottom, in px, that still counts as exactly at it. Absorbs
 * the fractional `scrollTop` of a zoomed or high-DPI page, so a clamp to the
 * bottom after content shrinks never reads as the reader scrolling up.
 */
export const CONVERSATION_BOTTOM_EPSILON = 1;
