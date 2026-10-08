import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDocumentStore } from "../../document/document.store";
import { manifest } from "../../manifest/manifest";
import { Inspector } from "../inspector";

const store = useDocumentStore;

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("Inspector", () => {
  it("asks for a selection when nothing is selected", () => {
    render(<Inspector />);

    expect(screen.getByText(/select a node/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
  });

  it("shows the selected node's display name and one field per manifest prop", () => {
    const root = store.getState().document.root;
    store.getState().insert("Button", root);
    render(<Inspector />);

    expect(screen.getByText("Button")).toBeInTheDocument();
    for (const prop of Object.values(manifest.Button.props)) {
      expect(screen.getByText(prop.description)).toBeInTheDocument();
    }
  });

  it("Parent selects the holding container and is disabled for the root", async () => {
    const root = store.getState().document.root;
    const stack = store.getState().insert("Stack", root);
    store.getState().insert("Text", stack);
    const user = userEvent.setup();
    render(<Inspector />);

    await user.click(screen.getByRole("button", { name: "Parent" }));
    expect(store.getState().selectedId).toBe(stack);

    await user.click(screen.getByRole("button", { name: "Parent" }));
    expect(store.getState().selectedId).toBe(root);
    expect(screen.getByRole("button", { name: "Parent" })).toBeDisabled();
  });

  it("disables Delete for the root", () => {
    const root = store.getState().document.root;
    store.getState().select(root);
    render(<Inspector />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("Delete removes the subtree and clears the selection", async () => {
    const root = store.getState().document.root;
    const stack = store.getState().insert("Stack", root);
    const text = store.getState().insert("Text", stack);
    store.getState().select(stack);
    const user = userEvent.setup();
    render(<Inspector />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    const { document, selectedId } = store.getState();
    expect(document.nodes[stack]).toBeUndefined();
    expect(document.nodes[text]).toBeUndefined();
    expect(selectedId).toBeNull();
    expect(screen.getByText(/select a node/i)).toBeInTheDocument();
  });
});
