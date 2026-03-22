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
          children: ["online", "away", "offline"],
        },
        online: {
          key: "online",
          type: "Status",
          props: { children: "Online" },
          parentKey: "statuses",
        },
        away: {
          key: "away",
          type: "Status",
          props: { children: "Away" },
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
          children: ["active", "default"],
        },
        active: {
          key: "active",
          type: "Status",
          props: { pulse: true },
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
          props: { pulse: true, children: "Live" },
          parentKey: "statuses",
        },
        recording: {
          key: "recording",
          type: "Status",
          props: { pulse: true, children: "Recording" },
          parentKey: "statuses",
        },
        connecting: {
          key: "connecting",
          type: "Status",
          props: { pulse: true, children: "Connecting..." },
          parentKey: "statuses",
        },
      },
    },
  },
];
