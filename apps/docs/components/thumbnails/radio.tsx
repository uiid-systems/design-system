export function RadioThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Selected */}
      <circle cx="56" cy="72" r="14" fill="none" stroke="var(--theme-primary)" strokeWidth="2" />
      <circle cx="56" cy="72" r="6" fill="var(--theme-primary)" />
      <rect x="80" y="66" width="140" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Unselected */}
      <circle cx="56" cy="128" r="14" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="80" y="122" width="100" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unselected */}
      <circle cx="56" cy="184" r="14" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="80" y="178" width="120" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unselected */}
      <circle cx="56" cy="240" r="14" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="80" y="234" width="80" height="12" rx="3" fill="var(--shade-halftone)" />
    </svg>
  );
}
