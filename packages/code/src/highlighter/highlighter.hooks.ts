"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { getHighlighter, loadLanguage, highlight } from "./highlighter";
import type {
  CodeLanguage,
  HighlightOptions,
  HighlightResult,
} from "./highlighter.types";

/**
 * Hook to access the shared highlighter instance
 */
export function useHighlighter() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    getHighlighter()
      .then(() => {
        if (mounted) {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const loadLang = useCallback(async (language: CodeLanguage) => {
    await loadLanguage(language);
  }, []);

  return { loading, error, loadLanguage: loadLang };
}

export type UseHighlightOptions = Pick<HighlightOptions, "highlightLines"> & {
  /**
   * Set to `false` to skip highlighting, so Shiki is never loaded. Use it when
   * there is nothing to highlight, such as plain code or pre-rendered `html`.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Hook to highlight code
 */
export function useHighlight(
  code: string,
  language: CodeLanguage = "typescript",
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
    if (!enabled) return;

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
