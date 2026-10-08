import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDocumentStore } from "../../document/document.store";
import type { NodeId } from "../../document/document.types";
import { Canvas } from "../canvas";

const store = useDocumentStore;

/** root > [stack > [text], button, card > [group > [input]]] */
const seed = () => {
  const { insert } = store.getState();
  const root = store.getState().document.root;
  const stack = insert("Stack", root);
  const text = insert("Text", stack);
  const button = insert("Button", root);
  const card = insert("Card", root);
  const group = insert("Group", card);
  const input = insert("Input", group);
  store.getState().select(null);
  return { root, stack, text, button, card, group, input };
};

const nodeEl = (id: NodeId) =>
  document.querySelector(`[data-canvas-node="${id}"]`) as HTMLElement;

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("Canvas", () => {
  it("renders every manifest component with its own data-slot intact", () => {
    const ids = seed();
    render(<Canvas />);

    expect(nodeEl(ids.root)).toHaveAttribute("data-slot", "stack");
    expect(nodeEl(ids.stack)).toHaveAttribute("data-slot", "stack");
    expect(nodeEl(ids.group)).toHaveAttribute("data-slot", "group");
    expect(nodeEl(ids.card)).toHaveAttribute("data-slot", "card-container");
    expect(nodeEl(ids.text)).toHaveAttribute("data-slot", "text");
    expect(nodeEl(ids.button)).toHaveAttribute("data-slot", "button");
    expect(nodeEl(ids.input)).toHaveAttribute("data-slot", "input");
  });

  it("nests children inside their container's element", () => {
    const ids = seed();
    render(<Canvas />);

    expect(nodeEl(ids.stack)).toContainElement(nodeEl(ids.text));
    expect(nodeEl(ids.card)).toContainElement(nodeEl(ids.group));
    expect(nodeEl(ids.group)).toContainElement(nodeEl(ids.input));
    expect(nodeEl(ids.root)).toContainElement(nodeEl(ids.button));
  });

  it("renders a leaf's text content from its children prop", () => {
    const ids = seed();
    store.getState().setProp(ids.text, "children", "Hello there");
    render(<Canvas />);

    expect(nodeEl(ids.text)).toHaveTextContent("Hello there");
    expect(screen.getByRole("button", { name: "Button" })).toBe(
      nodeEl(ids.button),
    );
  });

  it("clicking a nested node selects it and not its parent", async () => {
    const ids = seed();
    const user = userEvent.setup();
    render(<Canvas />);

    await user.click(nodeEl(ids.text));

    expect(store.getState().selectedId).toBe(ids.text);
  });

  it("clicking a container selects the container itself", async () => {
    const ids = seed();
    const user = userEvent.setup();
    render(<Canvas />);

    await user.click(nodeEl(ids.card));

    expect(store.getState().selectedId).toBe(ids.card);
  });

  it("clicking the empty canvas selects the root", async () => {
    const ids = seed();
    store.getState().select(ids.text);
    const user = userEvent.setup();
    render(<Canvas />);

    await user.click(document.querySelector('[data-slot="canvas"]')!);

    expect(store.getState().selectedId).toBe(ids.root);
  });

  it("marks only the selected node", () => {
    const ids = seed();
    store.getState().select(ids.text);
    render(<Canvas />);

    expect(nodeEl(ids.text)).toHaveAttribute("data-selected");
    expect(nodeEl(ids.stack)).not.toHaveAttribute("data-selected");
    expect(nodeEl(ids.root)).not.toHaveAttribute("data-selected");
  });

  it("moves the selection mark when the store's selection changes", () => {
    const ids = seed();
    render(<Canvas />);
    act(() => store.getState().select(ids.button));

    expect(nodeEl(ids.button)).toHaveAttribute("data-selected");
    expect(nodeEl(ids.text)).not.toHaveAttribute("data-selected");
  });
});
