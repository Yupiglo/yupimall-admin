"use client";

import {
  Box,
  TextField,
  InputAdornment,
  Stack,
  Button,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as OrderIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Update as ProcessingIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import CreateOrderModal from "./CreateOrderModal";
import axiosInstance from "@/lib/axios";

const statuses = [
  "All Status",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const timeRanges = [
  "Today",
  "This Week",
  "This Month",
  "Last 3 Months",
  "All Time",
];

export default function OrdersHeader() {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("admin/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch order summary stats:", error);
      }
    };
    fetchStats();
  }, []);

  const orderStats = [
    {
      id: 1,
      label: "Total Orders",
      count: stats?.ordersCount || 0,
      growth: "Real-time",
      icon: <OrderIcon />,
      color: "warning",
    },
    {
      id: 2,
      label: "Revenue",
      count: stats?.revenueTotal ? `$${stats.revenueTotal.toLocaleString()}` : "$0",
      growth: "Gross",
      icon: <TrendingUpIcon />,
      color: "info",
    },
    {
      id: 3,
      label: "Active Users",
      count: stats?.usersCount || 0,
      growth: "Customers",
      icon: <PendingIcon />,
      color: "success",
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
            Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all customer orders in one place.
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
          }}
        >
          Create Order
        </Button>
      </Stack>

      {/* Order Statistics Stats */}
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
          <OrderIcon color="warning" fontSize="small" /> Order Summary
        </Typography>
        <Grid container spacing={2}>
          {orderStats.map((stat) => (
            <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                      variant="rounded"
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
                          {stat.count}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <TrendingUpIcon
                            color="success"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="success.main"
                          >
                            {stat.growth}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 4 }}>
        <TextField
          placeholder="Search Order ID or Customer..."
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
        <Stack direction="row" spacing={2} sx={{ minWidth: { md: 450 } }}>
          <TextField
            select
            fullWidth
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            label="Time Range"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            {timeRanges.map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      <CreateOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
