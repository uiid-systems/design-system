export function SeparatorThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Content above */}
      <rect x="40" y="44" width="160" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="64" width="220" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="40" y="80" width="180" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />

      {/* Separator line */}
      <rect x="40" y="112" width="220" height="1.5" fill="var(--shade-accent)" />

      {/* Separator with text */}
      <rect x="40" y="160" width="80" height="1.5" fill="var(--shade-accent)" />
      <rect x="132" y="154" width="36" height="12" rx="3" fill="var(--shade-halftone)" />
      <rect x="180" y="160" width="80" height="1.5" fill="var(--shade-accent)" />

      {/* Content below */}
      <rect x="40" y="196" width="140" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="216" width="220" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="40" y="232" width="160" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />
    </svg>
  );
}
