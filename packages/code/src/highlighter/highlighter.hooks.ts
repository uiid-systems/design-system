"use client";

import { useState, useEffect, useRef } from "react";

import { DEFAULT_LANGUAGE } from "../code.constants";
import { highlight } from "./highlighter";
import type {
  CodeLanguage,
  HighlightOptions,
  HighlightResult,
} from "./highlighter.types";

export type UseHighlightOptions = Pick<
  HighlightOptions,
  "highlightLines" | "notations"
> & {
  /**
   * Set to `false` to skip highlighting: Shiki is never loaded, no theme or
   * grammar is fetched and nothing is highlighted on the client. Use it
   * when there is nothing to highlight, such as plain code or pre-rendered
   * `html`.
   * @default true
   */
  enabled?: boolean;
};

/** One set of inputs to highlight, and the key that identifies it. */
type HighlightRequest = {
  key: string;
  /** How many times the hook had been disabled when the request was made. */
  generation: number;
  code: string;
  language: CodeLanguage;
  highlightLines: number[] | undefined;
  notations: boolean;
};

const NO_PASS = { html: "", code: "" };

/**
 * Hook to highlight code.
 *
 * `html` is the newest highlight that has finished, which can be for an
 * earlier value of `code` while a newer one is pending. The returned `code` is
 * the text `html` was highlighted from: compare it with your input, where
 * equal means `html` is current, to show what `html` does not cover yet.
 * `loading` is true only until the first result lands (and again after
 * re-enabling), so it does not say whether `html` is current. */
export function useHighlight(
  code: string,
  language: CodeLanguage = DEFAULT_LANGUAGE,
  options: UseHighlightOptions = {},
): HighlightResult {
  const enabled = options.enabled ?? true;
  // The markup and the text it is for change together.
  const [pass, setPass] = useState(NO_PASS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // One highlight runs at a time and at most one waits. A new value replaces
  // the waiting one, so a fast stream skips the values in between. Passes
  // finish in order, so each result is newer than the one shown and is kept
  // even while a newer value is pending: a stream never waits for its latest
  // value. Only the latest value's result ends the first load or reports an
  // error; nothing sets loading again for later values.
  // Nothing is kept while disabled or unmounted (the latest value is null),
  // nor from a pass started before the last disable (an older generation).
  const latestRef = useRef<HighlightRequest | null>(null);
  const runningRef = useRef<HighlightRequest | null>(null);
  const waitingRef = useRef<HighlightRequest | null>(null);
  const generationRef = useRef(0);

  // Stable key so callers don't need to memoize the highlightLines array
  const highlightLinesKey = options.highlightLines?.join(",") ?? "";
  const notations = options.notations ?? true;

  useEffect(() => {
    if (!enabled) {
      latestRef.current = null;
      generationRef.current++;
      waitingRef.current = null;
      // Clear the last result so re-enabling never shows stale markup.
      setPass(NO_PASS);
      setLoading(true);
      setError(null);
      return;
    }

    const request: HighlightRequest = {
      key: JSON.stringify([code, language, highlightLinesKey, notations]),
      generation: generationRef.current,
      code,
      language,
      highlightLines: options.highlightLines,
      notations,
    };
    latestRef.current = request;

    const isLatest = (done: HighlightRequest) =>
      latestRef.current?.key === done.key;

    const run = (next: HighlightRequest) => {
      runningRef.current = next;
      highlight(next.code, next.language, {
        highlightLines: next.highlightLines,
        notations: next.notations,
      })
        .then(
          (result) => {
            if (isLatest(next)) {
              setPass({ html: result, code: next.code });
              setLoading(false);
              setError(null);
            } else if (
              latestRef.current &&
              next.generation === generationRef.current
            ) {
              setPass({ html: result, code: next.code });
            }
          },
          (err) => {
            if (!isLatest(next)) return;
            setError(err);
            setLoading(false);
          },
        )
        .finally(() => {
          runningRef.current = null;
          const waiting = waitingRef.current;
          waitingRef.current = null;
          if (waiting) run(waiting);
        });
    };

    if (!runningRef.current) {
      run(request);
    } else if (runningRef.current.key === request.key) {
      // The running highlight is already for this value.
      waitingRef.current = null;
    } else {
      waitingRef.current = request;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language, highlightLinesKey, notations, enabled]);

  // Unmounting drops the running result and the waiting value. StrictMode's
  // remount runs the effect above again, which re-adopts the running value.
  useEffect(
    () => () => {
      latestRef.current = null;
      waitingRef.current = null;
    },
    [],
  );

  if (!enabled) return { html: "", code: "", loading: false, error: null };
  return { html: pass.html, code: pass.code, loading, error };
}
