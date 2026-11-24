import { atom, read, update } from "claude-code";
import type { Register } from "claude-code";

import type { Status } from "../types";
import type { Mark } from "./graph";
import {
  asPr,
  asStatus,
  asText,
  asTicketId,
  EMPTY,
  layOut,
  toGraph,
  withChange,
} from "./graph";

const PANE = "project-graph";
const PANE_TITLE = "Project graph";
const SET_GRAPH = "mcp__uiid__set_graph";
const SET_STATUS = "mcp__uiid__set_status";
// The last graph drawn, kept past the session so the pane can show it again.
const STORED = "graph";

const COLORS: { readonly [status in Status]: string } = {
  building: "warning",
  "in review": "success",
  "needs you": "error",
  // No theme key is purple, so this one is a raw colour.
  merged: "#a78bfa",
};

const STATUS_WORDS = ["merged", "building", "in review", "needs you"];

// The scan reads the atom's source, so the plugin's name is spelled out here.
const graph = atom({ plugin: "uiid", key: "graph" } as const, EMPTY, {
  shape: "graph-1",
});

const TICKET_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "Ticket id, such as UI-436" },
    status: {
      type: "string",
      enum: STATUS_WORDS,
      description: "Leave out for a ticket that only waits",
    },
    pr: { type: "integer", description: "Its pull request's number" },
    waitsOn: {
      type: "array",
      items: { type: "string" },
      description: "Ids of its open blockers, in this project or another",
    },
    note: {
      type: "string",
      description:
        "A few words of your own on why it cannot move, when the blockers do not show it. Never ticket text.",
    },
  },
  required: ["id"],
};

