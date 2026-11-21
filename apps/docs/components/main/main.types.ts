import type { CardProps, GroupProps, StackProps } from "@uiid/design-system";

export type MainRootProps = GroupProps;
export type MainContentProps = CardProps;
export type MainAsideProps = StackProps;

export type MainProps = MainRootProps & {
  /** Sits beside the page, in the same scroll track. */
  aside?: React.ReactNode;
};
