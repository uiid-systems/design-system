export function StackThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Outer container */}
      <rect x="40" y="40" width="220" height="220" rx="12" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Inner container — dashed */}
      <rect x="56" y="56" width="188" height="188" rx="10" fill="var(--theme-secondary)" opacity="0.06" stroke="var(--theme-secondary)" strokeWidth="1" strokeDasharray="6 3" />

      {/* Vertical stack of child blocks */}
      <rect x="72" y="72" width="156" height="48" rx="8" fill="var(--theme-primary)" opacity="0.5" />
      <rect x="72" y="132" width="156" height="48" rx="8" fill="var(--theme-secondary)" opacity="0.5" />
      <rect x="72" y="192" width="156" height="40" rx="8" fill="var(--theme-info)" opacity="0.5" />
    </svg>
  );
}
