export type SwitchRenderProps = React.PropsWithChildren<{
  condition: boolean;
  render: {
    true: React.ReactElement<unknown>;
    false: React.ReactElement<unknown>;
  };
}>;
