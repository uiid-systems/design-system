"use client";

import { useEffect } from "react";

import type { ReactNode } from "react";
import { JSONUIProvider } from "@json-render/react";

import { Stack } from "@uiid/layout";
import { ToastProvider, Toaster } from "@uiid/overlays";

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
  const syncTreeToHash = useChatStore((s) => s.syncTreeToHash);
  const tree = useChatStore((s) => s.tree);

  // Load from URL hash on mount
  useEffect(() => {
    loadFromUrlHash();
  }, [loadFromUrlHash]);

  // Keep URL hash in sync with tree state
  useEffect(() => {
    syncTreeToHash();
  }, [tree, syncTreeToHash]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      loadFromUrlHash();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loadFromUrlHash]);

  return (
    <ToastProvider>
      <JSONUIProvider
        registry={registry}
        handlers={{
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

          <Stack ax="stretch" fullwidth fullheight>
            <Header />
            {children}
          </Stack>
        </ChatOuterContainer>
      </JSONUIProvider>
      <Toaster />
    </ToastProvider>
  );
};
AppShell.displayName = "AppShell";
