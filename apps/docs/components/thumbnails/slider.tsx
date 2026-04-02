export function SliderThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Slider 1 — primary */}
      <rect x="40" y="72" width="220" height="6" rx="3" fill="var(--shade-accent)" />
      <rect x="40" y="72" width="132" height="6" rx="3" fill="var(--theme-primary)" />
      <circle cx="172" cy="75" r="12" fill="var(--theme-primary)" />
      <circle cx="172" cy="75" r="5" fill="var(--shade-background)" />

      {/* Label */}
      <rect x="40" y="44" width="60" height="10" rx="3" fill="var(--shade-foreground)" />
      <rect x="220" y="44" width="40" height="10" rx="3" fill="var(--theme-primary)" />

      {/* Slider 2 — secondary */}
      <rect x="40" y="152" width="220" height="6" rx="3" fill="var(--shade-accent)" />
      <rect x="40" y="152" width="88" height="6" rx="3" fill="var(--theme-secondary)" />
      <circle cx="128" cy="155" r="12" fill="var(--theme-secondary)" />
      <circle cx="128" cy="155" r="5" fill="var(--shade-background)" />

      {/* Label */}
      <rect x="40" y="124" width="80" height="10" rx="3" fill="var(--shade-foreground)" />

      {/* Slider 3 — range (two thumbs) */}
      <rect x="40" y="232" width="220" height="6" rx="3" fill="var(--shade-accent)" />
      <rect x="108" y="232" width="84" height="6" rx="3" fill="var(--shade-foreground)" />
      <circle cx="108" cy="235" r="10" fill="var(--shade-foreground)" />
      <circle cx="108" cy="235" r="4" fill="var(--shade-background)" />
      <circle cx="192" cy="235" r="10" fill="var(--shade-foreground)" />
      <circle cx="192" cy="235" r="4" fill="var(--shade-background)" />

      <rect x="40" y="204" width="48" height="10" rx="3" fill="var(--shade-foreground)" />
    </svg>
  );
}
