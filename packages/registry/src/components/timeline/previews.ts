import type { PreviewConfig } from "../../types";

export const timelinePreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "timeline",
      elements: {
        timeline: {
          key: "timeline",
          type: "Timeline",
          props: {
            activeIndex: 2,
            items: [
              { title: "Order placed", time: "Jan 15, 9:00 AM" },
              {
                title: "Payment confirmed",
                description: "Visa ending in 4242",
                time: "Jan 15, 9:05 AM",
              },
              {
                title: "Shipped",
                description: "Package in transit",
                time: "Jan 16, 2:30 PM",
              },
              { title: "Out for delivery" },
              { title: "Delivered" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Per-item color",
    tree: {
      root: "timeline",
      elements: {
        timeline: {
          key: "timeline",
          type: "Timeline",
          props: {
            activeIndex: 3,
            items: [
              { title: "Created", description: "Issue opened", color: "blue" },
              {
                title: "In progress",
                description: "Work started",
                color: "orange",
              },
              {
                title: "Review",
                description: "PR submitted",
                color: "purple",
              },
              { title: "Done", description: "Merged to main", color: "green" },
            ],
          },
        },
      },
    },
  },
];
