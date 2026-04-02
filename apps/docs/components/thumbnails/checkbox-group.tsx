export function CheckboxGroupThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Group label */}
      <rect x="40" y="36" width="120" height="14" rx="4" fill="var(--shade-foreground)" />

      {/* Checked */}
      <rect x="40" y="72" width="24" height="24" rx="5" fill="var(--theme-primary)" />
      <path d="M47 84 L52 89 L60 79" stroke="var(--shade-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="76" y="78" width="120" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Checked */}
      <rect x="40" y="112" width="24" height="24" rx="5" fill="var(--theme-primary)" />
      <path d="M47 124 L52 129 L60 119" stroke="var(--shade-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="76" y="118" width="100" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Unchecked */}
      <rect x="40" y="152" width="24" height="24" rx="5" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="76" y="158" width="140" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unchecked */}
      <rect x="40" y="192" width="24" height="24" rx="5" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="76" y="198" width="80" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Unchecked */}
      <rect x="40" y="232" width="24" height="24" rx="5" fill="none" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="76" y="238" width="108" height="12" rx="3" fill="var(--shade-halftone)" />
    </svg>
  );
}
