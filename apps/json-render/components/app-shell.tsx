"use client";

import { useEffect } from "react";

import type { ReactNode } from "react";
import { JSONUIProvider } from "@json-render/react";
import { Stack } from "@uiid/layout";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";

import { ChatOuterContainer } from "./chat-outer-container";
import { ChatSidebar } from "./chat-sidebar";
import { Header } from "./header";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const loadFromUrlHash = useChatStore((s) => s.loadFromUrlHash);

  // Load from URL hash on mount
  useEffect(() => {
    loadFromUrlHash();
  }, [loadFromUrlHash]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Load tree from hash without clearing it (for history navigation)
      loadFromUrlHash(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loadFromUrlHash]);

  return (
    <JSONUIProvider
      registry={registry}
      actionHandlers={{
        submit: async () => {
          alert("Submit action triggered!");
        },
        reset: async () => {
          alert("Reset action triggered!");
        },
        navigate: async () => {
          alert("Navigate action triggered!");
        },
      }}
    >
      <ChatOuterContainer style={{ overflow: "hidden" }}>
        <ChatSidebar />
        <Stack ax="stretch" fullwidth>
          <Header />
          {children}
        </Stack>
      </ChatOuterContainer>
    </JSONUIProvider>
  );
};
AppShell.displayName = "AppShell";
