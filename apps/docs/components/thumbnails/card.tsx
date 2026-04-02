export function CardThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      <rect x="40" y="32" width="220" height="236" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      <rect x="52" y="44" width="196" height="100" rx="8" fill="var(--theme-secondary)" opacity="0.12" />
      <circle cx="150" cy="84" r="28" fill="var(--theme-secondary)" opacity="0.2" />

      <rect x="52" y="162" width="140" height="14" rx="4" fill="var(--shade-foreground)" />

      <rect x="52" y="188" width="196" height="10" rx="3" fill="var(--shade-halftone)" />
      <rect x="52" y="206" width="140" height="10" rx="3" fill="var(--shade-halftone)" />

      <rect x="52" y="232" width="80" height="24" rx="6" fill="var(--theme-primary)" />
    </svg>
  );
}
