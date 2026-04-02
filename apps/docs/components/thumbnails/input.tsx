export function InputThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      <rect x="40" y="40" width="220" height="52" rx="10" fill="var(--shade-background)" stroke="var(--theme-primary)" strokeWidth="2.5" />
      <rect x="60" y="58" width="100" height="14" rx="4" fill="var(--shade-foreground)" />
      <rect x="168" y="60" width="2" height="20" rx="1" fill="var(--theme-primary)" opacity="0.7" />

      <rect x="40" y="120" width="220" height="52" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="2" />
      <rect x="60" y="140" width="80" height="12" rx="3" fill="var(--shade-4)" />

      <rect x="40" y="200" width="220" height="52" rx="10" fill="var(--shade-background)" stroke="var(--theme-critical)" strokeWidth="2.5" />
      <rect x="60" y="220" width="120" height="12" rx="3" fill="var(--shade-foreground)" />

      <rect x="56" y="28" width="48" height="16" rx="4" fill="var(--shade-surface)" />
      <rect x="60" y="32" width="40" height="8" rx="2" fill="var(--theme-primary)" />

      <rect x="56" y="108" width="64" height="16" rx="4" fill="var(--shade-surface)" />
      <rect x="60" y="112" width="56" height="8" rx="2" fill="var(--shade-halftone)" />

      <rect x="56" y="188" width="48" height="16" rx="4" fill="var(--shade-surface)" />
      <rect x="60" y="192" width="40" height="8" rx="2" fill="var(--theme-critical)" />

      <rect x="44" y="260" width="100" height="8" rx="2" fill="var(--theme-critical)" opacity="0.6" />
    </svg>
  );
}
