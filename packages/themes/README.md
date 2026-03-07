# @uiid/themes

Theme schema, generation, validation, and presets for the UIID design system.

## Theme Input Format

Themes are defined as simple JSON with hex colors:

```json
{
  "name": "My Theme",
  "white": "#fefefa",
  "black": "#0d0d0d",
  "primary": "#ff0000",
  "secondary": "#9036e1",
  "positive": "#00c565",
  "warning": "#e8b700",
  "critical": "#f9262a",
  "info": "#347eff"
}
```

**Required:** `name`, `white`, `black`, `primary`, `secondary`
**Optional:** `positive`, `warning`, `critical`, `info` (fall back to defaults)

All colors must be 6-digit hex (`#RRGGBB`). The generation pipeline handles OKLCH conversion, shade scales, and tone variants automatically.

## Generate a Theme

```bash
# Generate CSS from a theme JSON
npx tsx scripts/generate-theme.js --input my-theme.json --output my-theme.css

# Dry run (validate only)
npx tsx scripts/generate-theme.js --input my-theme.json --dry-run
```

## VSCode Theme Import

Convert any VSCode color theme into a UIID theme input JSON.

### CLI

```bash
# Output to stdout
npx tsx scripts/convert-vscode-theme.js --input path/to/vscode-theme.json

# Write to file
npx tsx scripts/convert-vscode-theme.js --input path/to/vscode-theme.json --output my-theme.json

# Override theme name
npx tsx scripts/convert-vscode-theme.js --input path/to/vscode-theme.json --name "My Custom Name"
```

### Programmatic

```typescript
import { convertVscodeTheme } from "@uiid/themes/vscode";

const vscodeThemeJson = fs.readFileSync("dracula.json", "utf-8");
const { theme, warnings } = convertVscodeTheme(vscodeThemeJson);

// theme is a valid UIID ThemeInput object
// warnings lists any mapping issues encountered
```

The converter accepts both JSON and JSONC (with comments/trailing commas), and handles:

- Light and dark theme detection (from `type` field or background luminance)
- 8-digit hex normalization (strips alpha channel)
- Graceful fallbacks with warnings for missing color mappings

### Color Mapping

| UIID Field    | VSCode Keys (priority order)                                                    |
| ------------- | ------------------------------------------------------------------------------- |
| `white`       | Light: `editor.background` / Dark: `editor.foreground`, `foreground`            |
| `black`       | Light: `editor.foreground` / Dark: `editor.background`                          |
| `primary`     | `focusBorder`, `button.background`, `activityBarBadge.background`               |
| `secondary`   | `badge.background`, `activityBar.activeBorder`, `tab.activeBorder`              |
| `positive`    | `terminal.ansiGreen`, `gitDecoration.addedResourceForeground`                   |
| `warning`     | `terminal.ansiYellow`, `list.warningForeground`, `editorWarning.foreground`     |
| `critical`    | `terminal.ansiRed`, `errorForeground`, `editorError.foreground`                 |
| `info`        | `terminal.ansiBlue`, `editorInfo.foreground`, `notificationsInfoIcon.foreground`|

### Known Limitations

- **`include` not resolved.** VSCode themes that extend a base theme via `include` will only convert the explicitly defined colors. Inherited colors are not available.
- **Neutral fidelity.** For dark themes, `white` is derived from the foreground color, which is typically a muted gray rather than pure white. Manual adjustment may improve the shade scale range.
- **Semantic subset.** VSCode themes define hundreds of color keys. The converter maps only the ~8 that correspond to UIID's theme schema. Fine-grained syntax highlighting colors are not transferred.

### End-to-End: VSCode Theme → CSS

```bash
# Step 1: Convert VSCode theme to UIID theme JSON
npx tsx scripts/convert-vscode-theme.js --input dracula.json --output dracula-uiid.json

# Step 2: Generate UIID theme CSS
npx tsx scripts/generate-theme.js --input dracula-uiid.json --output dracula.theme.css
```

## Presets

Built-in presets are in `src/presets/`:

| Preset  | Description             |
| ------- | ----------------------- |
| Default | UIID default palette    |
| Ocean   | Cool blue tones         |
| Ember   | Warm orange/red tones   |
| Ayu     | Adapted from ayu-colors |

Build all presets: `pnpm run build --filter=@uiid/themes`
