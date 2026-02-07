import type { PreviewConfig } from "../../types";

export const timelinePreviews: PreviewConfig[] = [
  {
    label: "Vertical",
    tree: {
      root: "timeline",
      elements: {
        timeline: {
          key: "timeline",
          type: "Timeline",
          props: {
            orientation: "vertical",
            activeIndex: 2,
            items: [
              { title: "Order placed", time: "Jan 15, 9:00 AM" },
              { title: "Payment confirmed", description: "Visa ending in 4242", time: "Jan 15, 9:05 AM" },
              { title: "Shipped", description: "Package in transit", time: "Jan 16, 2:30 PM" },
              { title: "Out for delivery" },
              { title: "Delivered" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Horizontal",
    tree: {
      root: "timeline",
      elements: {
        timeline: {
          key: "timeline",
          type: "Timeline",
          props: {
            orientation: "horizontal",
            activeIndex: 1,
            items: [
              { title: "Draft" },
              { title: "Review" },
              { title: "Approved" },
              { title: "Published" },
            ],
          },
        },
      },
    },
  },
];
