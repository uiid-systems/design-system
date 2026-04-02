export function BoxThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Outer box */}
      <rect x="40" y="40" width="220" height="220" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Inner nested box */}
      <rect x="64" y="64" width="172" height="172" rx="10" fill="var(--theme-primary)" opacity="0.08" stroke="var(--theme-primary)" strokeWidth="1" strokeDasharray="6 3" />

      {/* Content block inside */}
      <rect x="88" y="88" width="124" height="124" rx="8" fill="var(--theme-primary)" opacity="0.12" />

      {/* Centered element */}
      <rect x="112" y="120" width="76" height="60" rx="6" fill="var(--theme-primary)" opacity="0.25" />
      <rect x="124" y="142" width="52" height="14" rx="4" fill="var(--theme-primary)" />
    </svg>
  );
}
