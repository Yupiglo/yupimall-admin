"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  LocalShipping as DeliveryIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

export default function DeliveryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [formData, setFormData] = useState({
    status: "",
    courier: "",
    notes: "",
  });
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orderRes, couriersRes] = await Promise.all([
          axiosInstance.get(`orders/${decodedId}`),
          axiosInstance.get(`delivery/personnel`),
        ]);

        if (orderRes.data.message === 'success') {
          const orderData = orderRes.data.order;
          setFormData({
            status: orderData.order_status || orderData.status || "",
            courier: orderData.delivery_person_id?.toString() || "",
            notes: orderData.delivery_notes || "",
          });
        }

        if (couriersRes.data.personnel) {
          setCouriers(couriersRes.data.personnel || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load delivery data");
      } finally {
        setLoading(false);
      }
    };

    if (decodedId) {
      fetchData();
    }
  }, [decodedId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Update order status if changed
      if (formData.status) {
        await axiosInstance.put(`orders/${decodedId}/status`, { 
          status: formData.status 
        });
      }

      // Assign courier if changed
      if (formData.courier) {
        await axiosInstance.post(`/delivery/assign/${decodedId}`, {
          delivery_person_id: formData.courier ? parseInt(formData.courier) : null,
        });
      }

      router.push(`/deliveries/${encodeURIComponent(decodedId)}`);
    } catch (err) {
      console.error("Error saving delivery:", err);
      setError("Failed to save delivery changes");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.status) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/deliveries")}>
          Back to Deliveries
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/deliveries/${encodeURIComponent(decodedId)}`)
          }
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
            Modify Delivery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign courier and update live delivery status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
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
                <DeliveryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Assignment & Status
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Delivery Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="reached_warehouse">Reached Warehouse</MenuItem>
                  <MenuItem value="shipped_to_stockist">Shipped to Stockist</MenuItem>
                  <MenuItem value="reached_stockist">Reached Stockist</MenuItem>
                  <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Assign Courier"
                  value={formData.courier}
                  onChange={(e) =>
                    setFormData({ ...formData, courier: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="">None</MenuItem>
                  {couriers.map((courier) => (
                    <MenuItem key={courier.id} value={courier.id.toString()}>
                      {courier.name}
                    </MenuItem>
                  ))}
                </TextField>
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Delivery Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Specific notes for the courier regarding this delivery.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter special instructions..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
