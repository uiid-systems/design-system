export function GroupThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Outer container */}
      <rect x="40" y="40" width="220" height="220" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Inner container — dashed */}
      <rect x="56" y="56" width="188" height="188" rx="10" fill="var(--theme-secondary)" opacity="0.06" stroke="var(--theme-secondary)" strokeWidth="1" strokeDasharray="6 3" />

      {/* Horizontal row of child blocks */}
      <rect x="68" y="100" width="52" height="100" rx="8" fill="var(--theme-primary)" opacity="0.5" />
      <rect x="128" y="100" width="52" height="100" rx="8" fill="var(--theme-secondary)" opacity="0.5" />
      <rect x="188" y="100" width="48" height="100" rx="8" fill="var(--theme-info)" opacity="0.5" />
    </svg>
  );
}
