"use client";

import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  People as CustomersIcon,
  PersonAdd as NewCustomerIcon,
  ShoppingBag as OrderIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import AddCustomerModal from "./AddCustomerModal";
import axiosInstance from "@/lib/axios";

interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  activeOrders: number;
}

export default function CustomersHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    newThisMonth: 0,
    activeOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users to calculate customer stats
        const response = await axiosInstance.get("users");
        let allUsers: any[] = [];
        if (Array.isArray(response.data)) {
          allUsers = response.data;
        } else if (response.data?.users && Array.isArray(response.data.users)) {
          allUsers = response.data.users;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          allUsers = response.data.data;
        }

        const consumers = allUsers.filter((u: any) => u.role === "consumer" || !u.role);

        // Calculate new customers this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = consumers.filter((u: any) => {
          const createdAt = new Date(u.created_at);
          return createdAt >= startOfMonth;
        }).length;

        // Try to get orders count
        let activeOrders = 0;
        try {
          const ordersRes = await axiosInstance.get("orders?status=pending");
          if (Array.isArray(ordersRes.data)) {
            activeOrders = ordersRes.data.length;
          } else if (ordersRes.data?.data) {
            activeOrders = ordersRes.data.data.length;
          } else if (ordersRes.data?.orders) {
            activeOrders = ordersRes.data.orders.length;
          }
        } catch {
          activeOrders = 0;
        }

        setStats({
          totalCustomers: consumers.length,
          newThisMonth,
          activeOrders,
        });
      } catch (err) {
        console.error("Failed to fetch customer stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const customerStats = [
    {
      id: 1,
      label: "Total Customers",
      value: loading ? "..." : stats.totalCustomers.toLocaleString(),
      icon: <CustomersIcon />,
      color: "primary",
    },
    {
      id: 2,
      label: "New This Month",
      value: loading ? "..." : stats.newThisMonth.toString(),
      icon: <NewCustomerIcon />,
      color: "success",
    },
    {
      id: 3,
      label: "Active Orders",
      value: loading ? "..." : stats.activeOrders.toString(),
      icon: <OrderIcon />,
      color: "warning",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Customers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer database and relationship.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "none",
          }}
        >
          Add Customer
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.tertio",
          }}
        >
          <CustomersIcon color="primary" fontSize="small" /> Customer Summary
        </Typography>
        <Grid container spacing={3}>
          {customerStats.map((stat) => (
            <Grid key={stat.id} size={{ xs: 12, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? `${stat.color}.dark`
                            : `${stat.color}.light`,
                        color: `${stat.color}.tertio`,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        {stat.label}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        {loading && (
                          <CircularProgress size={14} />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <TextField
        placeholder="Search by name, email, or order ID..."
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "background.paper",
          },
        }}
      />

      <AddCustomerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
