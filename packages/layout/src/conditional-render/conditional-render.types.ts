export type ConditionalRenderProps = {
  condition: boolean;
  wrapper: React.ReactElement<unknown>;
  children?: React.ReactNode;
};
