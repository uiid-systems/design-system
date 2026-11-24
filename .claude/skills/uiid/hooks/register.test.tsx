import { expect, test } from "claude-code/testing";

import { layOut, toGraph, withChange } from "./graph";

const PANE = {
  plugin: "uiid",
  component: "Pane",
  requestId: "project-graph",
  props: {
    title: "Project graph",
    isFocused: false,
    bodyColumns: 44,
    placement: "dock",
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const;

const INPUT = {
  title: "Checkout rewrite",
  updated: "Nov 23, 8:50 PM",
  linkBase: "https://linear.app/acme/issue/",
  prBase: "https://github.com/acme/app/pull/",
  sections: [
    {
      heading: "Ready",
      tickets: [
        { id: "UI-436", status: "in review", pr: 691 },
        { id: "UI-466" },
      ],
    },
    {
      heading: "Blocked",
      tickets: [
        { id: "UI-437", status: "building", waitsOn: ["UI-436"] },
        { id: "UI-438", waitsOn: ["UI-437"] },
        { id: "UI-441", waitsOn: ["UI-437", "UI-900"] },
        { id: "UI-442", waitsOn: ["UI-438", "UI-441"] },
      ],
    },
    {
      heading: "After the Phase 5 checkpoint",
      isGate: true,
      tickets: [{ id: "UI-444", waitsOn: ["UI-442"] }],
    },
  ],
};

const drawing = (columns = 44): string[] => {
  const graph = toGraph(INPUT);
  if (graph === undefined) throw new Error("no graph");

  return layOut(graph, columns).map((row) => {
    if (row.kind === "ticket") return `${row.gutter}● ${row.ticket.id}`;
    if (row.kind === "heading") return `${row.gutter}${row.text}`;
    if (row.kind === "note") return `${row.gutter}  ${row.text}`;

    return row.gutter;
  });
};

test("each blocker's rail joins the tickets that wait on it", () => {
  expect(drawing()).toEqual([
    "      Ready",
    "╭─────● UI-436",
    "│       5 tickets wait on this",
    "│     ● UI-466",
    "│     ",
    "│     Blocked",
    "╰─┬───● UI-437",
    "╭─┼───● UI-438",
    "│ ╰─┬─● UI-441",
    "│   │   waits on UI-900",
    "╰─┬─┴─● UI-442",
    "  │   ",
    "══╪═══After the Phase 5 checkpoint",
    "  │   ",
    "  ╰───● UI-444",
  ]);
});

test("a rail takes its blocker's status", () => {
  const graph = toGraph(INPUT);
  if (graph === undefined) throw new Error("no graph");
  const rows = layOut(graph, 44);

  expect(rows[1]?.marks).toEqual([
    { text: "╭", status: "in review" },
    { text: "─────" },
  ]);
  expect(rows[7]?.marks).toEqual([
    { text: "╭─" },
    { text: "┼", status: "building" },
    { text: "───" },
  ]);
});

test("a graph read back from the store is unchanged", () => {
  const graph = toGraph(INPUT);

  expect(toGraph(graph)).toEqual(graph);
});

test("input the pane cannot draw is dropped", () => {
  const graph = toGraph({
    title: "x",
    linkBase: "javascript:alert(1)",
    prBase: "https://example.com/pull/",
    sections: [
      {
        heading: "Ready",
        tickets: [
          { id: "ui-1", status: "exploded", pr: -2, waitsOn: ["UI-1", "nope"] },
          { id: "not a ticket" },
          { id: "UI-1" },
        ],
      },
    ],
  });

  expect(graph?.linkBase).toBe("");
  expect(graph?.prBase).toBe("");
  expect(graph?.sections[0]?.tickets).toEqual([{ id: "UI-1", waitsOn: [] }]);
  expect(toGraph({ sections: [{ heading: "Ready", tickets: [] }] })).toBe(
    undefined,
  );
});

test("a change touches one ticket and keeps the rest", () => {
  const graph = toGraph(INPUT);
  if (graph === undefined) throw new Error("no graph");
  const changed = withChange(graph, "UI-437", { status: "waiting", pr: 700 });

  expect(changed?.sections[1]?.tickets[0]).toEqual({
    id: "UI-437",
    waitsOn: ["UI-436"],
    pr: 700,
  });
  expect(changed?.sections[0]).toEqual(graph.sections[0]);
  expect(withChange(graph, "UI-999", { pr: 1 })).toBe(undefined);
  expect(
    withChange(graph, "UI-436", { status: "merged" })?.sections[0]?.tickets[0]
      ?.status,
  ).toBe("merged");
});

test("the pane draws what set_graph sent, then follows set_status", async ($, on) => {
  on("command.register", () => ({ value: { command: "project-graph" } }));
  on("tool.register", () => ({ value: { tool: "mcp__uiid__set_graph" } }));
  on("ui.open", () => ({ value: { isPlaced: true } }));
  on("session.start", (_, e) => ({ cwd: e.cwd }));
  const kept = new Map<string, unknown>();
  on("store.get", (_, e) => ({ value: kept.get(e.key) }));
  on("store.set", (_, e) => {
    kept.set(e.key, e.value);

    return { value: undefined };
  });

  await $.session.start({ cwd: "/", surface: "terminal", isInteractive: true });

  for (const surface of ["terminal", "desktop"] as const) {
    const empty = await $.ui.mount({ ...PANE, surface });
    expect(await empty.find({ type: "Text", text: /No project yet/ })).not.toBe(
      undefined,
    );
    await empty.unmount();
  }

  const drawn = await $.tool.run({
    tool: "mcp__uiid__set_graph",
    tool_use_id: "call-1",
    ...INPUT,
  });
  expect(drawn.result).toBe("Drawn in the pane: 7 tickets.");
  expect(toGraph(kept.get("graph"))?.title).toBe("Checkout rewrite");

  const missing = await $.tool.run({
    tool: "mcp__uiid__set_status",
    tool_use_id: "call-2",
    ticket: "UI-999",
    status: "building",
  });
  expect(missing.result).toMatch(/not in the graph/);

  await $.tool.run({
    tool: "mcp__uiid__set_status",
    tool_use_id: "call-3",
    ticket: "UI-438",
    status: "needs you",
    note: "two files outside the allowlist",
  });

  for (const surface of ["terminal", "desktop", "vscode", "mobile"] as const) {
    const ui = await $.ui.mount({ ...PANE, surface });

    expect(await ui.find({ type: "Text", text: /Checkout rewrite/ })).not.toBe(
      undefined,
    );
    expect(await ui.find({ type: "Text", text: /UI-438 needs you/ })).not.toBe(
      undefined,
    );
    expect(
      await ui.find({ type: "Text", text: /two files outside the allowlist/ }),
    ).not.toBe(undefined);
    await ui.unmount();
  }
});
