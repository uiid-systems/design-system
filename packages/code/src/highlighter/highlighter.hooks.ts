"use client";

import { useState, useEffect, useRef } from "react";

import { DEFAULT_LANGUAGE } from "../code.constants";
import { highlight } from "./highlighter";
import type {
  CodeLanguage,
  HighlightOptions,
  HighlightResult,
} from "./highlighter.types";

export type UseHighlightOptions = Pick<HighlightOptions, "highlightLines"> & {
  /**
   * Set to `false` to skip highlighting: Shiki is never loaded, no theme or
   * grammar is fetched and nothing is highlighted on the client. Use it
   * when there is nothing to highlight, such as plain code or pre-rendered
   * `html`.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Hook to highlight code
 */
export function useHighlight(
  code: string,
  language: CodeLanguage = DEFAULT_LANGUAGE,
  options: UseHighlightOptions = {},
): HighlightResult {
  const enabled = options.enabled ?? true;
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const requestRef = useRef(0);

  // Stable key so callers don't need to memoize the highlightLines array
  const highlightLinesKey = options.highlightLines?.join(",") ?? "";

  useEffect(() => {
    // Bumping the id also drops any in-flight result from an earlier run.
    const requestId = ++requestRef.current;
    if (!enabled) {
      // Clear the last result so re-enabling never shows stale markup.
      setHtml("");
      setLoading(true);
      setError(null);
      return;
    }

    highlight(code, language, { highlightLines: options.highlightLines })
      .then((result) => {
        if (requestRef.current === requestId) {
          setHtml(result);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (requestRef.current === requestId) {
          setError(err);
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language, highlightLinesKey, enabled]);

  if (!enabled) return { html: "", loading: false, error: null };
  return { html, loading, error };
}
