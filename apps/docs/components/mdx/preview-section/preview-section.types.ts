import type { StackProps } from "@uiid/layout";
import type { PreviewConfig } from "@uiid/registry";

export type PreviewSectionWrapperProps = StackProps;

export type PreviewSectionCodeBlockProps = {
  code: string;
  prerenderedHtml?: string;
};

export type PreviewSectionProps = {
  preview: PreviewConfig;
  showLabel?: boolean;
} & PreviewSectionCodeBlockProps;
