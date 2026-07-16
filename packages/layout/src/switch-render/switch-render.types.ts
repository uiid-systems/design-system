type BaseSwitchRenderProps = {
  /** Selects which branch element wraps the children */
  condition: boolean;
  /** Wrapper elements for the true and false branches */
  render: {
    true: React.ReactElement<unknown>;
    false: React.ReactElement<unknown>;
  };
  /** Content rendered inside the chosen branch */
  children?: React.ReactNode;
};

export type SwitchRenderProps = BaseSwitchRenderProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof BaseSwitchRenderProps>;
