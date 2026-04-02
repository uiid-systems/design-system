export function TextareaThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Label */}
      <rect x="40" y="32" width="80" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Textarea — large */}
      <rect x="40" y="52" width="220" height="160" rx="10" fill="var(--shade-background)" stroke="var(--theme-primary)" strokeWidth="2" />

      {/* Text lines */}
      <rect x="56" y="72" width="188" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="56" y="90" width="188" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="56" y="108" width="140" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="56" y="126" width="188" height="10" rx="3" fill="var(--shade-foreground)" opacity="0.7" />
      <rect x="56" y="144" width="100" height="10" rx="3" fill="var(--shade-foreground)" opacity="0.5" />

      {/* Cursor */}
      <rect x="160" y="140" width="2" height="18" rx="1" fill="var(--theme-primary)" opacity="0.7" />

      {/* Resize handle */}
      <line x1="248" y1="200" x2="252" y2="204" stroke="var(--shade-halftone)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="244" y1="204" x2="252" y2="196" stroke="var(--shade-halftone)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Character count */}
      <rect x="196" y="220" width="64" height="8" rx="2" fill="var(--shade-halftone)" />
    </svg>
  );
}
