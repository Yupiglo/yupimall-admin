"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  Receipt as OrderIcon,
  Person as CustomerIcon,
  CalendarToday as DateIcon,
  AttachMoney as TotalIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`orders/${decodedId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [decodedId]);

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      window.print();
    }
  }, [searchParams]);

  if (loading) return <Box sx={{ p: 4 }}>Loading order details...</Box>;
  if (!order) return <Box sx={{ p: 4 }}>Order not found.</Box>;

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "delivered":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
      case "shipped":
      case "paid":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/orders")}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Order Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Summarizing transaction details and item breakdown.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Print Order
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <OrderIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Order Summary
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {order.id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Payment
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                      {order.payment_method || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status) as any}
                      sx={{ fontWeight: "bold", borderRadius: "6px" }}
                    />
                  </Stack>
                  {order.distributor_id && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="warning.main" fontWeight="bold">
                        Distributor (MLM)
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="warning.main">
                        #{order.distributor_id}
                      </Typography>
                    </Stack>
                  )}
                  {order.stockist && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="primary.main" fontWeight="bold">
                        Stockist (Store)
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {order.stockist}
                      </Typography>
                    </Stack>
                  )}
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {order.total}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <CustomerIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Customer Info
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium">
                  {order.shipping_name || order.user?.name || "Anonymous"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {order.shipping_email || order.user?.email || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {order.shipping_phone || "N/A"}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Shipping Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shipping_street || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shipping_city || "N/A"}, {order.shipping_zip || ""}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {order.shipping_country || "N/A"}
                </Typography>
                <Button
                  startIcon={<ShippingIcon />}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: "8px", textTransform: "none" }}
                  onClick={() => router.push("/deliveries")}
                >
                  View Delivery
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold">
                  Order Items
                </Typography>
              </Box>
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "background.default" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Item Name
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Quantity
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Price
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(order.items || []).map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {item.product?.title || "Unknown Product"}
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          ${item.price?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!order.items?.length && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No items found for this order.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
