export type Status = "merged" | "building" | "in review" | "needs you";

export type Ticket = {
  readonly id: string;
  /** Absent while the ticket only waits. */
  readonly status?: Status;
  /** Its pull request's number. */
  readonly pr?: number;
  /** Ids of its blockers: open ones, with or without a row, and merged ones with a row. */
  readonly waitsOn: readonly string[];
  /** Why it cannot move, when the diagram does not already show it. */
  readonly note?: string;
};

export type Section = {
  readonly heading: string;
  /** Drawn as a rule across the rails: the tickets under it wait on a gate. */
  readonly isGate: boolean;
  readonly tickets: readonly Ticket[];
};

export type Graph = {
  readonly title: string;
  readonly updated: string;
  /** A ticket id is appended to this for its link; empty for no links. */
  readonly linkBase: string;
  /** A pull request number is appended to this for its link. */
  readonly prBase: string;
  readonly sections: readonly Section[];
};

declare module "claude-code" {
  interface PluginState {
    uiid: { graph: Shaped<Graph> };
  }
}
