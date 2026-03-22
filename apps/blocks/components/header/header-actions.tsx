"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@uiid/buttons";
import {
  ScanSearchIcon,
  CopyIcon,
  SquareCheckIcon,
  PackageIcon,
  SettingsIcon,
} from "@uiid/icons";
import { Group, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";
import { StatsSheet } from "../stats-sheet";
import { ThemeToggle } from "./theme-toggle";

export const HeaderActions = () => {
  const tree = useChatStore((s) => s.tree);
  const getShareUrl = useChatStore((s) => s.getShareUrl);
  const toggleInspecting = useChatStore((s) => s.toggleInspecting);

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Group data-slot="header-actions" gap={2} ay="center">
      {/* Block tools — only visible when a block is loaded */}
      {tree && (
        <>
          <Group gap={1}>
            <StatsSheet />
            <Button
              tooltip="Inspect elements — hover to see component info"
              onClick={toggleInspecting}
              size="small"
              variant="ghost"

            >
              <ScanSearchIcon />
              Inspect
            </Button>
          </Group>

          <Separator orientation="vertical" />

          <Group gap={1}>
            <Button
              tooltip={copied ? "Copied!" : "Copy shareable link"}
              onClick={handleShare}
              disabled={copied}
              size="small"
              variant="ghost"
            >
              {copied ? <SquareCheckIcon /> : <CopyIcon />}
              <Text size={-1}>{copied ? "Copied" : "Share"}</Text>
            </Button>
          </Group>

          <Separator orientation="vertical" />
        </>
      )}

      {/* Navigation — always visible */}
      <Group gap={1}>
        <ThemeToggle />
        <Button
          render={<Link href="/registry" />}
          tooltip="Browse block registry"
          size="small"
          variant="ghost"
        >
          <PackageIcon />
          Registry
        </Button>
        <Button
          render={<Link href="/settings" />}
          tooltip="Configure block sources"
          size="small"
          variant="ghost"
        >
          <SettingsIcon />
        </Button>
      </Group>
    </Group>
  );
};
HeaderActions.displayName = "HeaderActions";
