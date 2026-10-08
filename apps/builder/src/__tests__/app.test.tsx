import { render } from "@testing-library/react";

import { App } from "../app";
import { useDocumentStore } from "../document/document.store";

describe("App", () => {
  it("renders the canvas with the root Stack", () => {
    render(<App />);

    const root = useDocumentStore.getState().document.root;
    const rootEl = document.querySelector(`[data-canvas-node="${root}"]`);

    expect(document.querySelector('[data-slot="canvas"]')).toContainElement(
      rootEl as HTMLElement,
    );
    expect(rootEl).toHaveAttribute("data-slot", "stack");
  });
});
