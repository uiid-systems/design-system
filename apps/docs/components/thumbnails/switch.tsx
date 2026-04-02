export function SwitchThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Switch ON — large */}
      <rect x="40" y="44" width="220" height="48" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1" />
      <rect x="52" y="54" width="64" height="28" rx="14" fill="var(--theme-primary)" />
      <circle cx="96" cy="68" r="10" fill="var(--shade-background)" />
      <rect x="128" y="58" width="100" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Switch OFF — large */}
      <rect x="40" y="112" width="220" height="48" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1" />
      <rect x="52" y="122" width="64" height="28" rx="14" fill="var(--shade-4)" />
      <circle cx="72" cy="136" r="10" fill="var(--shade-background)" />
      <rect x="128" y="126" width="80" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Switch ON — secondary */}
      <rect x="40" y="180" width="220" height="48" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1" />
      <rect x="52" y="190" width="64" height="28" rx="14" fill="var(--theme-secondary)" />
      <circle cx="96" cy="204" r="10" fill="var(--shade-background)" />
      <rect x="128" y="194" width="120" height="12" rx="3" fill="var(--shade-foreground)" />
    </svg>
  );
}
