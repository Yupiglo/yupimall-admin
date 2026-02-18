"use client";

import { useState, useEffect } from "react";
import WidgetList, { WidgetItem } from "./WidgetList";
import axiosInstance from "@/lib/axios";

export default function TopCouriers() {
  const [couriers, setCouriers] = useState<WidgetItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axiosInstance.get("delivery/personnel");
        const data = response.data?.personnel || response.data?.data || response.data || [];
        const items: WidgetItem[] = (Array.isArray(data) ? data : [])
          .slice(0, 5)
          .map((c: any, i: number) => ({
            id: c.id || i + 1,
            title: c.name || "Livreur",
            subtitle: `${c.totalDeliveries || 0} livraisons`,
            value: c.status || "—",
            image: c.avatar || c.image || undefined,
          }));
        setCouriers(items);
      } catch (err) {
        console.error("Failed to load couriers:", err);
      }
    };
    fetch();
  }, []);

  return (
    <WidgetList
      title="Top Livreurs"
      items={couriers}
      viewAllLink="/couriers"
    />
  );
}
