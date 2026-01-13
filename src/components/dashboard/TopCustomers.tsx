"use client";

import { useState, useEffect } from "react";
import WidgetList, { WidgetItem } from "./WidgetList";
import axiosInstance from "@/lib/axios";
import { CircularProgress, Box, Typography, Card, CardContent } from "@mui/material";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  image?: string;
}

export default function TopCustomers() {
  const [customers, setCustomers] = useState<WidgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("admin/stats");
        const topCustomers = response.data.topCustomers || [];

        const mappedCustomers = topCustomers.map((c: Customer, index: number) => ({
          id: c.id,
          title: c.name,
          subtitle: `${c.ordersCount} commandes`,
          value: `${(c.totalSpent / 1000).toFixed(1)}k FCFA`,
          image: c.image,
        }));

        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Failed to fetch top customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
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

  if (customers.length === 0) {
    return (
      <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid #f3f4f6", boxShadow: "none" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", minHeight: 200 }}>
          <Typography sx={{ fontSize: "2rem", mb: 1 }}>🏆</Typography>
          <Typography variant="body2" color="text.secondary">Aucun top client</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <WidgetList
      title="Top Clients"
      items={customers}
      viewAllLink="/customers"
    />
  );
}
