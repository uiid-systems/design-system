export function RadioGroupThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Group label */}
      <rect x="40" y="36" width="100" height="14" rx="4" fill="var(--shade-foreground)" />

      {/* Selected */}
      <circle cx="56" cy="84" r="12" fill="none" stroke="var(--theme-primary)" strokeWidth="2" />
      <circle cx="56" cy="84" r="5" fill="var(--theme-primary)" />
      <rect x="80" y="78" width="120" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Unselected */}
      <circle cx="56" cy="128" r="12" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="80" y="122" width="100" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unselected */}
      <circle cx="56" cy="172" r="12" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="80" y="166" width="140" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unselected */}
      <circle cx="56" cy="216" r="12" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="80" y="210" width="80" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Helper */}
      <rect x="40" y="252" width="160" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.5" />
    </svg>
  );
}
