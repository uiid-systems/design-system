export function DrawerThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Page content — dimmed */}
      <rect x="24" y="24" width="140" height="252" rx="8" fill="var(--shade-foreground)" opacity="0.04" />
      <rect x="40" y="44" width="100" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.3" />
      <rect x="40" y="62" width="80" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.2" />
      <rect x="40" y="78" width="108" height="8" rx="2" fill="var(--shade-halftone)" opacity="0.15" />

      {/* Drawer panel — slides from right */}
      <rect x="172" y="24" width="108" height="252" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Drawer header */}
      <rect x="184" y="44" width="80" height="14" rx="4" fill="var(--shade-foreground)" />

      {/* Divider */}
      <rect x="184" y="72" width="84" height="1" fill="var(--shade-accent)" />

      {/* Drawer content */}
      <rect x="184" y="92" width="84" height="10" rx="3" fill="var(--shade-halftone)" />
      <rect x="184" y="110" width="72" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.7" />
      <rect x="184" y="128" width="84" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.5" />
      <rect x="184" y="146" width="60" height="10" rx="3" fill="var(--shade-halftone)" opacity="0.3" />

      {/* Drawer action */}
      <rect x="184" y="236" width="84" height="28" rx="6" fill="var(--theme-primary)" />
    </svg>
  );
}
