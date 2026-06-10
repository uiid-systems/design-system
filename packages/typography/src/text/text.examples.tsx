import { Text } from "./text";
import type { TextProps } from "./text.types";

const SAMPLE =
  "The quick brown fox jumps over the lazy dog — 1234567890";

type Size = NonNullable<TextProps["size"]>;
type Weight = NonNullable<TextProps["weight"]>;
type Family = NonNullable<TextProps["family"]>;
type Shade = NonNullable<TextProps["shade"]>;
type Color = NonNullable<TextProps["color"]>;

const SIZES: Size[] = [-1, 0, 1, 2, 3, 4, 5, 6];
const WEIGHTS: Weight[] = [
  "thin",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
];
const FAMILIES: Family[] = ["sans", "serif", "mono"];
const SHADES: Shade[] = [
  "background",
  "surface",
  "accent",
  "halftone",
  "muted",
  "foreground",
];
const COLORS: Color[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "neutral",
];

const ROW_GAP = 24;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP }}>
    {children}
  </div>
);

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "120px 1fr",
      alignItems: "baseline",
      gap: 24,
    }}
  >
    <Text size={-1} family="mono" shade="muted">
      {label}
    </Text>
    <div>{children}</div>
  </div>
);

export const Scale = () => (
  <Stack>
    {SIZES.map((size) => (
      <Row key={size} label={`size ${size}`}>
        <Text size={size}>{SAMPLE}</Text>
      </Row>
    ))}
  </Stack>
);

export const Weights = () => (
  <Stack>
    {WEIGHTS.map((weight) => (
      <Row key={weight} label={weight}>
        <Text size={2} weight={weight}>
          {SAMPLE}
        </Text>
      </Row>
    ))}
  </Stack>
);

export const Families = () => (
  <Stack>
    {FAMILIES.map((family) => (
      <Row key={family} label={family}>
        <Text size={2} family={family}>
          {SAMPLE}
        </Text>
      </Row>
    ))}
  </Stack>
);

export const Shades = () => (
  <Stack>
    {SHADES.map((shade) => (
      <Row key={shade} label={shade}>
        <Text size={1} shade={shade}>
          {SAMPLE}
        </Text>
      </Row>
    ))}
  </Stack>
);

export const Colors = () => (
  <Stack>
    {COLORS.map((color) => (
      <Row key={color} label={color}>
        <Text size={1} color={color}>
          {SAMPLE}
        </Text>
      </Row>
    ))}
  </Stack>
);

export const Truncate = () => (
  <div style={{ maxWidth: 280 }}>
    <Text size={1} truncate>
      This long line of text will be truncated with an ellipsis when it exceeds
      the container width
    </Text>
  </div>
);

export const Balance = () => (
  <div style={{ maxWidth: 360 }}>
    <Text size={4} balance>
      Headings benefit from balanced wrapping when their length sits between
      lines
    </Text>
  </div>
);

export const InlineCode = () => (
  <Text size={1}>
    Render inline <code>code</code> inside a Text element for a subtle
    monospace chip that picks up the surrounding scale.
  </Text>
);

export const Polymorphic = () => (
  <Text render={<h2 />} size={5} weight="bold">
    Rendered as &lt;h2&gt; via the render prop
  </Text>
);
