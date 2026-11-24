import type { Graph, Section, Status, Ticket } from "../types";

const TICKET = /^[A-Z][A-Z0-9]*-\d+$/;
const LINK_BASE = /^https:\/\/linear\.app\/[\w-]+\/issue\/$/;
const PR_BASE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/$/;
const STATUSES: readonly Status[] = [
  "merged",
  "building",
  "in review",
  "needs you",
];
const MAX_TICKETS = 200;
const MAX_TEXT = 120;

export const EMPTY: Graph = {
  title: "",
  updated: "",
  linkBase: "",
  prBase: "",
  sections: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** One line of plain text: no control characters, trimmed and cut short. */
export const asText = (value: unknown): string =>
  typeof value === "string"
    ? [...value]
        .map((char) => (char < " " || char === "\u007f" ? " " : char))
        .join("")
        .trim()
        .slice(0, MAX_TEXT)
    : "";

export const asTicketId = (value: unknown): string | undefined => {
  const id = asText(value).toUpperCase();

  return TICKET.test(id) ? id : undefined;
};

export const asStatus = (value: unknown): Status | undefined => {
  const word = asText(value).toLowerCase();

  return STATUSES.find((status) => status === word);
};

export const asPr = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : undefined;

const asTicket = (value: unknown): Ticket | undefined => {
  if (!isRecord(value)) return undefined;
  const id = asTicketId(value.id);
  if (id === undefined) return undefined;
  const blockers = Array.isArray(value.waitsOn) ? value.waitsOn : [];
  const waitsOn = blockers
    .map(asTicketId)
    .filter((one): one is string => one !== undefined && one !== id);
  const status = asStatus(value.status);
  const pr = asPr(value.pr);
  const note = asText(value.note);

  return {
    id,
    waitsOn: [...new Set(waitsOn)],
    ...(status !== undefined && { status }),
    ...(pr !== undefined && { pr }),
    ...(note !== "" && { note }),
  };
};

/**
 * Reads a graph from a tool's input or from the store, keeping only what the
 * pane can draw. It reads its own output back unchanged. Undefined when no
 * ticket is left.
 */
export const toGraph = (input: unknown): Graph | undefined => {
  if (!isRecord(input) || !Array.isArray(input.sections)) return undefined;
  const seen = new Set<string>();
  const sections: Section[] = [];
  for (const raw of input.sections) {
    if (!isRecord(raw) || !Array.isArray(raw.tickets)) continue;
    const tickets: Ticket[] = [];
    for (const one of raw.tickets) {
      const ticket = asTicket(one);
      if (ticket === undefined || seen.has(ticket.id)) continue;
      if (seen.size >= MAX_TICKETS) break;
      seen.add(ticket.id);
      tickets.push(ticket);
    }
    if (tickets.length > 0) {
      sections.push({
        heading: asText(raw.heading) || "Tickets",
        isGate: raw.isGate === true,
        tickets,
      });
    }
  }
  if (sections.length === 0) return undefined;
  const linkBase = asText(input.linkBase);
  const prBase = asText(input.prBase);

  return {
    title: asText(input.title),
    updated: asText(input.updated),
    linkBase: LINK_BASE.test(linkBase) ? linkBase : "",
    prBase: PR_BASE.test(prBase) ? prBase : "",
    sections,
  };
};

export type Change = {
  /** `waiting` takes the status word away. */
  readonly status?: Status | "waiting";
  readonly pr?: number;
  /** An empty note takes the note away. */
  readonly note?: string;
  readonly updated?: string;
};

/** The graph with one ticket changed, or undefined when it has no such row. */
export const withChange = (
  graph: Graph,
  id: string,
  change: Change,
): Graph | undefined => {
  if (
    !graph.sections.some((section) => section.tickets.some((t) => t.id === id))
  )
    return undefined;
  const apply = (ticket: Ticket): Ticket => {
    if (ticket.id !== id) return ticket;
    const status =
      change.status === undefined
        ? ticket.status
        : change.status === "waiting"
          ? undefined
          : change.status;
    const pr = change.pr ?? ticket.pr;
    const note = change.note ?? ticket.note ?? "";

    return {
      id,
      waitsOn: ticket.waitsOn,
      ...(status !== undefined && { status }),
      ...(pr !== undefined && { pr }),
      ...(note !== "" && { note }),
    };
  };

  return {
    ...graph,
    updated: change.updated || graph.updated,
    sections: graph.sections.map((section) => ({
      ...section,
      tickets: section.tickets.map(apply),
    })),
  };
};

/** A run of the gutter, in the colour of the blocker whose rail it draws. */
export type Mark = { readonly text: string; readonly status?: Status };

type Drawn = { readonly gutter: string; readonly marks: readonly Mark[] };

export type Row = Drawn &
  (
    | { readonly kind: "gap" }
    | {
        readonly kind: "heading";
        readonly text: string;
        readonly isGate: boolean;
      }
    | { readonly kind: "ticket"; readonly ticket: Ticket }
    | { readonly kind: "note"; readonly text: string }
  );

type Slot =
  | { kind: "gap" }
  | { kind: "heading"; text: string; isGate: boolean }
  | { kind: "ticket"; ticket: Ticket }
  | { kind: "note"; text: string };

/** One blocker's line down the gutter, from its first joined row to its last. */
type Rail = {
  column: number;
  first: number;
  last: number;
  joins: Set<number>;
  status?: Status;
};

// A joined cell always runs right, to its ticket. The key says where else it
// runs: up, down and left.
const JOINS: { readonly [key: string]: string } = {
  udl: "┼",
  ud: "├",
  ul: "┴",
  u: "╰",
  dl: "┬",
  d: "╭",
  l: "─",
  "": "─",
};

const wrap = (text: string, width: number): string[] => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ").filter(Boolean)) {
    if (line !== "" && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line === "" ? word : `${line} ${word}`;
    }
  }

  return line === "" ? lines : [...lines, line];
};

