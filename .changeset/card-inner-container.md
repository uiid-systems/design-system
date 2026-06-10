---
"@uiid/cards": patch
---

Refactor `Card` layout: wrap header items (icon, title/description, action) in `Stack` containers with a shared minimum height, push the action to the trailing edge with `ml="auto"`, and wrap `children` in a new `data-slot="card-inner-container"` `Stack` exposed via the optional `InnerContainerProps`.
