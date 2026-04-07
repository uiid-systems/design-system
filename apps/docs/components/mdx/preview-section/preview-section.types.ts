import type { CardProps } from "@uiid/cards";
import type { PreviewConfig } from "@uiid/registry";

export type PreviewSectionWrapperProps = CardProps;

export type PreviewSectionCodeBlockProps = {
  code: string;
  prerenderedHtml?: string;
};

export type PreviewSectionProps = {
  preview: PreviewConfig;
  showLabel?: boolean;
} & PreviewSectionCodeBlockProps;
