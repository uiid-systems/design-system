# Sortable

> A list the user reorders by dragging, with a pointer, a finger or the keyboard. Built on dnd-kit.

Use Sortable when you want to:

- Let the user reorder a list, a row or a wrapping grid, with `orientation` (`vertical`, the default, `horizontal` or `mixed`)
- Hold the order yourself: pass `value` and take the new array from `onValueChange`, or take `onMove`'s `activeIndex` and `overIndex` and move the items yourself
- Drag by a grip with `SortableItemHandle`, or make the whole item the handle with `asHandle`
- Lock an item in place with `disabled` — its handle is disabled with it
- Show a copy of the item under the pointer with `SortableOverlay`, while the item itself holds its place

```tsx
<Sortable
  value={items}
  onValueChange={setItems}
  getItemValue={(item) => item.id}
>
  <SortableContent>
    {items.map((item) => (
      <SortableItem key={item.id} value={item.id}>
        <SortableItemHandle aria-label={`Reorder ${item.title}`}>
          <GripVerticalIcon />
        </SortableItemHandle>
        {item.title}
      </SortableItem>
    ))}
  </SortableContent>
</Sortable>
```

`value` can hold strings or numbers, which serve as their own ids, or objects, which need `getItemValue` to return each one's id. Each `SortableItem`'s `value` is that id, and must not be an empty string.

Every `SortableItem` sits inside `SortableContent`, which can wrap any layout, such as a `Stack` or a wrapping `Group`, or inside `SortableOverlay`, to render the dragged copy as an item too. `orientation` picks the axis the drag is held to, the sorting strategy and the collision detection; `strategy`, `modifiers` and `collisionDetection` override each one.

Each part writes `data-slot`, and an item and its handle write `data-dragging` while held and `data-disabled` when locked. A held item dims, and so does a locked one; pass `flatCursor` to keep the default cursor on the overlay instead of `grabbing`.

`SortableOverlay` renders into `document.body`, or into `container`. A function child receives `{ value }`, the id of the item being dragged; it renders nothing between drags.

Keyboard users focus a handle, press Space or Enter to pick the item up, move it with the arrow keys, and press Space or Enter again to drop it, or Escape to cancel. Sortable announces each step to screen readers; pass `accessibility` to replace the announcements. Give an icon-only handle an `aria-label`.

The remaining props are forwarded to dnd-kit's [`DndContext`](https://docs.dndkit.com/api-documentation/context-provider).
