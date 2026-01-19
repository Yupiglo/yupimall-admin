"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Avatar,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export default function OrdersTable() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("orders/all");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`orders/${deleteId}`);
      setOrders(prev => prev.filter(o => o._id !== deleteId && o.id !== deleteId));
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order");
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "delivered":
      case "completed":
        return "success";
      case "pending":
      case "unpaid":
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
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: "16px", overflow: "hidden" }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
                transition: "0.2s",
              }}
            >
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  #ORD-{order.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.8rem",
                      bgcolor: "primary.light",
                    }}
                  >
                    {(order.user?.name || order.shipping_name || "?").charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight="medium">
                    {order.user?.name || order.shipping_name || "Anonymous"}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  ${order.total?.toLocaleString() || "0"}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  size="small"
                  color={getStatusColor(order.status) as any}
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    borderRadius: "100px",
                    px: 0.5,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(`/orders/${encodeURIComponent(order.id)}`)
                      }
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Order">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/orders/${encodeURIComponent(order.id)}?print=true`
                        )
                      }
                    >
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(order._id || order.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {loading && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                  Loading orders...
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                  No orders found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
