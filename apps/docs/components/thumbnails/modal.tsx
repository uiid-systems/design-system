export function ModalThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Backdrop overlay */}
      <rect width="300" height="300" rx="12" fill="var(--shade-foreground)" opacity="0.06" />

      {/* Modal panel */}
      <rect x="40" y="52" width="220" height="196" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Header */}
      <rect x="56" y="68" width="120" height="14" rx="4" fill="var(--shade-foreground)" />
      {/* Close X */}
      <line x1="236" y1="64" x2="244" y2="72" stroke="var(--shade-halftone)" strokeWidth="2" strokeLinecap="round" />
      <line x1="244" y1="64" x2="236" y2="72" stroke="var(--shade-halftone)" strokeWidth="2" strokeLinecap="round" />

      {/* Divider */}
      <rect x="56" y="96" width="188" height="1" fill="var(--shade-accent)" />

      {/* Content — skeleton text lines */}
      <rect x="56" y="116" width="188" height="10" rx="3" fill="var(--shade-halftone)" />
      <rect x="56" y="134" width="160" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.7" />
      <rect x="56" y="152" width="140" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.5" />

      {/* Footer buttons */}
      <rect x="128" y="196" width="56" height="32" rx="8" fill="none" stroke="var(--shade-halftone)" strokeWidth="1" />
      <rect x="196" y="196" width="48" height="32" rx="8" fill="var(--theme-primary)" />
    </svg>
  );
}
