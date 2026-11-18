import { render, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

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

  it("does not highlight when enabled is false", () => {
    const { result } = renderHook(() =>
      useHighlight("const x = 1;", "typescript", { enabled: false }),
    );
    expect(highlight).not.toHaveBeenCalled();
    expect(result.current).toEqual({ html: "", loading: false, error: null });
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
