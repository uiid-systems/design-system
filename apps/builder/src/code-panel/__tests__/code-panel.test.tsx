import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDocumentStore } from "../../document/document.store";
import expectedTxt from "../../emit/__fixtures__/page.txt?raw";
import { CodePanel } from "../code-panel";

// Shiki loads asynchronously and is not what this test is about; the fallback
// renders the raw module text, which is what the assertions read.
vi.mock(
  "../../../../../packages/code/src/highlighter/highlighter.hooks",
  () => ({
    useHighlight: () => ({ html: "", loading: false, error: null }),
    useHighlighter: () => ({
      loading: false,
      error: null,
      loadLanguage: vi.fn(),
    }),
  }),
);

const store = useDocumentStore;

const seedSuccessScenario = () => {
  const s = store.getState();
  const root = s.document.root;
  const card = s.insert("Card", root);
  s.setProp(card, "title", "Welcome");
  const hello = s.insert("Text", card);
  s.setProp(hello, "children", "Hello");
  s.setProp(hello, "size", 3);
  s.setProp(hello, "weight", "bold");
  const para = s.insert("Text", card);
  s.setProp(para, "children", "Built with the UIID page builder.");
  const group = s.insert("Group", card);
  const primary = s.insert("Button", group);
  s.setProp(primary, "children", "Primary");
  const secondary = s.insert("Button", group);
  s.setProp(secondary, "children", "Secondary");
  s.setProp(secondary, "variant", "ghost");
  return { card };
};

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("CodePanel", () => {
  it("shows the emitted module for the current document", () => {
    render(<CodePanel />);

    expect(screen.getByText("page.tsx")).toBeInTheDocument();
    expect(screen.getByText("export function Page() {")).toBeInTheDocument();
    expect(screen.getByText("<Stack gap={4} p={6} />")).toBeInTheDocument();
  });

  it("updates when the document changes", () => {
    const { card } = seedSuccessScenario();
    render(<CodePanel />);
    expect(screen.getByText('<Card title="Welcome">')).toBeInTheDocument();

    act(() => store.getState().setProp(card, "title", "Changed"));

    expect(screen.getByText('<Card title="Changed">')).toBeInTheDocument();
  });

  it("copies the full module, byte-identical to the fixture", async () => {
    seedSuccessScenario();
    const user = userEvent.setup();
    render(<CodePanel />);

    // user-event installs its own clipboard, so read back through it.
    await user.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe(expectedTxt),
    );
  });
});
