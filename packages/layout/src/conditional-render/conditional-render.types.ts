export type ConditionalRenderProps = {
  condition: boolean;
  render: React.ReactElement<unknown>;
  children?: React.ReactNode;
};
