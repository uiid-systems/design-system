export function AvatarThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Large avatar — square, filled */}
      <rect x="40" y="36" width="100" height="100" rx="16" fill="var(--theme-primary)" opacity="0.2" />
      <circle cx="90" cy="72" r="18" fill="var(--theme-primary)" opacity="0.6" />
      <ellipse cx="90" cy="106" rx="28" ry="16" fill="var(--theme-primary)" opacity="0.4" />

      {/* Medium avatar */}
      <rect x="160" y="36" width="100" height="100" rx="16" fill="var(--theme-secondary)" opacity="0.2" />
      <circle cx="210" cy="72" r="18" fill="var(--theme-secondary)" opacity="0.6" />
      <ellipse cx="210" cy="106" rx="28" ry="16" fill="var(--theme-secondary)" opacity="0.4" />

      {/* Row of small circular avatars */}
      <circle cx="68" cy="196" r="32" fill="var(--theme-info)" opacity="0.2" />
      <circle cx="68" cy="186" r="10" fill="var(--theme-info)" opacity="0.6" />
      <ellipse cx="68" cy="204" rx="16" ry="10" fill="var(--theme-info)" opacity="0.4" />

      <circle cx="150" cy="196" r="32" fill="var(--shade-foreground)" opacity="0.1" />
      <circle cx="150" cy="186" r="10" fill="var(--shade-foreground)" opacity="0.35" />
      <ellipse cx="150" cy="204" rx="16" ry="10" fill="var(--shade-foreground)" opacity="0.25" />

      <circle cx="232" cy="196" r="32" fill="var(--theme-primary)" opacity="0.15" />
      <circle cx="232" cy="186" r="10" fill="var(--theme-primary)" opacity="0.5" />
      <ellipse cx="232" cy="204" rx="16" ry="10" fill="var(--theme-primary)" opacity="0.35" />

      {/* Initials badge on last avatar */}
      <rect x="216" y="236" width="32" height="16" rx="4" fill="var(--shade-foreground)" />
      <rect x="222" y="240" width="20" height="8" rx="2" fill="var(--shade-background)" opacity="0.8" />
    </svg>
  );
}
