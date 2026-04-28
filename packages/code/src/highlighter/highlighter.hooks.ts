"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import type {
  BundledLanguage,
  HighlightOptions,
  HighlightResult,
} from "./highlighter.types";
import { getHighlighter, loadLanguage, highlight } from "./highlighter";

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

  const loadLang = useCallback(async (language: BundledLanguage) => {
    await loadLanguage(language);
  }, []);

  return { loading, error, loadLanguage: loadLang };
}

/**
 * Hook to highlight code
 */
export function useHighlight(
  code: string,
  language: BundledLanguage = "typescript",
  options: Pick<HighlightOptions, "highlightLines"> = {}
): HighlightResult {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const requestRef = useRef(0);

  // Stable key so callers don't need to memoize the highlightLines array
  const highlightLinesKey = options.highlightLines?.join(",") ?? "";

  useEffect(() => {
    const requestId = ++requestRef.current;

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
  }, [code, language, highlightLinesKey]);

  return { html, loading, error };
}