export const register: Register = (on) => {
  on("session.start", async ($, e, next) => {
    await $.command.register({
      name: "project-graph",
      description: "Show the project graph pane",
    });
    await $.tool.register({
      name: "set_graph",
      description:
        "Draws a Linear project's tickets as a dependency diagram in the project graph pane, replacing the one shown. Give the sections top to bottom and the tickets in each in the order to draw them, every ticket after the tickets it waits on. The pane draws the connectors, links and colours itself. Follow the uiid:graph-project skill for what goes in.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "The project's name" },
          updated: {
            type: "string",
            description: "When it was read, such as Nov 23, 8:50 PM",
          },
          linkBase: {
            type: "string",
            description:
              "https URL a ticket id is appended to, such as https://linear.app/acme/issue/",
          },
          prBase: {
            type: "string",
            description:
              "URL a pull request number is appended to, such as https://github.com/acme/app/pull/",
          },
          sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                isGate: {
                  type: "boolean",
                  description: "True for an `After the …` gate heading",
                },
                tickets: { type: "array", items: TICKET_SCHEMA },
              },
              required: ["heading", "tickets"],
            },
          },
        },
        required: ["title", "sections"],
      },
    });
    await $.tool.register({
      name: "set_status",
      description:
        "Changes one ticket in the project graph pane without drawing the graph again: its status, its pull request or its note. Give only what changed.",
      inputSchema: {
        type: "object",
        properties: {
          ticket: { type: "string", description: "Ticket id, such as UI-436" },
          status: { type: "string", enum: [...STATUS_WORDS, "waiting"] },
          pr: { type: "integer", description: "Its pull request's number" },
          note: {
            type: "string",
            description: "A few words of your own; empty to clear it",
          },
          updated: {
            type: "string",
            description: "The time now, such as Nov 23, 8:50 PM",
          },
        },
        required: ["ticket"],
      },
    });
    const now = await read($, graph);
    const stored = toGraph(await $.store.get(STORED));
    if (now.sections.length === 0 && stored !== undefined) {
      await update($, graph, () => stored);
    }

    return next(e);
  });

  on("command.run", { command: "project-graph" }, async ($) => {
    await $.ui.open({ id: PANE, title: PANE_TITLE });

    return { text: "Project graph pane opened." };
  });

  on("tool.run", { tool: SET_GRAPH }, async ($, e) => {
    const drawn = toGraph(e);
    if (drawn === undefined) {
      return {
        result:
          "Nothing drawn: `sections` needs at least one ticket with an id.",
      };
    }
    await update($, graph, () => drawn);
    await $.store.set(STORED, drawn);
    const { isPlaced } = await $.ui.open({ id: PANE, title: PANE_TITLE });
    const count = drawn.sections.flatMap((section) => section.tickets).length;

    return {
      result: isPlaced
        ? `Drawn in the pane: ${count} tickets.`
        : `Stored ${count} tickets, but the pane is not showing. Show the list in chat; the person can open the pane with /project-graph.`,
    };
  }).catch(() => ({ result: "The project graph could not be drawn." }));

  on("tool.run", { tool: SET_STATUS }, async ($, e) => {
    const input = e as Record<string, unknown>;
    const ticket = asTicketId(input.ticket);
    if (ticket === undefined) return { result: "Needs a ticket id." };
    const word = asText(input.status).toLowerCase();
    const status = word === "waiting" ? word : asStatus(word);
    const pr = asPr(input.pr);
    const updated = asText(input.updated);
    const changed = withChange(await read($, graph), ticket, {
      ...(status !== undefined && { status }),
      ...(pr !== undefined && { pr }),
      ...(typeof input.note === "string" && { note: asText(input.note) }),
      ...(updated !== "" && { updated }),
    });
    if (changed === undefined) {
      return {
        result: `${ticket} is not in the graph. Draw it again with set_graph.`,
      };
    }
    await update($, graph, () => changed);
    await $.store.set(STORED, changed);

    return { result: `${ticket} updated in the pane.` };
  }).catch(() => ({ result: "The ticket could not be updated." }));

  on("ui.render", { component: "Pane", requestId: PANE }, async ($, e) => {
    const { Box, Text, Link } = $.ui.resolve(e);
    const shown = await read($, graph);
    // Each rail takes the colour of its blocker's status; the rest stays dim.
    const rails = (marks: readonly Mark[]) =>
      marks.map((one) =>
        one.status === undefined ? (
          <Text dimColor>{one.text}</Text>
        ) : (
          <Text color={COLORS[one.status]}>{one.text}</Text>
        ),
      );

    if (shown.sections.length === 0) {
      return (
        <Box flexDirection="column">
          <Text dimColor>No project yet. Run /uiid:graph-project.</Text>
        </Box>
      );
    }

    return (
      <Box flexDirection="column">
        <Text bold wrap="truncate-end">
          {shown.title}
        </Text>
        {shown.updated !== "" && <Text dimColor>updated {shown.updated}</Text>}
        <Text> </Text>
        {layOut(shown, e.props.bodyColumns).map((row) => {
          if (row.kind === "gap") {
            return (
              <Text mono wrap="truncate-end">
                {row.marks.length === 0 ? " " : rails(row.marks)}
              </Text>
            );
          }
          if (row.kind === "heading") {
            return (
              <Text mono wrap="truncate-end">
                {rails(row.marks)}
                {row.isGate && <Text dimColor>══ </Text>}
                <Text bold>{row.text}</Text>
              </Text>
            );
          }
          if (row.kind === "note") {
            return (
              <Text mono>
                {rails(row.marks)}
                <Text dimColor>
                  {"  "}
                  {row.text}
                </Text>
              </Text>
            );
          }
          const { id, status, pr } = row.ticket;
          const color = status === undefined ? undefined : COLORS[status];
          const isLinked = shown.linkBase !== "";
          const name = (
            <Text
              bold={status !== undefined}
              color={color}
              dimColor={status === undefined}
              underline={isLinked}
            >
              {id}
            </Text>
          );

          return (
            <Text mono wrap="truncate-end">
              {rails(row.marks)}
              <Text color={color} dimColor={status === undefined}>
                {status === undefined ? "○" : "●"}
              </Text>{" "}
              {isLinked ? (
                <Link href={`${shown.linkBase}${id}`}>{name}</Link>
              ) : (
                name
              )}
              {status !== undefined && <Text color={color}> {status}</Text>}
              {pr !== undefined && " "}
              {pr !== undefined &&
                (shown.prBase === "" ? (
                  <Text>#{pr}</Text>
                ) : (
                  <Link href={`${shown.prBase}${pr}`}>
                    <Text underline>#{pr}</Text>
                  </Link>
                ))}
            </Text>
          );
        })}
        <Text> </Text>
        <Text mono dimColor>
          <Text color={COLORS.merged}>●</Text> merged
        </Text>
        <Text mono dimColor>
          <Text color={COLORS["in review"]}>●</Text> in review
        </Text>
        <Text mono dimColor>
          <Text color={COLORS.building}>●</Text> building
        </Text>
        <Text mono dimColor>
          <Text color={COLORS["needs you"]}>●</Text> needs you
        </Text>
        <Text mono dimColor>
          ○ waiting
        </Text>
      </Box>
    );
  });
};
