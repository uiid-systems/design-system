export type ConditionalRenderProps = {
  /** When true, children are wrapped in the render element */
  condition: boolean;
  /** Wrapper element used when the condition is true */
  render: React.ReactElement<unknown>;
  /** Content rendered with or without the wrapper */
  children?: React.ReactNode;
};
