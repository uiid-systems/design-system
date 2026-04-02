export function CollapsibleThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Collapsed state */}
      <rect x="40" y="40" width="220" height="44" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="56" y="54" width="120" height="14" rx="4" fill="var(--shade-foreground)" />
      <path d="M240 54 L248 62 L240 70" stroke="var(--shade-halftone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Expanded state */}
      <rect x="40" y="108" width="220" height="160" rx="8" fill="var(--shade-background)" stroke="var(--theme-secondary)" strokeWidth="1.5" />
      <rect x="56" y="122" width="100" height="14" rx="4" fill="var(--theme-secondary)" />
      <path d="M236 122 L244 130 L252 122" stroke="var(--theme-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Expanded content */}
      <rect x="56" y="152" width="188" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="56" y="168" width="188" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="56" y="184" width="160" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.7" />
      <rect x="56" y="200" width="140" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.5" />
      <rect x="56" y="216" width="100" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.3" />

      {/* Bottom spacing line */}
      <rect x="56" y="244" width="188" height="12" rx="4" fill="var(--theme-secondary)" opacity="0.1" />
    </svg>
  );
}
