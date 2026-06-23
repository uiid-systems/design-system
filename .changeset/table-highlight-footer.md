---
"@uiid/tables": patch
---

Add row highlighting and a footer slot to Table. Selected rows are highlighted (driven by the checkbox state via CSS so rows stay server-rendered), a new `highlightOnHover` prop enables hover highlighting, and the two coexist. Also fixes `striped` rows being invisible against the table's own surface, and adds a `footer` slot rendered in a `<tfoot>` spanning all columns.
