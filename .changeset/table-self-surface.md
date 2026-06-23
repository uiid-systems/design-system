---
"@uiid/tables": patch
"@uiid/tokens": patch
---

Table now renders its own Card-based surface (border, radius, fill, shadow) and a differentiated inverted header. Fixes header token variable names that previously referenced undefined CSS variables, and drops the bottom border on the last body row.