const numberOf = (id: string): number => Number(id.split("-").pop());

/**
 * Lays the graph out as rows. Each ticket is a row, and each blocker gets a
 * rail in the gutter that runs from its own row down to the last ticket waiting
 * on it, joining every waiting ticket on the way. A rail crossed by another
 * ticket's join keeps its `│`, so `┼` is always a join.
 */
export const layOut = (graph: Graph, columns: number): Row[] => {
  const tickets = graph.sections.flatMap((section) => section.tickets);
  const indexOf = new Map(tickets.map((ticket, index) => [ticket.id, index]));
  const dependents = new Map<string, string[]>();
  for (const ticket of tickets) {
    for (const blocker of ticket.waitsOn) {
      if (!indexOf.has(blocker)) continue;
      dependents.set(blocker, [...(dependents.get(blocker) ?? []), ticket.id]);
    }
  }

  const behind = (id: string, seen = new Set<string>()): number => {
    for (const next of dependents.get(id) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      behind(next, seen);
    }

    return seen.size;
  };
  let busiest: { id: string; count: number } | undefined;
  for (const id of dependents.keys()) {
    const count = behind(id);
    if (count < 2) continue;
    const isAhead =
      busiest === undefined ||
      count > busiest.count ||
      (count === busiest.count && numberOf(id) < numberOf(busiest.id));
    if (isAhead) busiest = { id, count };
  }

  // Rails take their columns by ticket order. Rows added between tickets later
  // (headings, notes) cannot make two rails overlap that did not already.
  const rails: Rail[] = [];
  for (const [blocker, ids] of dependents) {
    const joins = [blocker, ...ids].map((id) => indexOf.get(id) ?? 0);
    rails.push({
      column: 0,
      first: Math.min(...joins),
      last: Math.max(...joins),
      joins: new Set(joins),
      status: tickets[indexOf.get(blocker) ?? 0]?.status,
    });
  }
  rails.sort((a, b) => a.first - b.first || b.last - a.last);
  const ends: number[] = [];
  for (const rail of rails) {
    const free = ends.findIndex((end) => end < rail.first);
    rail.column = free === -1 ? ends.length : free;
    ends[rail.column] = rail.last;
  }
  const width = Math.max(16, columns - ends.length * 2 - 2);

  const slots: Slot[] = [];
  const rowOf: number[] = [];
  for (const section of graph.sections) {
    if (slots.length > 0) slots.push({ kind: "gap" });
    slots.push({
      kind: "heading",
      text: section.heading,
      isGate: section.isGate,
    });
    if (section.isGate) slots.push({ kind: "gap" });
    for (const ticket of section.tickets) {
      rowOf.push(slots.length);
      slots.push({ kind: "ticket", ticket });
      const outside = ticket.waitsOn.filter((id) => !indexOf.has(id));
      const notes = [
        outside.length > 0 ? `waits on ${outside.join(", ")}` : "",
        ticket.note ?? "",
        busiest?.id === ticket.id
          ? `${busiest.count} tickets wait on this`
          : "",
      ];
      for (const note of notes) {
        for (const text of wrap(note, width))
          slots.push({ kind: "note", text });
      }
    }
  }
  for (const rail of rails) {
    rail.first = rowOf[rail.first] ?? 0;
    rail.last = rowOf[rail.last] ?? 0;
    rail.joins = new Set([...rail.joins].map((index) => rowOf[index] ?? 0));
  }

  return slots.map((slot, row) => {
    const cells = ends.map((_, column) =>
      rails.find(
        (rail) =>
          rail.column === column && rail.first <= row && row <= rail.last,
      ),
    );
    const from = cells.findIndex((rail) => rail?.joins.has(row));
    const isGate = slot.kind === "heading" && slot.isGate;
    const marks: Mark[] = [];
    const mark = (text: string, status?: Status) => {
      const last = marks.at(-1);
      if (last !== undefined && last.status === status) {
        marks[marks.length - 1] = { ...last, text: last.text + text };
      } else {
        marks.push(status === undefined ? { text } : { text, status });
      }
    };
    cells.forEach((rail, column) => {
      if (isGate) {
        if (rail === undefined) return mark("══");
        mark("╪", rail.status);

        return mark("═");
      }
      const hasLeft = from !== -1 && column > from;
      const hasRight = from !== -1 && column >= from;
      const key =
        (rail !== undefined && row > rail.first ? "u" : "") +
        (rail !== undefined && row < rail.last ? "d" : "") +
        (hasLeft ? "l" : "");
      const glyph = rail?.joins.has(row)
        ? (JOINS[key] ?? "─")
        : rail !== undefined
          ? "│"
          : hasLeft
            ? "─"
            : " ";
      mark(glyph, rail?.status);
      mark(hasRight ? "─" : " ");
    });
    const gutter = marks.map((one) => one.text).join("");

    return { ...slot, gutter, marks };
  });
};
