import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const TEXT_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const TEXT_PROPERTIES = ["size","weight","leading","lineHeight"];

const meta = {
  title: "Tokens/Typography",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: ({}) => {
    const [computedValues, setComputedValues] = React.useState<
      Record<string, Record<string, string>>
    >({});

    React.useEffect(() => {
      // Wait for CSS to be loaded, then compute values
      const computeValues = () => {
        const root = document.documentElement;
        const values: Record<string, Record<string, string>> = {};

        TEXT_LEVELS.forEach((level) => {
          values[level] = {
            size: getComputedStyle(root)
              .getPropertyValue(`--text_${level}_size`)
              .trim(),
            weight: getComputedStyle(root)
              .getPropertyValue(`--text_${level}_weight`)
              .trim(),
            leading: getComputedStyle(root)
              .getPropertyValue(`--text_${level}_leading`)
              .trim(),
            lineHeight: getComputedStyle(root)
              .getPropertyValue(`--text_${level}_line_height`)
              .trim(),
          };
        });

        setComputedValues(values);
      };

      // Try immediately, then with a small delay as fallback
      computeValues();
      const timeout = setTimeout(computeValues, 200);

      return () => clearTimeout(timeout);
    }, []);

    return (
      <>
        <GridHeader />
        <Grid>
          {TEXT_LEVELS.map((level) => {
            const values = computedValues[level] || {};

            return (
              <React.Fragment key={level}>
                <div>{level}:</div>
                <Value value={values.size || " "} />
                <Value value={values.weight || " "} />
                <Value value={values.leading || " "} />
                <Value value={values.lineHeight || " "} />
              </React.Fragment>
            );
          })}
        </Grid>
      </>
    );
  },
};

const Grid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `2rem repeat(${TEXT_PROPERTIES.length}, 1fr)`,
        gap: 4,
        alignItems: "center",
        paddingBlockEnd: 8,
      }}
    >
      {children}
    </div>
  );
};

const GridHeader = () => {
  return (
    <Grid>
      <div></div>
      {TEXT_PROPERTIES.map((property) => (
        <div key={property}>{property}</div>
      ))}
    </Grid>
  );
};

const Value = ({ value }: { value: string }) => {
  return (
    <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#666" }}>
      {value}
    </div>
  );
};
