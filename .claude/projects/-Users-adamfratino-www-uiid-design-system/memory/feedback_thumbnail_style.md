---
name: Thumbnail SVG style preferences
description: User preferences for component thumbnail SVG illustrations — what works and what doesn't
type: feedback
---

Keep thumbnails clean and flat — no SVG filters (feTurbulence, feGaussianBlur), no gradients, no dithering/grain effects. These look worse in practice even when they sound good in theory.

**Why:** SVG filter effects render inconsistently across themes and look muddy/overprocessed. The clean flat version with theme CSS variables was preferred.

**How to apply:**
- Use flat fills with `var(--shade-*)` and `var(--theme-*)` tokens only
- Symmetrical, centered compositions
- 2-4 theme colors per component
- Hard angles, no soft effects
- Don't over-experiment with overlapping/asymmetric/artistic compositions — the user preferred clean stacked layouts over "creative" ones
- Don't add decorative elements (dot patterns, hatching, scattered shapes) — they look amateurish
- Square viewBox (300x300)
