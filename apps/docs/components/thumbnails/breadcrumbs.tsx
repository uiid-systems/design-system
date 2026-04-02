export function BreadcrumbsThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Breadcrumb trail — centered vertically */}
      <rect x="40" y="128" width="48" height="12" rx="3" fill="var(--shade-halftone)" />
      <path d="M96 134 L104 134" stroke="var(--shade-4)" strokeWidth="2" strokeLinecap="round" />
      <rect x="112" y="128" width="64" height="12" rx="3" fill="var(--shade-halftone)" />
      <path d="M184 134 L192 134" stroke="var(--shade-4)" strokeWidth="2" strokeLinecap="round" />
      <rect x="200" y="128" width="80" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Page title below */}
      <rect x="40" y="164" width="180" height="16" rx="4" fill="var(--shade-foreground)" />

      {/* Decorative — path lines above */}
      <rect x="40" y="72" width="220" height="1" fill="var(--shade-accent)" />
      <rect x="40" y="84" width="48" height="8" rx="2" fill="var(--theme-primary)" opacity="0.4" />
      <rect x="112" y="84" width="64" height="8" rx="2" fill="var(--theme-primary)" opacity="0.25" />
      <rect x="200" y="84" width="60" height="8" rx="2" fill="var(--theme-primary)" opacity="0.15" />

      {/* Content hint below */}
      <rect x="40" y="204" width="220" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.5" />
      <rect x="40" y="220" width="180" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.3" />
    </svg>
  );
}
