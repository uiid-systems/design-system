import { Prose } from "./prose";

export const Markdown = () => (
  <Prose>
    <h1>UIID Design System</h1>
    <p>
      A registry-first design system built with React 19, TypeScript, and Base
      UI. Components are the implementation. The registry is the interface.
    </p>
    <p>
      For the full vision and architectural decisions, see{" "}
      <a href="#">docs/VISION.md</a>.
    </p>
    <hr />
    <h2>Three Layers</h2>
    <h3>Tokens</h3>
    <p>
      Platform-aligned design values — color, spacing, typography — defined as
      structured data and compiled to CSS custom properties. The source format
      is W3C Design Tokens spec-aligned JSON, making it adaptable without
      changing the source.
    </p>
    <h3>Registry</h3>
    <p>
      A machine-readable description of every component: props, types,
      defaults, slots, and usage guidance. The registry is what keeps
      documentation accurate, gives LLMs correct knowledge of the system, and
      powers the blocks app. It's also what an MCP server exposes to external
      tools.
    </p>
    <h3>Blocks</h3>
    <p>
      Named UI compositions — login forms, settings panels, pricing cards —
      built from registry-validated components. Blocks prevent the composition
      drift that happens when the same patterns get assembled independently
      across products and teams.
    </p>
    <hr />
    <h2>Packages</h2>
    <h3>Component Libraries</h3>
    <ul>
      <li>
        <code>@uiid/buttons</code> — Button, CloseButton, CopyButton,
        ToggleButton
      </li>
      <li>
        <code>@uiid/calendars</code> — Date and date range pickers
      </li>
      <li>
        <code>@uiid/cards</code> — Card components
      </li>
      <li>
        <code>@uiid/forms</code> — Input, Select, Checkbox, Radio, Switch,
        Slider, and more
      </li>
      <li>
        <code>@uiid/layout</code> — Stack, Group, Box, Container, Separator
      </li>
      <li>
        <code>@uiid/overlays</code> — Modal, Drawer, Sheet, Popover, Tooltip
      </li>
      <li>
        <code>@uiid/typography</code> — Text and heading components
      </li>
    </ul>
    <h3>Foundation</h3>
    <ul>
      <li>
        <code>@uiid/tokens</code> — Design tokens (JSON → CSS)
      </li>
      <li>
        <code>@uiid/icons</code> — Icon components (Lucide)
      </li>
      <li>
        <code>@uiid/utils</code> — Shared utilities (<code>cx</code>,{" "}
        <code>cva</code>, <code>renderWithProps</code>)
      </li>
    </ul>
    <hr />
    <h2>Getting Started</h2>
    <h3>Just the components</h3>
    <pre>
      <code>{`pnpm add @uiid/buttons @uiid/layout @uiid/tokens`}</code>
    </pre>
    <pre>
      <code>{`import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import "@uiid/tokens/globals.css";

function App() {
  return (
    <Stack gap={4}>
      <Button>Save changes</Button>
      <Button variant="subtle">Cancel</Button>
    </Stack>
  );
}`}</code>
    </pre>
    <h3>The full system</h3>
    <pre>
      <code>{`pnpm install
pnpm run build
pnpm run storybook`}</code>
    </pre>
    <hr />
    <h2>Development</h2>
    <p>
      Build a single package by passing the <code>--filter</code> flag to
      Turbo:
    </p>
    <pre>
      <code>{`pnpm run build --filter=@uiid/buttons`}</code>
    </pre>
    <h3>Bundle size</h3>
    <p>
      All packages have size budgets enforced by{" "}
      <a href="#">size-limit</a>. Sizes are measured as minified + brotli with
      all dependencies included.
    </p>
    <blockquote>
      A pre-push hook runs <code>pnpm size</code> automatically. If any package
      exceeds its budget, the push is blocked. Bypass with{" "}
      <code>git push --no-verify</code> in emergencies.
    </blockquote>
    <h3>Architecture</h3>
    <ul>
      <li>
        <strong>Monorepo</strong>: pnpm workspaces + Turbo
      </li>
      <li>
        <strong>Build</strong>: Vite 7
      </li>
      <li>
        <strong>Styling</strong>: CSS Modules with design tokens
      </li>
      <li>
        <strong>Primitives</strong>: <a href="#">Base UI</a> for accessible
        components
      </li>
      <li>
        <strong>Testing</strong>: Vitest + Testing Library
      </li>
    </ul>
    <h2>License</h2>
    <p>MIT</p>
  </Prose>
);

export const Headings = () => (
  <Prose>
    <h1>Heading 1 — Display</h1>
    <h2>Heading 2 — Page title</h2>
    <h3>Heading 3 — Section</h3>
    <h4>Heading 4 — Subsection</h4>
    <h5>Heading 5 — Block title</h5>
    <h6>Heading 6 — Eyebrow</h6>
  </Prose>
);

export const Article = () => (
  <Prose>
    <h2>Typography is the bones of an interface</h2>
    <p>
      A scale that breathes well at every size is more than aesthetics — it is
      what lets a complex application feel calm. Linear's calm comes from
      restraint; Notion's clarity comes from density paired with rhythm; shadcn
      borrows both.
    </p>
    <p>
      The shape of the scale matters less than the ratios <em>between</em>{" "}
      sizes. A few tuned steps will always beat a long ladder of nearly-equal
      values.
    </p>
    <hr />
    <p>
      The same rule applies to weight: <strong>each step should feel
      deliberate</strong>, not algorithmic.
    </p>
  </Prose>
);
