export function CheckboxThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Checked */}
      <rect x="40" y="52" width="28" height="28" rx="6" fill="var(--theme-primary)" />
      <path d="M48 66 L54 72 L64 58" stroke="var(--shade-background)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="58" width="120" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Checked */}
      <rect x="40" y="108" width="28" height="28" rx="6" fill="var(--theme-primary)" />
      <path d="M48 122 L54 128 L64 114" stroke="var(--shade-background)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="114" width="140" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Unchecked */}
      <rect x="40" y="164" width="28" height="28" rx="6" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="80" y="170" width="100" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unchecked */}
      <rect x="40" y="220" width="28" height="28" rx="6" fill="none" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="80" y="226" width="80" height="12" rx="3" fill="var(--shade-halftone)" />
    </svg>
  );
}
