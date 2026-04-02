export function NumberFieldThumbnail() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>

      {/* Number input — centered */}
      <rect x="40" y="84" width="220" height="52" rx="10" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />

      {/* Decrement button */}
      <rect x="48" y="92" width="36" height="36" rx="6" fill="var(--shade-accent)" />
      <line x1="58" y1="110" x2="74" y2="110" stroke="var(--shade-halftone)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Value */}
      <rect x="116" y="102" width="68" height="16" rx="4" fill="var(--shade-foreground)" />

      {/* Increment button */}
      <rect x="216" y="92" width="36" height="36" rx="6" fill="var(--shade-accent)" />
      <line x1="226" y1="110" x2="242" y2="110" stroke="var(--shade-halftone)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="234" y1="102" x2="234" y2="118" stroke="var(--shade-halftone)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Label */}
      <rect x="40" y="56" width="80" height="12" rx="3" fill="var(--shade-foreground)" />

      {/* Helper text */}
      <rect x="40" y="148" width="120" height="8" rx="2" fill="var(--shade-halftone)" />

      {/* Secondary — smaller, compact */}
      <rect x="40" y="196" width="140" height="40" rx="8" fill="var(--shade-background)" stroke="var(--shade-accent)" strokeWidth="1.5" />
      <rect x="48" y="204" width="24" height="24" rx="4" fill="var(--shade-accent)" />
      <rect x="88" y="210" width="40" height="12" rx="3" fill="var(--shade-foreground)" />
      <rect x="148" y="204" width="24" height="24" rx="4" fill="var(--shade-accent)" />
    </svg>
  );
}
