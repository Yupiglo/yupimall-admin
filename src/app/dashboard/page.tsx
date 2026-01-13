"use client";

import ProductChartMui from "@/components/dashboard/ProductChartMui";
import RecentRegistrations from "@/components/dashboard/RecentRegistrations";
import RecentDeliveries from "@/components/dashboard/RecentDeliveries";
import TopCustomers from "@/components/dashboard/TopCustomers";
import DualStatCard from "@/components/dashboard/DualStatCard";
import SalesByCountry from "@/components/dashboard/SalesByCountry";
import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import TopProductSales from "@/components/dashboard/TopProductSales";
import TeamMembers from "@/components/dashboard/TeamMembers";
import {
  Grid,
  Card,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import {
  People as PeopleIcon,
  ListAlt as OrdersIcon,
  LocalShipping as DeliveredIcon,
  Engineering as ActiveGuysIcon,
  AttachMoney as RevenueIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  FileDownload as ImportIcon,
  Send as DispatchIcon,
} from "@mui/icons-material";
import Link from "next/link";
import CardStats from "@/components/CardStats";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Order {
  id: string | number;
  user?: { name: string };
  status: string;
  total: number;
}

interface DashboardStats {
  stats?: {
    ordersCount?: number;
    ordersProcessing?: number;
    ordersPending?: number;
    ordersShipped?: number;
    ordersDelivered?: number;
    ordersPaid?: number;
    revenueTotal?: number;
    usersCount?: number;
    newUsersToday?: number;
    productsCount?: number;
    productsOutOfStock?: number;
    productsSold?: number;
    activeNow?: number;
  };
  recentOrders?: Order[];
}

type Props = {};

const page = (props: Props) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("admin/stats");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Dual stats cards data using REAL API data
  const stats = data?.stats;
  const dualStats = [
    {
      title: "Commandes",
      icon: <OrdersIcon />,
      value1: stats?.ordersProcessing || 0,
      label1: "En cours",
      value2: stats?.ordersDelivered || 0,
      label2: "Livrées",
      iconBgColor: "#e5e7eb",
    },
    {
      title: "Produits",
      icon: <InventoryIcon />,
      value1: stats?.productsCount || 0,
      label1: "Total",
      value2: stats?.productsOutOfStock || 0,
      label2: "Rupture",
      iconBgColor: "#e5e7eb",
    },
    {
      title: "Clients",
      icon: <PeopleIcon />,
      value1: stats?.usersCount || 0,
      label1: "Total",
      value2: stats?.newUsersToday || 0,
      label2: "Aujourd'hui",
      iconBgColor: "#d1fae5",
    },
    {
      title: "Revenus",
      icon: <RevenueIcon />,
      value1: `${((stats?.revenueTotal || 0) / 1000).toFixed(1)}k`,
      label1: "FCFA",
      value2: stats?.ordersPaid || 0,
      label2: "Payées",
      iconBgColor: "#e5e7eb",
    },
  ];


  const recentOrders = data?.recentOrders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Get current time for "Updated" display (client-side only to avoid hydration mismatch)
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const [currentTime, setCurrentTime] = useState<string>("");

  // Set time only on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Page Title Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
          >
            YupiMall Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.stats?.usersCount || 0} members
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Updated:
          </Typography>
          <Typography variant="body2" fontWeight="medium" color="text.primary">
            {currentTime}
          </Typography>
          <RefreshIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "pointer" }} />
        </Stack>
      </Box>

      {/* Dual Stats Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
        {dualStats.map((stat, index) => (
          <DualStatCard key={index} {...stat} />
        ))}
      </Box>

      {/* Sales by Country + Performance Overview Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
          gap: 3,
          mb: 4,
        }}
      >
        <SalesByCountry />
        <PerformanceOverview />
      </Box>

      {/* Top Product Sales + Team Members Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        <TopProductSales />
        <TeamMembers />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 4 }}>
        {/* Left Column - Main Content (Orders + Recent Activity) */}
        <Stack spacing={4}>
          {/* Recent Orders Table */}
          <Card>
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Recent Orders
              </Typography>
              <Button component={Link} href="/orders" size="small">
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "background.default" }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order: Order) => (
                    <TableRow key={order.id} hover>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: "medium" }}
                      >
                        #ORD-{order.id}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {order.user?.name || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            borderRadius: "100px",
                            px: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "medium" }}>
                        ${order.total?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No recent orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            <RecentRegistrations />
            <RecentDeliveries />
          </Box>
        </Stack>

        {/* Right Column - Top Lists */}
        <Stack spacing={4}>
          <TopCustomers />
        </Stack>
      </Box>
    </Box>
  );
};

export default page;
