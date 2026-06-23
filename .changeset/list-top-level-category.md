---
"@uiid/lists": patch
---

Add a top-level `category` (and `icon`) prop to `List` so a group header can be rendered above the whole list. Extract the shared `ListGroupHeader` subcomponent and fix list indentation by moving the padding reset into CSS (the previous inline `p={0}` overrode the category/marker indent rules).
