"use client";

import { useState, useEffect } from "react";
import WidgetList, { WidgetItem } from "./WidgetList";
import axiosInstance from "@/lib/axios";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";

interface Delivery {
  id: string;
  status: string;
  updatedAt: string;
  trackingCode: string;
}

export default function RecentDeliveries() {
  const [deliveries, setDeliveries] = useState<WidgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get("admin/stats");
        const recentDeliveries = response.data.recentDeliveries || [];

        const mappedDeliveries = recentDeliveries.map((d: Delivery) => {
          let badgeColor = "info";
          if (d.status === "delivered") badgeColor = "success";
          if (d.status === "shipped") badgeColor = "primary";
          if (d.status === "cancelled") badgeColor = "error";

          return {
            id: d.id,
            title: `Commande #${d.id}`,
            subtitle: d.trackingCode ? `Suivi: ${d.trackingCode}` : "En transit",
            badge: d.status,
            badgeColor,
            value: d.updatedAt,
          };
        });

        setDeliveries(mappedDeliveries);
      } catch (error) {
        console.error("Failed to fetch recent deliveries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid #f3f4f6", boxShadow: "none" }}>
        <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: 200 }}>
          <CircularProgress size={32} />
        </CardContent>
      </Card>
    );
  }

  if (deliveries.length === 0) {
    return (
      <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid #f3f4f6", boxShadow: "none" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", minHeight: 200 }}>
          <Typography sx={{ fontSize: "2rem", mb: 1 }}>🚚</Typography>
          <Typography variant="body2" color="text.secondary">Aucune livraison récente</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <WidgetList
      title="Livraisons Récentes"
      items={deliveries}
      viewAllLink="/orders"
    />
  );
}
