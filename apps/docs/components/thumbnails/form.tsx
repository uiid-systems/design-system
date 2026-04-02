export function FormThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Field 1 — label + input */}
      <rect x="40" y="36" width="60" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="54" width="220" height="44" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="56" y="70" width="80" height="10" rx="3" fill="var(--shade-4)" />

      {/* Field 2 — label + input */}
      <rect x="40" y="118" width="80" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="136" width="220" height="44" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="56" y="152" width="120" height="10" rx="3" fill="var(--shade-4)" />

      {/* Field 3 — two columns */}
      <rect x="40" y="200" width="40" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="40" y="218" width="100" height="40" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      <rect x="160" y="200" width="60" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="160" y="218" width="100" height="40" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
    </svg>
  );
}
