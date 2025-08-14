import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const COLOR_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "neutral",
];

const meta = {
  title: "Tokens/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: ({}) => {
    return (
      <>
        <GridHeader />
        <Grid>
          {COLORS.map((color) => {
            return (
              <React.Fragment key={color}>
                <div>{color}</div>
                {COLOR_SCALE.map((shade) => (
                  <div
                    key={shade}
                    style={{
                      backgroundColor: `var(--${color}-${shade})`,
                      height: 32,
                    }}
                  />
                ))}
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
        gridTemplateColumns: `repeat(${COLOR_SCALE.length + 1}, 1fr)`,
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
      <div />
      {COLOR_SCALE.map((shade) => (
        <div key={shade} style={{ textAlign: "center" }}>
          {shade}
        </div>
      ))}
    </Grid>
  );
};
