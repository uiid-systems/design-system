export function BadgeThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Row 1 — solid badges */}
      <rect x="40" y="52" width="72" height="32" rx="16" fill="var(--theme-primary)" />
      <rect x="52" y="62" width="48" height="12" rx="4" fill="var(--shade-background)" opacity="0.9" />

      <rect x="124" y="52" width="72" height="32" rx="16" fill="var(--theme-secondary)" />
      <rect x="136" y="62" width="48" height="12" rx="4" fill="var(--shade-background)" opacity="0.9" />

      <rect x="208" y="52" width="52" height="32" rx="16" fill="var(--shade-foreground)" />
      <rect x="218" y="62" width="32" height="12" rx="4" fill="var(--shade-background)" opacity="0.9" />

      {/* Row 2 — tinted/subtle badges */}
      <rect x="40" y="116" width="80" height="32" rx="16" fill="var(--theme-primary)" opacity="0.12" />
      <rect x="56" y="126" width="48" height="12" rx="4" fill="var(--theme-primary)" />

      <rect x="132" y="116" width="80" height="32" rx="16" fill="var(--theme-secondary)" opacity="0.12" />
      <rect x="148" y="126" width="48" height="12" rx="4" fill="var(--theme-secondary)" />

      <rect x="224" y="116" width="36" height="32" rx="16" fill="var(--theme-info)" opacity="0.12" />
      <rect x="232" y="126" width="20" height="12" rx="4" fill="var(--theme-info)" />

      {/* Row 3 — outline badges */}
      <rect x="40" y="180" width="68" height="32" rx="16" fill="none" stroke="var(--theme-primary)" strokeWidth="1.5" />
      <rect x="52" y="190" width="44" height="12" rx="4" fill="var(--theme-primary)" />

      <rect x="120" y="180" width="68" height="32" rx="16" fill="none" stroke="var(--theme-critical)" strokeWidth="1.5" />
      <rect x="132" y="190" width="44" height="12" rx="4" fill="var(--theme-critical)" />

      <rect x="200" y="180" width="60" height="32" rx="16" fill="none" stroke="var(--shade-halftone)" strokeWidth="1.5" />
      <rect x="212" y="190" width="36" height="12" rx="4" fill="var(--shade-halftone)" />

      {/* Row 4 — dots / status indicators */}
      <circle cx="64" cy="252" r="8" fill="var(--theme-positive)" />
      <rect x="80" y="246" width="40" height="12" rx="4" fill="var(--shade-foreground)" />

      <circle cx="152" cy="252" r="8" fill="var(--theme-warning)" />
      <rect x="168" y="246" width="40" height="12" rx="4" fill="var(--shade-foreground)" />

      <circle cx="240" cy="252" r="8" fill="var(--theme-critical)" />
    </svg>
  );
}
