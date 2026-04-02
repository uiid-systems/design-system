export function SelectThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Select trigger */}
      <rect x="40" y="36" width="220" height="48" rx="10" fill="var(--shade-background)" stroke="var(--theme-primary)" strokeWidth="2" />
      <rect x="56" y="52" width="100" height="14" rx="4" fill="var(--shade-foreground)" />
      {/* Chevron */}
      <path d="M236 52 L244 60 L252 52" stroke="var(--theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dropdown panel */}
      <rect x="40" y="92" width="220" height="176" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Option — selected */}
      <rect x="48" y="100" width="204" height="36" rx="6" fill="var(--theme-primary)" opacity="0.1" />
      <rect x="60" y="112" width="100" height="12" rx="3" fill="var(--theme-primary)" />
      <circle cx="236" cy="118" r="5" fill="var(--theme-primary)" />

      {/* Option — hover */}
      <rect x="48" y="140" width="204" height="36" rx="6" fill="var(--shade-accent)" opacity="0.5" />
      <rect x="60" y="152" width="120" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Option */}
      <rect x="60" y="192" width="80" height="12" rx="3" fill="var(--shade-halftone)" />

      {/* Option */}
      <rect x="60" y="228" width="108" height="12" rx="3" fill="var(--shade-halftone)" />
    </svg>
  );
}
