export function AlertThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Info alert */}
      <rect x="40" y="36" width="220" height="56" rx="10" fill="var(--theme-info)" opacity="0.1" />
      <rect x="40" y="36" width="4" height="56" rx="2" fill="var(--theme-info)" />
      <rect x="56" y="52" width="80" height="10" rx="3" fill="var(--theme-info)" />
      <rect x="56" y="68" width="180" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Warning alert */}
      <rect x="40" y="112" width="220" height="56" rx="10" fill="var(--theme-warning)" opacity="0.1" />
      <rect x="40" y="112" width="4" height="56" rx="2" fill="var(--theme-warning)" />
      <rect x="56" y="128" width="100" height="10" rx="3" fill="var(--theme-warning)" />
      <rect x="56" y="144" width="160" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Critical alert */}
      <rect x="40" y="188" width="220" height="56" rx="10" fill="var(--theme-critical)" opacity="0.1" />
      <rect x="40" y="188" width="4" height="56" rx="2" fill="var(--theme-critical)" />
      <rect x="56" y="204" width="72" height="10" rx="3" fill="var(--theme-critical)" />
      <rect x="56" y="220" width="140" height="8" rx="2" fill="var(--shade-halftone)" />
    </svg>
  );
}
