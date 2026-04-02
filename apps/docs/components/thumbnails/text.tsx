export function TextThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Heading — large, bold weight */}
      <rect x="40" y="40" width="200" height="20" rx="4" fill="var(--shade-foreground)" />

      {/* Subheading — medium */}
      <rect x="40" y="76" width="160" height="14" rx="3" fill="var(--shade-foreground)" opacity="0.8" />

      {/* Body text block */}
      <rect x="40" y="112" width="220" height="10" rx="3" fill="var(--shade-halftone)" />
      <rect x="40" y="130" width="220" height="10" rx="3" fill="var(--shade-halftone)" />
      <rect x="40" y="148" width="180" height="10" rx="3" fill="var(--shade-halftone)" />

      {/* Colored text */}
      <rect x="40" y="184" width="100" height="12" rx="3" fill="var(--theme-primary)" />
      <rect x="152" y="184" width="80" height="12" rx="3" fill="var(--theme-secondary)" />

      {/* Muted text */}
      <rect x="40" y="216" width="220" height="8" rx="2" fill="var(--shade-muted)" />
      <rect x="40" y="232" width="160" height="8" rx="2" fill="var(--shade-muted)" opacity="0.6" />

      {/* Mono / code text */}
      <rect x="40" y="260" width="140" height="10" rx="2" fill="var(--shade-foreground)" opacity="0.5" />
    </svg>
  );
}
