import { useMemo } from "react";
import type { UISpec } from "./catalog";

/**
 * Enrich spec elements with their record key so component renderers
 * can stamp `data-element-key` on the DOM for the inspector.
 */
export function useEnrichedSpec(spec: UISpec | null) {
  return useMemo(() => {
    if (!spec) return null;
    const elements = { ...spec.elements };
    for (const key of Object.keys(elements)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      elements[key] = { ...(elements[key] as any), key };
    }
    return { ...spec, elements } as UISpec;
  }, [spec]);
}
