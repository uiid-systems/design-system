export function ToggleButtonThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Toggle group — segmented control */}
      <rect x="40" y="56" width="220" height="48" rx="10" fill="var(--shade-accent)" />
      <rect x="44" y="60" width="72" height="40" rx="8" fill="var(--theme-primary)" />
      <rect x="56" y="72" width="48" height="14" rx="4" fill="var(--shade-background)" opacity="0.9" />
      <rect x="128" y="72" width="48" height="14" rx="4" fill="var(--shade-halftone)" />
      <rect x="200" y="72" width="48" height="14" rx="4" fill="var(--shade-halftone)" />

      {/* Individual toggle buttons — pressed / unpressed */}
      <rect x="40" y="132" width="100" height="48" rx="10" fill="var(--theme-secondary)" />
      <rect x="60" y="148" width="60" height="14" rx="4" fill="var(--shade-background)" opacity="0.9" />

      <rect x="156" y="132" width="104" height="48" rx="10" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="176" y="148" width="64" height="14" rx="4" fill="var(--shade-halftone)" />

      {/* Icon toggles */}
      <rect x="40" y="208" width="48" height="48" rx="10" fill="var(--shade-foreground)" />
      <rect x="52" y="224" width="24" height="16" rx="4" fill="var(--shade-background)" opacity="0.85" />

      <rect x="100" y="208" width="48" height="48" rx="10" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="112" y="224" width="24" height="16" rx="4" fill="var(--shade-halftone)" opacity="0.5" />

      <rect x="160" y="208" width="48" height="48" rx="10" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="172" y="224" width="24" height="16" rx="4" fill="var(--shade-halftone)" opacity="0.5" />
    </svg>
  );
}
