/**
 * Whether React paints anything for `node`. A component checks this before
 * mounting a slot's wrapper, so an empty slot leaves no empty box behind.
 *
 * It is defined by what React renders as nothing — `null`, `undefined`,
 * booleans, the empty string, and arrays of only those — and everything else
 * counts. `0` paints, so it is content, which a truthiness check gets wrong.
 * Anything this can't see into, like a lazily wrapped element from a server
 * component or a portal, counts too, so server and client always agree.
 */
export const isRenderable = (node: unknown): boolean =>
  Array.isArray(node)
    ? node.some(isRenderable)
    : !(node == null || typeof node === "boolean" || node === "");
