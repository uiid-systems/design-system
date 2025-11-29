type BaseSwitchRenderProps = {
  condition: boolean;
  render: {
    true: React.ReactElement<unknown>;
    false: React.ReactElement<unknown>;
  };
  children?: React.ReactNode;
};

export type SwitchRenderProps = BaseSwitchRenderProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof BaseSwitchRenderProps>;
