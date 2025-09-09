#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIMITIVES_DIR = join(__dirname, "../packages/tokens/src/primitives");
const COMPONENTS_DIR = join(__dirname, "../packages/tokens/src/components");
const STORIES_DIR = join(__dirname, "../packages/tokens/src/stories");

/**
 * Generate typography story from tokens
 * @param {Object} typography - Typography tokens
 * @returns {string} - TypeScript story content
 */
function generateTypographyStory(typography) {
  const textLevels = Object.keys(typography.text || {});
  const textProperties = ["size", "weight", "leading", "lineHeight"];

  return `import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const TEXT_LEVELS = [${textLevels.join(", ")}];
const TEXT_PROPERTIES = ${JSON.stringify(textProperties)};

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
              .getPropertyValue(\`--text_\${level}_size\`)
              .trim(),
            weight: getComputedStyle(root)
              .getPropertyValue(\`--text_\${level}_weight\`)
              .trim(),
            leading: getComputedStyle(root)
              .getPropertyValue(\`--text_\${level}_leading\`)
              .trim(),
            lineHeight: getComputedStyle(root)
              .getPropertyValue(\`--text_\${level}_line_height\`)
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
        gridTemplateColumns: \`2rem repeat(\${TEXT_PROPERTIES.length}, 1fr)\`,
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
`;
}

/**
 * Generate colors story from tokens
 * @param {Object} colors - Color tokens
 * @returns {string} - TypeScript story content
 */
function generateColorsStory(colors) {
  const colorGroups = Object.keys(colors).filter((key) => !key.startsWith("$"));

  // Generate static color data from tokens
  const colorData = {};
  colorGroups.forEach((group) => {
    colorData[group] = {};
    Object.entries(colors[group]).forEach(([shade, token]) => {
      if (token.$value) {
        colorData[group][shade] = token.$value;
      }
    });
  });

  return `import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const COLOR_DATA = ${JSON.stringify(colorData, null, 2)};

const meta = {
  title: "Tokens/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: ({}) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {Object.entries(COLOR_DATA).map(([group, shades]) => {
          const sortedShades = Object.entries(shades).sort(([a], [b]) => Number(a) - Number(b));

          return (
            <div key={group}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: 600, 
                marginBottom: "1rem",
                textTransform: "capitalize"
              }}>
                {group}
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "0.5rem"
              }}>
                {sortedShades.map(([shade, value]) => (
                  <ColorSwatch
                    key={shade}
                    name={\`\${group}-\${shade}\`}
                    value={value}
                    shade={shade}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

const ColorSwatch = ({ 
  name, 
  value, 
  shade 
}: { 
  name: string; 
  value: string; 
  shade: string;
}) => {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "white"
    }}>
      <div
        style={{
          backgroundColor: value,
          height: "80px",
          width: "100%"
        }}
      />
      <div style={{
        padding: "0.5rem",
        fontSize: "0.875rem"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
          {shade}
        </div>
        <div style={{ color: "#666", fontSize: "0.75rem" }}>
          {value}
        </div>
        <div style={{ color: "#999", fontSize: "0.75rem" }}>
          --{name}
        </div>
      </div>
    </div>
  );
};
`;
}

/**
 * Generate spacing story from tokens
 * @param {Object} spacing - Spacing tokens
 * @returns {string} - TypeScript story content
 */
function generateSpacingStory(spacing) {
  const spacingKeys = Object.keys(spacing).filter(
    (key) => !key.startsWith("$"),
  );

  return `import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const SPACING_TOKENS = ${JSON.stringify(spacingKeys)};

const meta = {
  title: "Tokens/Spacing",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: ({}) => {
    const [computedValues, setComputedValues] = React.useState<
      Record<string, string>
    >({});

    React.useEffect(() => {
      const computeValues = () => {
        const root = document.documentElement;
        const values: Record<string, string> = {};

        SPACING_TOKENS.forEach((token) => {
          const cssVar = token === 'scaleInline' ? 'scaleInline' : 
                        token === 'scaleBlock' ? 'scaleBlock' : token;
          values[token] = getComputedStyle(root)
            .getPropertyValue(\`--\${cssVar}\`)
            .trim();
        });

        setComputedValues(values);
      };

      computeValues();
      const timeout = setTimeout(computeValues, 200);

      return () => clearTimeout(timeout);
    }, []);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
          Spacing Tokens
        </h2>
        {SPACING_TOKENS.map((token) => {
          const value = computedValues[token] || '';
          const cssVar = token === 'scaleInline' ? 'scaleInline' : 
                        token === 'scaleBlock' ? 'scaleBlock' : token;

          return (
            <div key={token} style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #e0e0e0",
              borderRadius: "8px"
            }}>
              <div style={{ minWidth: "120px" }}>
                <div style={{ fontWeight: 600 }}>{token}</div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  --{cssVar}
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#999" }}>
                {value}
              </div>
              <div
                style={{
                  backgroundColor: "#2196f3",
                  height: "20px",
                  width: value,
                  minWidth: "2px"
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
};
`;
}

/**
 * Main function to generate all stories
 */
async function generateStories() {
  try {
    console.log("📚 Generating Storybook stories...");

    // Ensure stories directory exists
    await mkdir(STORIES_DIR, { recursive: true });

    // Read individual token files
    const colorsContent = await readFile(
      join(PRIMITIVES_DIR, "colors.json"),
      "utf-8",
    );
    const colors = JSON.parse(colorsContent);

    const typographyContent = await readFile(
      join(PRIMITIVES_DIR, "typography.json"),
      "utf-8",
    );
    const typography = JSON.parse(typographyContent);

    const spacingContent = await readFile(
      join(PRIMITIVES_DIR, "spacing.json"),
      "utf-8",
    );
    const spacing = JSON.parse(spacingContent);

    // Generate typography story
    if (typography.typography) {
      console.log("📝 Generating typography story...");
      const typographyStory = generateTypographyStory(typography.typography);
      await writeFile(
        join(STORIES_DIR, "typography.stories.tsx"),
        typographyStory,
      );
      console.log("   ✅ Generated typography.stories.tsx");
    }

    // Generate colors story
    if (colors.colors) {
      console.log("📝 Generating colors story...");
      const colorsStory = generateColorsStory(colors.colors);
      await writeFile(join(STORIES_DIR, "colors.stories.tsx"), colorsStory);
      console.log("   ✅ Generated colors.stories.tsx");
    }

    // Generate spacing story
    if (spacing.spacing) {
      console.log("📝 Generating spacing story...");
      const spacingStory = generateSpacingStory(spacing.spacing);
      await writeFile(join(STORIES_DIR, "spacing.stories.tsx"), spacingStory);
      console.log("   ✅ Generated spacing.stories.tsx");
    }

    console.log("✨ Story generation complete!");
  } catch (error) {
    console.error("❌ Error generating stories:", error);
    process.exit(1);
  }
}

// Run the generation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStories();
}

export { generateStories };
