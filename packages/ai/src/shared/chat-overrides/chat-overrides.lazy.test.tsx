import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MessageResponse } from "../../message/subcomponents";
import { Reasoning } from "../../reasoning/reasoning";

// A mocked module only runs its factory when something imports it, so this
// set shows whether a reply pulled in the Shiki runtime. `shiki/core` does not
// resolve from this package, so the mock is on @uiid/code's runtime module,
// the one `import()` that brings in Shiki.
const loaded = vi.hoisted(() => new Set<string>());

vi.mock(
  "../../../../code/src/highlighter/highlighter.runtime",
  async (importOriginal) => {
    loaded.add("runtime");
    return importOriginal();
  },
);

const PROSE =
  "Some **bold** text, a [link](https://uiid.dev) and `inline` code.";

/** Long enough for any `import()` started by the render to have resolved. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 200));

describe("Shiki loading in a chat reply", () => {
  it("loads no Shiki for a reply or reasoning without a code block, then loads it for one", async () => {
    render(<MessageResponse>{PROSE}</MessageResponse>);
    render(<Reasoning defaultOpen>{PROSE}</Reasoning>);
    await settle();
    expect([...loaded]).toEqual([]);

    render(<MessageResponse>{"```ts\nconst a = 1;\n```"}</MessageResponse>);
    await waitFor(() => expect([...loaded]).toEqual(["runtime"]));
  });
});
