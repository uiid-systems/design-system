export function TooltipThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Trigger — wide button */}
      <rect x="56" y="132" width="188" height="40" rx="8" fill="var(--shade-foreground)" />
      <rect x="92" y="146" width="116" height="12" rx="4" fill="var(--shade-background)" opacity="0.9" />

      {/* Tooltip above — wide, dark */}
      <rect x="40" y="48" width="220" height="56" rx="10" fill="var(--shade-foreground)" />
      <polygon points="140,104 150,118 160,104" fill="var(--shade-foreground)" />
      <rect x="60" y="64" width="180" height="10" rx="3" fill="var(--shade-background)" opacity="0.8" />
      <rect x="80" y="82" width="140" height="8" rx="2" fill="var(--shade-background)" opacity="0.45" />

      {/* Secondary trigger + tooltip below */}
      <rect x="56" y="200" width="188" height="32" rx="8" fill="var(--theme-primary)" opacity="0.12" />
      <rect x="92" y="210" width="116" height="12" rx="4" fill="var(--theme-primary)" />

      <polygon points="140,232 150,244 160,232" fill="var(--shade-foreground)" opacity="0.9" />
      <rect x="48" y="244" width="204" height="32" rx="8" fill="var(--shade-foreground)" opacity="0.9" />
      <rect x="72" y="254" width="156" height="10" rx="3" fill="var(--shade-background)" opacity="0.7" />
    </svg>
  );
}
