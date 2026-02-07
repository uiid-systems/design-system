import type { PreviewConfig } from "../../types";

export const statusPreviews: PreviewConfig[] = [
  {
    label: "With label",
    tree: {
      root: "statuses",
      elements: {
        statuses: {
          key: "statuses",
          type: "Stack",
          props: { gap: 3 },
          children: ["online", "away", "busy", "offline"],
        },
        online: {
          key: "online",
          type: "Status",
          props: { tone: "positive", children: "Online" },
          parentKey: "statuses",
        },
        away: {
          key: "away",
          type: "Status",
          props: { tone: "warning", children: "Away" },
          parentKey: "statuses",
        },
        busy: {
          key: "busy",
          type: "Status",
          props: { tone: "critical", children: "Do not disturb" },
          parentKey: "statuses",
        },
        offline: {
          key: "offline",
          type: "Status",
          props: { children: "Offline" },
          parentKey: "statuses",
        },
      },
    },
  },
  {
    label: "Dot only",
    tree: {
      root: "statuses",
      elements: {
        statuses: {
          key: "statuses",
          type: "Group",
          props: { gap: 3 },
          children: ["positive", "warning", "critical", "default"],
        },
        positive: {
          key: "positive",
          type: "Status",
          props: { tone: "positive" },
          parentKey: "statuses",
        },
        warning: {
          key: "warning",
          type: "Status",
          props: { tone: "warning" },
          parentKey: "statuses",
        },
        critical: {
          key: "critical",
          type: "Status",
          props: { tone: "critical" },
          parentKey: "statuses",
        },
        default: {
          key: "default",
          type: "Status",
          props: {},
          parentKey: "statuses",
        },
      },
    },
  },
  {
    label: "Pulse",
    tree: {
      root: "statuses",
      elements: {
        statuses: {
          key: "statuses",
          type: "Stack",
          props: { gap: 3 },
          children: ["live", "recording", "connecting"],
        },
        live: {
          key: "live",
          type: "Status",
          props: { tone: "critical", pulse: true, children: "Live" },
          parentKey: "statuses",
        },
        recording: {
          key: "recording",
          type: "Status",
          props: { tone: "positive", pulse: true, children: "Recording" },
          parentKey: "statuses",
        },
        connecting: {
          key: "connecting",
          type: "Status",
          props: { tone: "warning", pulse: true, children: "Connecting..." },
          parentKey: "statuses",
        },
      },
    },
  },
];
