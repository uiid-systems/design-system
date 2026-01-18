"use client";

import { useState, useEffect, useCallback } from "react";

import type { BundledLanguage, HighlightResult } from "./highlighter.types";
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
  language: BundledLanguage = "typescript"
): HighlightResult {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    highlight(code, language)
      .then((result) => {
        if (mounted) {
          setHtml(result);
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
  }, [code, language]);

  return { html, loading, error };
}
