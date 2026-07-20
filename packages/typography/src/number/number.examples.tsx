import { Number } from "./number";

export const Basic = () => <Number value={1234} size={4} weight="bold" />;

export const Currency = () => (
  <Number
    value={199.99}
    format={{ style: "currency", currency: "USD" }}
    size={4}
    weight="semibold"
    color="green"
  />
);

export const Percent = () => (
  <Number
    value={0.244}
    format={{ style: "percent", maximumFractionDigits: 1 }}
    size={4}
    weight="bold"
  />
);

export const Compact = () => (
  <Number
    value={1_234_567}
    format={{ notation: "compact" }}
    size={4}
    family="mono"
  />
);
