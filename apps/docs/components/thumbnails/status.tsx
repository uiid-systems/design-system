export function StatusThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Status indicators — centered, stacked */}
      <circle cx="60" cy="72" r="8" fill="var(--theme-positive)" />
      <rect x="80" y="66" width="80" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="172" y="66" width="60" height="12" rx="3" fill="var(--shade-halftone)" />

      <circle cx="60" cy="120" r="8" fill="var(--theme-warning)" />
      <rect x="80" y="114" width="100" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="192" y="114" width="48" height="12" rx="3" fill="var(--shade-halftone)" />

      <circle cx="60" cy="168" r="8" fill="var(--theme-critical)" />
      <rect x="80" y="162" width="60" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="152" y="162" width="80" height="12" rx="3" fill="var(--shade-halftone)" />

      <circle cx="60" cy="216" r="8" fill="var(--theme-info)" />
      <rect x="80" y="210" width="120" height="12" rx="3" fill="var(--shade-foreground)" />
    </svg>
  );
}
