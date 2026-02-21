"use client";

import { useEffect } from "react";

import type { ReactNode } from "react";
import { JSONUIProvider } from "@json-render/react";

import { Stack } from "@uiid/layout";
import { ToastProvider, Toaster } from "@uiid/overlays";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";

import { ChatPanel } from "./chat-panel";
import { Header } from "./header";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const loadFromUrlHash = useChatStore((s) => s.loadFromUrlHash);
  const syncTreeToHash = useChatStore((s) => s.syncTreeToHash);
  const tree = useChatStore((s) => s.tree);
  const activeRegistryBlock = useChatStore((s) => s.activeRegistryBlock);

  // Load from URL hash on mount (only for non-registry routes)
  useEffect(() => {
    if (!activeRegistryBlock) loadFromUrlHash();
  }, [loadFromUrlHash, activeRegistryBlock]);

  // Keep URL hash in sync with tree state (skipped for registry blocks)
  useEffect(() => {
    if (!activeRegistryBlock) syncTreeToHash();
  }, [tree, syncTreeToHash, activeRegistryBlock]);

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
        <Stack
          data-slot="app-shell"
          fullscreen
          ax="stretch"
          style={{ overflow: "hidden" }}
        >
          {tree && <Header />}
          {children}
        </Stack>
        {tree && <ChatPanel />}
      </JSONUIProvider>
      <Toaster />
    </ToastProvider>
  );
};
AppShell.displayName = "AppShell";
