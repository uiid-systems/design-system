import { Timeline } from "@uiid/indicators";

export function TimelinePreview() {
  return (
    <Timeline
      activeIndex={2}
      items={[
        { title: "Order placed", time: "Jan 15, 9:00 AM" },
        { title: "Payment confirmed", description: "Visa ending in 4242", time: "Jan 15, 9:05 AM" },
        { title: "Shipped", description: "Package in transit", time: "Jan 16, 2:30 PM" },
        { title: "Out for delivery", time: "Pending" },
        { title: "Delivered" },
      ]}
    />
  );
}
