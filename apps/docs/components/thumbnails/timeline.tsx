export function TimelineThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Vertical line */}
      <rect x="62" y="40" width="2" height="220" fill="var(--shade-accent)" />

      {/* Node 1 — primary */}
      <circle cx="63" cy="64" r="10" fill="var(--theme-primary)" />
      <rect x="88" y="52" width="120" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="88" y="72" width="160" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Node 2 — secondary */}
      <circle cx="63" cy="128" r="10" fill="var(--theme-secondary)" />
      <rect x="88" y="116" width="100" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="88" y="136" width="140" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Node 3 — muted */}
      <circle cx="63" cy="192" r="10" fill="var(--shade-halftone)" />
      <rect x="88" y="180" width="80" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="88" y="200" width="120" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />

      {/* Node 4 — upcoming */}
      <circle cx="63" cy="244" r="10" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="88" y="238" width="60" height="12" rx="3" fill="var(--shade-halftone)" opacity="0.5" />
    </svg>
  );
}
