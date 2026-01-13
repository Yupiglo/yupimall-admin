"use client";

import WidgetList, { WidgetItem } from "./WidgetList";

const topCouriers: WidgetItem[] = [
  {
    id: 1,
    title: "Mike Ross",
    subtitle: "⭐ 4.9 • 320 Deliveries",
    value: "Online",
    image: "https://i.pravatar.cc/150?u=mikeross",
    badge: "Top Rated",
    badgeColor: "warning",
  },
  {
    id: 2,
    title: "Harvey Specter",
    subtitle: "⭐ 4.8 • 290 Deliveries",
    value: "Busy",
    image: "https://i.pravatar.cc/150?u=harvey",
  },
  {
    id: 3,
    title: "Rachel Zane",
    subtitle: "⭐ 4.9 • 250 Deliveries",
    value: "Offline",
    image: "https://i.pravatar.cc/150?u=rachel",
  },
  {
    id: 4,
    title: "Louis Litt",
    subtitle: "⭐ 4.7 • 210 Deliveries",
    value: "Online",
    image: "https://i.pravatar.cc/150?u=louis",
  },
  {
    id: 5,
    title: "Donna Paulsen",
    subtitle: "⭐ 5.0 • 180 Deliveries",
    value: "Online",
    image: "https://i.pravatar.cc/150?u=donna",
  },
];

export default function TopCouriers() {
  return (
    <WidgetList
      title="Top 5 Couriers"
      items={topCouriers}
      viewAllLink="/couriers"
    />
  );
}
