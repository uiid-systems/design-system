export function AccordionThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Closed section */}
      <rect x="40" y="36" width="220" height="44" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="56" y="52" width="100" height="12" rx="3" fill="var(--shade-foreground)" />
      <path d="M240 52 L248 60 L240 68" stroke="var(--shade-halftone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Open section — expanded with content */}
      <rect x="40" y="92" width="220" height="120" rx="8" fill="var(--shade-background)" stroke="var(--theme-primary)" strokeWidth="1.5" />
      <rect x="56" y="108" width="120" height="12" rx="3" fill="var(--theme-primary)" />
      <path d="M236 108 L244 116 L252 108" stroke="var(--theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Content lines */}
      <rect x="56" y="136" width="188" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="56" y="152" width="160" height="8" rx="2" fill="var(--shade-halftone)" />
      <rect x="56" y="168" width="140" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.6" />
      <rect x="56" y="184" width="100" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.4" />

      {/* Closed section */}
      <rect x="40" y="224" width="220" height="44" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="56" y="240" width="80" height="12" rx="3" fill="var(--shade-foreground)" />
      <path d="M240 240 L248 248 L240 256" stroke="var(--shade-halftone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
