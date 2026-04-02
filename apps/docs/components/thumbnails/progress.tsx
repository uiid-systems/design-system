export function ProgressThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Full-width progress bar — primary */}
      <rect x="40" y="60" width="220" height="12" rx="6" fill="var(--shade-accent)" />
      <rect x="40" y="60" width="154" height="12" rx="6" fill="var(--theme-primary)" />

      {/* Full-width — secondary */}
      <rect x="40" y="108" width="220" height="12" rx="6" fill="var(--shade-accent)" />
      <rect x="40" y="108" width="88" height="12" rx="6" fill="var(--theme-secondary)" />

      {/* Thicker bar — info */}
      <rect x="40" y="156" width="220" height="20" rx="10" fill="var(--shade-accent)" />
      <rect x="40" y="156" width="176" height="20" rx="10" fill="var(--theme-info)" opacity="0.8" />

      {/* Thinner bar — muted */}
      <rect x="40" y="212" width="220" height="6" rx="3" fill="var(--shade-accent)" />
      <rect x="40" y="212" width="110" height="6" rx="3" fill="var(--shade-foreground)" />

      {/* Labels */}
      <rect x="40" y="36" width="40" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="216" y="36" width="44" height="10" rx="3" fill="var(--theme-primary)" />

      <rect x="40" y="84" width="56" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="132" width="48" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="188" width="64" height="10" rx="3" fill="var(--shade-foreground)" />
    </svg>
  );
}
