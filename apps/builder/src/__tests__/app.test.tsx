import { render, screen } from "@testing-library/react";

import { App } from "../app";
import { useDocumentStore } from "../document/document.store";

vi.mock("../../../../packages/code/src/highlighter/highlighter.hooks", () => ({
  useHighlight: () => ({ html: "", loading: false, error: null }),
  useHighlighter: () => ({
    loading: false,
    error: null,
    loadLanguage: vi.fn(),
  }),
}));

describe("App", () => {
  it("lays out palette, canvas, and a tabbed right column with Props selected", () => {
    render(<App />);

    const root = useDocumentStore.getState().document.root;
    expect(document.querySelector('[data-slot="palette"]')).toBeInTheDocument();
    expect(
      document.querySelector(`[data-canvas-node="${root}"]`),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="resizable-panel"]'),
    ).toHaveLength(3);
    expect(
      document.querySelectorAll('[data-slot="resizable-handle"]'),
    ).toHaveLength(2);

    expect(screen.getByRole("tab", { name: "Props" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByText(/select a node/i)).toBeInTheDocument();
  });
});
