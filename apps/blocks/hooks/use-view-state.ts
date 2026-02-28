"use client";

import { useQueryStates, parseAsStringLiteral } from "nuqs";

const views = ["component", "code"] as const;
const tabs = ["json", "jsx"] as const;

export type View = (typeof views)[number];
export type Tab = (typeof tabs)[number];

export function useViewState() {
  const [params, setParams] = useQueryStates(
    {
      view: parseAsStringLiteral(views).withDefault("component"),
      tab: parseAsStringLiteral(tabs).withDefault("json"),
    },
    {
      history: "push",
      shallow: true,
    }
  );

  const { view, tab } = params;

  const setView = (value: View) => setParams({ view: value });
  const setTab = (value: Tab) => setParams({ tab: value });

  return {
    view,
    tab,
    setView,
    setTab,
    isCodeView: view === "code",
  };
}
