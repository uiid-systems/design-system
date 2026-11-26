"use client";

import { Text } from "@uiid/typography";
import * as React from "react";

type CodePreviewBoundaryProps = {
  children?: React.ReactNode;
};

type CodePreviewBoundaryState = {
  failed: boolean;
};

/**
 * Catches an example that throws while rendering, so the frame, the bar and
 * the code around it still render. Internal: CodePreview keys it with the
 * reset count, so a reset remounts it with the error cleared and the example
 * gets a fresh try.
 *
 * The message is a fixed sentence. A thrown value can be anything, its text
 * is written for developers, and React already reports the full error to the
 * console in development.
 */
export class CodePreviewBoundary extends React.Component<
  CodePreviewBoundaryProps,
  CodePreviewBoundaryState
> {
  static displayName = "CodePreviewBoundary";

  override state: CodePreviewBoundaryState = { failed: false };

  static getDerivedStateFromError(): CodePreviewBoundaryState {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) {
      return (
        <Text data-slot="code-preview-error" emphasis="muted" size={-1}>
          This example failed to render.
        </Text>
      );
    }
    return this.props.children;
  }
}
