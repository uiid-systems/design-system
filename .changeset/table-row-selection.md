---
"@uiid/tables": patch
---

Add built-in row selection to Table. The header checkbox selects/clears all rows (with an indeterminate state for partial selection) and each row toggles individually. Selection state is isolated to a client boundary so the table markup stays server-renderable. Supports controlled (`selectedRows` + `onSelectedRowsChange`) and uncontrolled (`defaultSelectedRows`) usage, keyed by row index.
