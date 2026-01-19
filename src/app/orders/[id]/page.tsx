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
  Delete as DeleteIcon,
  CheckCircle as ValidIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [openProofModal, setOpenProofModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // 8-Role Workflow Statuses
  const ORDER_STATUSES = [
    { value: "pending", label: "Pending (En attente)" },
    { value: "validated", label: "Validated (Validé - Info Warehouse)" },
    { value: "reached_warehouse", label: "Reached Warehouse (Arrivé Warehouse)" },
    { value: "shipped_to_stockist", label: "Shipped to Stockist (En route Stockiste)" },
    { value: "reached_stockist", label: "Reached Stockist (Arrivé Stockiste)" },
    { value: "out_for_delivery", label: "Out for Delivery (En Livraison)" },
    { value: "delivered", label: "Delivered (Livré)" },
    { value: "canceled", label: "Canceled (Annulé)" },
  ];

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

  useEffect(() => {
    fetchOrder();
  }, [decodedId]);

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      window.print();
    }
  }, [searchParams]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      await axiosInstance.put(`orders/${order._id || order.id}`, {
        order_status: newStatus,
      });
      fetchOrder(); // Refresh to get updated state/metadata if any
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleTogglePaid = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const isPaid = e.target.checked;
      setUpdating(true);
      await axiosInstance.put(`orders/${order._id || order.id}`, {
        is_paid: isPaid,
      });
      setOrder((prev: any) => ({ ...prev, isPaid: isPaid }));
    } catch (error) {
      console.error("Failed to update paid status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      setUpdating(true);
      await axiosInstance.delete(`orders/${order._id || order.id}`);
      router.push("/orders");
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order");
    } finally {
      setUpdating(false);
      setOpenDeleteModal(false);
    }
  };

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
            Manage order status, payments, and workflow interactions.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeleteModal(true)}
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "bold" }}
        >
          Delete
        </Button>
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
                      label={ORDER_STATUSES.find(s => s.value === order.orderStatus)?.label || order.orderStatus}
                      size="small"
                      color={getStatusColor(order.orderStatus) as any}
                      sx={{ fontWeight: "bold", borderRadius: "6px" }}
                    />
                  </Stack>

                  <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: "12px" }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Workflow Actions
                    </Typography>
                    <Stack spacing={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Update Status</InputLabel>
                        <Select
                          value={order.orderStatus}
                          label="Update Status"
                          onChange={(e) => handleUpdateStatus(e.target.value)}
                          disabled={updating}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={order.isPaid}
                            onChange={handleTogglePaid}
                            disabled={updating}
                            color="success"
                          />
                        }
                        label={
                          <Typography variant="body2" fontWeight="medium">
                            Payment Received (Is Paid)
                          </Typography>
                        }
                      />

                      {order.paymentProof && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ImageIcon />}
                          onClick={() => setOpenProofModal(true)}
                          sx={{ textTransform: "none", borderRadius: "8px" }}
                        >
                          View Payment Proof
                        </Button>
                      )}
                    </Stack>
                  </Box>
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
      {/* Payment Proof Modal */}
      <Dialog open={openProofModal} onClose={() => setOpenProofModal(false)} maxWidth="md">
        <DialogTitle>Payment Proof</DialogTitle>
        <DialogContent>
          <img
            src={`${API_URL}/storage/${order.paymentProof}`}
            alt="Payment Proof"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProofModal(false)}>Close</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleUpdateStatus('validated');
              setOpenProofModal(false);
            }}
          >
            Validate Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Order?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order #{order.id}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
