import { act, render, renderHook, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { CodeBlock } from "../code-block/code-block";
import { CodeInline } from "../code-inline/code-inline";
import { highlight } from "./highlighter";
import { useHighlight } from "./highlighter.hooks";

vi.mock("./highlighter", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./highlighter")>()),
  highlight: vi.fn(
    async (code: string) => `<pre><code><span>${code}</span></code></pre>`,
  ),
}));

const PRERENDERED = "<pre><code><span>prerendered</span></code></pre>";

describe("useHighlight", () => {
  beforeEach(() => {
    vi.mocked(highlight).mockClear();
  });

  it("highlights by default", async () => {
    const { result } = renderHook(() => useHighlight("const x = 1;"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(highlight).toHaveBeenCalledTimes(1);
    expect(result.current.html).toContain("const x = 1;");
  });

  it("highlights as TypeScript, CodeBlock's default, when no language is given", async () => {
    const { result } = renderHook(() => useHighlight("const x = 1;"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(highlight).toHaveBeenCalledWith(
      "const x = 1;",
      "typescript",
      expect.anything(),
    );
  });

  it("does not highlight when enabled is false", () => {
    const { result } = renderHook(() =>
      useHighlight("const x = 1;", "typescript", { enabled: false }),
    );
    expect(highlight).not.toHaveBeenCalled();
    expect(result.current).toEqual({ html: "", loading: false, error: null });
  });

  it("drops an in-flight result when enabled turns false", async () => {
    let resolveFirst!: (html: string) => void;
    vi.mocked(highlight)
      .mockImplementationOnce(
        () => new Promise<string>((resolve) => (resolveFirst = resolve)),
      )
      .mockImplementationOnce(() => new Promise<string>(() => {}));

    const { result, rerender } = renderHook(
      ({ code, enabled }) => useHighlight(code, "typescript", { enabled }),
      { initialProps: { code: "old", enabled: true } },
    );
    expect(highlight).toHaveBeenCalledTimes(1);

    rerender({ code: "old", enabled: false });
    await act(async () => resolveFirst("<pre>stale</pre>"));

    // Re-enable with new code while its highlight is still pending
    rerender({ code: "new", enabled: true });
    expect(result.current.html).toBe("");
    expect(result.current.loading).toBe(true);
  });

  it("clears the last result when enabled turns false", async () => {
    const { result, rerender } = renderHook(
      ({ code, enabled }) => useHighlight(code, "typescript", { enabled }),
      { initialProps: { code: "old", enabled: true } },
    );
    await waitFor(() => expect(result.current.html).toContain("old"));

    vi.mocked(highlight).mockImplementationOnce(
      () => new Promise<string>(() => {}),
    );
    rerender({ code: "old", enabled: false });
    rerender({ code: "new", enabled: true });
    expect(result.current.html).toBe("");
    expect(result.current.loading).toBe(true);
  });

  it("highlights once enabled turns true", async () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useHighlight("a", "typescript", { enabled }),
      { initialProps: { enabled: false } },
    );
    expect(highlight).not.toHaveBeenCalled();

    rerender({ enabled: true });
    await waitFor(() => expect(result.current.html).toContain("a"));
    expect(highlight).toHaveBeenCalledTimes(1);
  });
});

/** A highlight call the test settles by hand. */
const deferHighlight = () => {
  let resolve!: (html: string) => void;
  let reject!: (error: Error) => void;
  vi.mocked(highlight).mockImplementationOnce(
    () =>
      new Promise<string>((res, rej) => {
        resolve = res;
        reject = rej;
      }),
  );
  return {
    resolve: (html: string) => act(async () => resolve(html)),
    reject: (error: Error) => act(async () => reject(error)),
  };
};

describe("useHighlight request race", () => {
  beforeEach(() => {
    vi.mocked(highlight).mockClear();
  });

  const renderCode = (code: string) =>
    renderHook(({ code }) => useHighlight(code), { initialProps: { code } });

  // Highlights run one at a time, so the newer request starts only once the
  // earlier one settles; the earlier result is dropped and the newer one kept.
  it("keeps the latest result when an earlier one settles first", async () => {
    const first = deferHighlight();
    const second = deferHighlight();
    const { result, rerender } = renderCode("first");
    rerender({ code: "second" });

    await first.resolve("<pre>first</pre>");
    await second.resolve("<pre>second</pre>");

    expect(result.current).toEqual({
      html: "<pre>second</pre>",
      loading: false,
      error: null,
    });
  });

  it("ignores a stale request's error", async () => {
    const first = deferHighlight();
    const second = deferHighlight();
    const { result, rerender } = renderCode("first");
    rerender({ code: "second" });

    await first.reject(new Error("stale"));
    await second.resolve("<pre>second</pre>");

    expect(result.current.error).toBeNull();
    expect(result.current.html).toBe("<pre>second</pre>");
  });

  it("stays loading while only a stale request has settled", async () => {
    const first = deferHighlight();
    deferHighlight();
    const { result, rerender } = renderCode("first");
    rerender({ code: "second" });

    await first.resolve("<pre>first</pre>");

    expect(result.current.html).toBe("");
    expect(result.current.loading).toBe(true);
  });

  it("re-highlights when highlightLines changes, keyed by value", async () => {
    const { result, rerender } = renderHook(
      ({ lines }) => useHighlight("a", "typescript", { highlightLines: lines }),
      { initialProps: { lines: [1] } },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    // A new array with the same lines is not a new request
    rerender({ lines: [1] });
    expect(highlight).toHaveBeenCalledTimes(1);

    rerender({ lines: [1, 3] });
    await waitFor(() => expect(highlight).toHaveBeenCalledTimes(2));
    expect(highlight).toHaveBeenLastCalledWith("a", "typescript", {
      highlightLines: [1, 3],
      notations: true,
    });
  });

  it("passes notations through and re-highlights when it changes", async () => {
    const { result, rerender } = renderHook(
      ({ notations }) => useHighlight("a", "typescript", { notations }),
      { initialProps: { notations: false } },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(highlight).toHaveBeenLastCalledWith("a", "typescript", {
      highlightLines: undefined,
      notations: false,
    });

    rerender({ notations: true });
    await waitFor(() => expect(highlight).toHaveBeenCalledTimes(2));
    expect(highlight).toHaveBeenLastCalledWith("a", "typescript", {
      highlightLines: undefined,
      notations: true,
    });
  });
});

/** The markup the controlled highlighter produces for one call. */
const markupFor = (code: string, language = "typescript", lines = "") =>
  `<pre data-language="${language}" data-lines="${lines}">${code}</pre>`;

type ControlledCall = {
  code: string;
  language: string;
  highlightLines: number[] | undefined;
  resolve: () => Promise<void>;
  reject: (error: Error) => Promise<void>;
};

/**
 * Replaces `highlight` with one whose every call stays pending until the
 * test settles it, and records how many calls overlap.
 */
const controlHighlight = () => {
  const calls: ControlledCall[] = [];
  let running = 0;
  let maxRunning = 0;
  vi.mocked(highlight).mockImplementation(
    (code, language = "typescript", options = {}) =>
      new Promise<string>((res, rej) => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        let settled = false;
        const settle = (fn: () => void) => {
          if (settled) throw new Error(`"${code}" already settled`);
          settled = true;
          return act(async () => {
            running--;
            fn();
          });
        };
        calls.push({
          code,
          language,
          highlightLines: options.highlightLines,
          resolve: () =>
            settle(() =>
              res(markupFor(code, language, options.highlightLines?.join())),
            ),
          reject: (error) => settle(() => rej(error)),
        });
      }),
  );
  return {
    calls,
    get maxRunning() {
      return maxRunning;
    },
    /** Settles the newest call, the only one that can be running. */
    resolveCurrent: () => calls[calls.length - 1].resolve(),
    rejectCurrent: (error: Error) => calls[calls.length - 1].reject(error),
  };
};

describe("useHighlight scheduling", () => {
  beforeEach(() => {
    vi.mocked(highlight).mockClear();
  });

  afterEach(() => {
    vi.mocked(highlight).mockImplementation(
      async (code: string) => `<pre><code><span>${code}</span></code></pre>`,
    );
  });

  it("runs one highlight at a time and keeps only the latest waiting", async () => {
    const control = controlHighlight();
    const { rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code: "a" },
    });
    rerender({ code: "ab" });
    rerender({ code: "abc" });
    rerender({ code: "abcd" });
    expect(control.calls.map((call) => call.code)).toEqual(["a"]);

    await control.resolveCurrent();
    // The values in between were skipped
    expect(control.calls.map((call) => call.code)).toEqual(["a", "abcd"]);
    expect(control.maxRunning).toBe(1);
  });

  it("bounds the highlight calls for a 400-chunk stream", async () => {
    const control = controlHighlight();
    const chunks = Array.from({ length: 400 }, (_, i) => `line ${i};\n`);
    let code = chunks[0];
    const { result, rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code },
    });

    // A highlight takes as long as ten chunks to arrive
    for (let i = 1; i < chunks.length; i++) {
      code += chunks[i];
      rerender({ code });
      if (i % 10 === 0) await control.resolveCurrent();
    }
    // The pass started at chunk 390, then the final text
    await control.resolveCurrent();
    await control.resolveCurrent();

    // The first pass, one per ten chunks after it, and the final text
    expect(control.calls.length).toBeLessThanOrEqual(41);
    expect(control.maxRunning).toBe(1);
    expect(result.current).toEqual({
      html: markupFor(code),
      loading: false,
      error: null,
    });
  });

  it("calls highlight twice when the whole stream lands during the first", async () => {
    const control = controlHighlight();
    let code = "";
    const { result, rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code },
    });
    for (let i = 0; i < 400; i++) {
      code += `${i} `;
      rerender({ code });
    }

    await control.resolveCurrent();
    await control.resolveCurrent();

    expect(control.calls.map((call) => call.code)).toEqual(["", code]);
    expect(result.current.html).toBe(markupFor(code));
  });

  it("re-highlights with the latest code when the language changes mid-flight", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(
      ({ code, language }) => useHighlight(code, language),
      { initialProps: { code: "<div", language: "typescript" } },
    );
    rerender({ code: "<div>", language: "tsx" });
    rerender({ code: "<div></div>", language: "tsx" });

    await control.resolveCurrent();
    await control.resolveCurrent();

    expect(control.calls.at(-1)).toMatchObject({
      code: "<div></div>",
      language: "tsx",
    });
    expect(result.current.html).toBe(markupFor("<div></div>", "tsx"));
  });

  it("re-highlights when the language arrives after the first characters", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(
      ({ code, language }: { code: string; language?: string }) =>
        useHighlight(code, language),
      { initialProps: { code: "con" } as { code: string; language?: string } },
    );
    await control.resolveCurrent();
    expect(result.current.html).toBe(markupFor("con"));

    rerender({ code: "const", language: "python" });
    await control.resolveCurrent();

    expect(control.calls.at(-1)).toMatchObject({
      code: "const",
      language: "python",
    });
    expect(result.current.html).toBe(markupFor("const", "python"));
  });

  it("re-highlights when highlightLines changes mid-flight", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(
      ({ lines }) => useHighlight("a", "typescript", { highlightLines: lines }),
      { initialProps: { lines: [1] } },
    );
    rerender({ lines: [1, 2] });

    await control.resolveCurrent();
    await control.resolveCurrent();

    expect(control.calls.map((call) => call.highlightLines)).toEqual([
      [1],
      [1, 2],
    ]);
    expect(result.current.html).toBe(markupFor("a", "typescript", "1,2"));
  });

  it("does not queue a value equal to the one running", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code: "a" },
    });
    rerender({ code: "ab" });
    rerender({ code: "a" });

    await control.resolveCurrent();

    expect(control.calls).toHaveLength(1);
    expect(result.current.html).toBe(markupFor("a"));
  });

  it("runs the waiting highlight after the running one rejects", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code: "a" },
    });
    rerender({ code: "ab" });

    await control.rejectCurrent(new Error("stale"));
    expect(control.calls).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(true);

    await control.resolveCurrent();
    expect(result.current).toEqual({
      html: markupFor("ab"),
      loading: false,
      error: null,
    });
  });

  it("reports the latest highlight's error and clears it on the next success", async () => {
    const control = controlHighlight();
    const error = new Error("boom");
    const { result, rerender } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code: "a" },
    });

    await control.rejectCurrent(error);
    expect(result.current).toEqual({ html: "", loading: false, error });

    rerender({ code: "ab" });
    await control.resolveCurrent();
    expect(result.current).toEqual({
      html: markupFor("ab"),
      loading: false,
      error: null,
    });
  });

  it("clears the result when disabled mid-flight and drops the late result", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(
      ({ code, enabled }) => useHighlight(code, "typescript", { enabled }),
      { initialProps: { code: "a", enabled: true } },
    );
    await control.resolveCurrent();
    rerender({ code: "ab", enabled: true });
    rerender({ code: "abc", enabled: true });

    rerender({ code: "abc", enabled: false });
    expect(result.current).toEqual({ html: "", loading: false, error: null });

    await control.resolveCurrent();
    // Neither the late result nor the skipped waiting value comes back
    expect(control.calls).toHaveLength(2);
    expect(result.current).toEqual({ html: "", loading: false, error: null });

    rerender({ code: "abc", enabled: true });
    expect(result.current).toEqual({ html: "", loading: true, error: null });
    await control.resolveCurrent();
    expect(result.current.html).toBe(markupFor("abc"));
  });

  it("uses the running highlight when re-enabled with the same value", async () => {
    const control = controlHighlight();
    const { result, rerender } = renderHook(
      ({ enabled }) => useHighlight("a", "typescript", { enabled }),
      { initialProps: { enabled: true } },
    );
    rerender({ enabled: false });
    rerender({ enabled: true });

    await control.resolveCurrent();

    expect(control.calls).toHaveLength(1);
    expect(result.current.html).toBe(markupFor("a"));
  });

  it("starts nothing after unmount, and a late result is harmless", async () => {
    const control = controlHighlight();
    const { rerender, unmount } = renderHook(({ code }) => useHighlight(code), {
      initialProps: { code: "a" },
    });
    rerender({ code: "ab" });
    unmount();

    await control.resolveCurrent();

    expect(control.calls).toHaveLength(1);
  });

  it("highlights once under StrictMode double effects", async () => {
    const control = controlHighlight();
    const { result } = renderHook(() => useHighlight("a"), {
      wrapper: StrictMode,
    });

    await control.resolveCurrent();

    expect(control.calls).toHaveLength(1);
    expect(result.current).toEqual({
      html: markupFor("a"),
      loading: false,
      error: null,
    });
  });
});

describe("components skip the highlighter when there is nothing to do", () => {
  beforeEach(() => {
    vi.mocked(highlight).mockClear();
  });

  it("CodeInline without a language", () => {
    render(<CodeInline>npm install</CodeInline>);
    expect(highlight).not.toHaveBeenCalled();
  });

  it("CodeInline with prerendered html", () => {
    render(
      <CodeInline language="typescript" html={PRERENDERED}>
        prerendered
      </CodeInline>,
    );
    expect(highlight).not.toHaveBeenCalled();
  });

  it("CodeInline with a language and no html", async () => {
    render(<CodeInline language="typescript">const x = 1;</CodeInline>);
    await waitFor(() => expect(highlight).toHaveBeenCalledTimes(1));
  });

  it("CodeBlock with prerendered html", () => {
    const { container } = render(
      <CodeBlock code="prerendered" html={PRERENDERED} />,
    );
    expect(highlight).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-slot="code-block-content"]')?.textContent,
    ).toContain("prerendered");
  });

  it("CodeBlock without html", async () => {
    render(<CodeBlock code="const x = 1;" />);
    await waitFor(() => expect(highlight).toHaveBeenCalledTimes(1));
  });
});
