export function ButtonThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Primary — bold, dominant */}
      <rect x="40" y="44" width="220" height="56" rx="12" fill="var(--theme-primary)" />
      <rect x="100" y="62" width="100" height="20" rx="6" fill="var(--shade-background)" opacity="0.92" />

      {/* Secondary */}
      <rect x="40" y="120" width="220" height="56" rx="12" fill="var(--theme-secondary)" />
      <rect x="100" y="138" width="100" height="20" rx="6" fill="var(--shade-background)" opacity="0.92" />

      {/* Dark / inverted */}
      <rect x="40" y="196" width="140" height="56" rx="12" fill="var(--shade-foreground)" />
      <rect x="68" y="214" width="84" height="20" rx="6" fill="var(--shade-background)" opacity="0.88" />

      {/* Ghost — outline only, contrasts with filled */}
      <rect x="196" y="196" width="64" height="56" rx="12" fill="none" stroke="var(--shade-halftone)" strokeWidth="1.5" />
      <rect x="212" y="216" width="32" height="16" rx="4" fill="var(--shade-halftone)" opacity="0.5" />
    </svg>
  );
}
