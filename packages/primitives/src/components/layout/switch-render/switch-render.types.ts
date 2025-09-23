export type SwitchRenderProps = React.PropsWithChildren<{
  condition: boolean;
  wrappers: {
    true: React.ReactElement<unknown>;
    false: React.ReactElement<unknown>;
  };
}>;
