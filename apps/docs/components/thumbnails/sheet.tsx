export function SheetThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Dimmed page content */}
      <rect x="24" y="24" width="252" height="128" rx="8" fill="var(--shade-foreground)" opacity="0.04" />
      <rect x="40" y="44" width="160" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.25" />
      <rect x="40" y="62" width="120" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.15" />
      <rect x="40" y="78" width="180" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.1" />

      {/* Sheet panel — slides from bottom */}
      <rect x="24" y="164" width="252" height="120" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Handle */}
      <rect x="130" y="172" width="40" height="4" rx="2" fill="var(--shade-4)" />

      {/* Sheet content */}
      <rect x="40" y="192" width="140" height="14" rx="4" fill="var(--shade-foreground)" />
      <rect x="40" y="216" width="220" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="40" y="232" width="180" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />

      {/* Sheet action */}
      <rect x="40" y="256" width="100" height="24" rx="6" fill="var(--theme-primary)" />
      <rect x="152" y="256" width="80" height="24" rx="6" fill="none" stroke="var(--shade-halftone)" strokeWidth="1" />
    </svg>
  );
}
