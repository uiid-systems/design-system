import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDocumentStore } from "../../document/document.store";
import type { NodeId } from "../../document/document.types";
import { manifest } from "../../manifest/manifest";
import { PropField } from "../prop-field";

const store = useDocumentStore;

/** A Text node under the root, selected, with no props set beyond the defaults. */
const seedText = (): NodeId => {
  const root = store.getState().document.root;
  return store.getState().insert("Text", root);
};
const seedButton = (): NodeId => {
  const root = store.getState().document.root;
  return store.getState().insert("Button", root);
};
const seedStack = (): NodeId => {
  const root = store.getState().document.root;
  return store.getState().insert("Stack", root);
};

const props = (id: NodeId) => store.getState().document.nodes[id].props;

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("PropField for a union prop", () => {
  it("renders a Select with the description and one option per member plus an unset option", async () => {
    const id = seedText();
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Text.props.family} />);

    expect(screen.getByText("Typeface family")).toBeInTheDocument();
    await user.click(screen.getByRole("combobox"));

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("Default (sans)");
    expect(options[1]).toHaveTextContent("sans");
    expect(options[2]).toHaveTextContent("serif");
    expect(options[3]).toHaveTextContent("mono");
  });

  it("shows the manifest default when the prop is unset and the value when set", () => {
    const id = seedText();
    const { unmount } = render(
      <PropField nodeId={id} prop={manifest.Text.props.family} />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Default (sans)");
    unmount();

    store.getState().setProp(id, "family", "mono");
    render(<PropField nodeId={id} prop={manifest.Text.props.family} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("mono");
  });

  it("writes the parsed member value, keeping numbers numeric", async () => {
    const id = seedText();
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Text.props.size} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "3" }));

    expect(props(id).size).toBe(3);
  });

  it("choosing the unset option removes the prop", async () => {
    const id = seedText();
    store.getState().setProp(id, "family", "mono");
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Text.props.family} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Default (sans)" }));

    expect("family" in props(id)).toBe(false);
  });
});

describe("PropField for a boolean prop", () => {
  it("renders a Switch that is off while the prop is unset", () => {
    const id = seedButton();
    render(<PropField nodeId={id} prop={manifest.Button.props.fullwidth} />);

    expect(
      screen.getByText("Stretch to fill the container width"),
    ).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toHaveAttribute("data-checked");
  });

  it("turning it on sets true and turning it off removes the prop", async () => {
    const id = seedButton();
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Button.props.fullwidth} />);

    await user.click(screen.getByRole("switch"));
    expect(props(id).fullwidth).toBe(true);

    await user.click(screen.getByRole("switch"));
    expect("fullwidth" in props(id)).toBe(false);
  });
});

describe("PropField for a number prop", () => {
  it("renders a NumberField showing the current value", () => {
    const id = seedStack();
    render(<PropField nodeId={id} prop={manifest.Stack.props.gap} />);

    expect(
      screen.getByText("Gap between children, in spacing units"),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("2");
  });

  it("typing writes a number and clearing removes the prop", async () => {
    const id = seedStack();
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Stack.props.gap} />);

    const field = screen.getByRole("textbox");
    await user.clear(field);
    expect("gap" in props(id)).toBe(false);

    await user.type(field, "6");
    expect(props(id).gap).toBe(6);
  });
});

describe("PropField for a string prop", () => {
  it("renders an Input showing the current value", () => {
    const id = seedText();
    render(<PropField nodeId={id} prop={manifest.Text.props.children} />);

    expect(screen.getByText("Text content")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("Text");
  });

  it("typing writes the string and clearing removes the prop", async () => {
    const id = seedText();
    const user = userEvent.setup();
    render(<PropField nodeId={id} prop={manifest.Text.props.children} />);

    const field = screen.getByRole("textbox");
    await user.clear(field);
    expect("children" in props(id)).toBe(false);

    await user.type(field, "Hi");
    expect(props(id).children).toBe("Hi");
  });
});
