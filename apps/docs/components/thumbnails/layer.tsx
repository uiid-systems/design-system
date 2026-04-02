export function LayerThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Stacked layers — offset for depth */}
      <rect x="80" y="52" width="180" height="120" rx="10" fill="var(--shade-accent)" opacity="0.4" />
      <rect x="60" y="72" width="180" height="120" rx="10" fill="var(--shade-accent)" opacity="0.6" />
      <rect x="40" y="92" width="180" height="120" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Content in front layer */}
      <rect x="56" y="112" width="120" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="56" y="132" width="148" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="56" y="148" width="100" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />
      <rect x="56" y="176" width="60" height="20" rx="5" fill="var(--theme-primary)" />
    </svg>
  );
}
