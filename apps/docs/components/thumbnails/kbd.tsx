export function KbdThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Large key combo — centered */}
      <rect x="40" y="88" width="64" height="48" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="52" y="104" width="40" height="14" rx="3" fill="var(--shade-foreground)" />

      <rect x="112" y="100" width="16" height="16" rx="4" fill="var(--shade-halftone)" opacity="0.3" />

      <rect x="140" y="88" width="48" height="48" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="152" y="104" width="24" height="14" rx="3" fill="var(--shade-foreground)" />

      <rect x="196" y="100" width="16" height="16" rx="4" fill="var(--shade-halftone)" opacity="0.3" />

      <rect x="224" y="88" width="40" height="48" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="232" y="104" width="24" height="14" rx="3" fill="var(--shade-foreground)" />

      {/* Row of small keys */}
      <rect x="60" y="176" width="36" height="32" rx="6" fill="var(--shade-background)" stroke="var(--shade-4)" strokeWidth="1.5" />
      <rect x="68" y="186" width="20" height="10" rx="2" fill="var(--shade-halftone)" />

      <rect x="108" y="176" width="36" height="32" rx="6" fill="var(--shade-background)" stroke="var(--shade-4)" strokeWidth="1.5" />
      <rect x="116" y="186" width="20" height="10" rx="2" fill="var(--shade-halftone)" />

      <rect x="156" y="176" width="36" height="32" rx="6" fill="var(--shade-background)" stroke="var(--shade-4)" strokeWidth="1.5" />
      <rect x="164" y="186" width="20" height="10" rx="2" fill="var(--shade-halftone)" />

      <rect x="204" y="176" width="36" height="32" rx="6" fill="var(--shade-background)" stroke="var(--shade-4)" strokeWidth="1.5" />
      <rect x="212" y="186" width="20" height="10" rx="2" fill="var(--shade-halftone)" />
    </svg>
  );
}
