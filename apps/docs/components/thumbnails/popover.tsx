export function PopoverThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Trigger */}
      <rect x="88" y="132" width="124" height="40" rx="8" fill="var(--shade-foreground)" opacity="0.08" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="116" y="146" width="68" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Popover panel */}
      <rect x="48" y="28" width="204" height="88" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <polygon points="142,116 150,128 158,116" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="142" y="115" width="16" height="4" fill="var(--shade-background)" />

      {/* Popover content */}
      <rect x="64" y="44" width="140" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="64" y="64" width="172" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="64" y="80" width="120" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />
      <rect x="64" y="96" width="48" height="12" rx="4" fill="var(--theme-primary)" opacity="0.15" />

      {/* Secondary trigger below */}
      <rect x="88" y="196" width="124" height="36" rx="8" fill="var(--theme-secondary)" opacity="0.12" />
      <rect x="112" y="208" width="76" height="12" rx="3" fill="var(--theme-secondary)" />
    </svg>
  );
}
