export function ToasterThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Stacked toasts — bottom up */}
      {/* Back toast (dimmed) */}
      <rect x="56" y="80" width="200" height="52" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1" opacity="0.5" />

      {/* Middle toast */}
      <rect x="48" y="108" width="216" height="56" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" opacity="0.75" />
      <circle cx="72" cy="136" r="8" fill="var(--theme-warning)" opacity="0.5" />
      <rect x="88" y="124" width="100" height="10" rx="3" fill="var(--shade-foreground)" opacity="0.5" />
      <rect x="88" y="140" width="140" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.4" />

      {/* Front toast — prominent */}
      <rect x="40" y="180" width="220" height="64" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <circle cx="64" cy="212" r="10" fill="var(--theme-positive)" />
      <rect x="84" y="200" width="120" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="84" y="218" width="152" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Close button */}
      <line x1="236" y1="196" x2="244" y2="204" stroke="var(--shade-halftone)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="244" y1="196" x2="236" y2="204" stroke="var(--shade-halftone)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
