"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useDeliveryPersonnel } from "@/hooks/useDeliveries";

interface AddDeliveryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddDeliveryModal({ open, onClose }: AddDeliveryModalProps) {
  const { personnel, loading: couriersLoading } = useDeliveryPersonnel();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    courierId: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("orders/all");
        const data = response.data?.orders?.data || response.data?.orders || response.data?.data || [];
        const pending = (Array.isArray(data) ? data : []).filter(
          (o: any) => o.status === "pending" || o.status === "validated"
        );
        setOrders(pending);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (open) fetchOrders();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axiosInstance.post(`delivery/assign/${formData.orderId}`, {
        delivery_person_id: formData.courierId,
        address: formData.address,
        notes: formData.notes,
      });
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", backgroundImage: "none" } }}
    >
      <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", fontSize: "1.25rem" }}>
        Nouvelle Livraison
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 24, color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              select
              label="Sélectionner une commande"
              required
              fullWidth
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              disabled={ordersLoading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {ordersLoading ? (
                <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Chargement...</MenuItem>
              ) : orders.length > 0 ? (
                orders.map((order: any) => (
                  <MenuItem key={order.id} value={order.id}>
                    #{order.trackingCode || order.id} — {order.customer || order.user_name || "Client"}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucune commande en attente</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Assigner un livreur"
              required
              fullWidth
              value={formData.courierId}
              onChange={(e) => setFormData({ ...formData, courierId: e.target.value })}
              disabled={couriersLoading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {couriersLoading ? (
                <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Chargement...</MenuItem>
              ) : personnel.length > 0 ? (
                personnel.map((courier) => (
                  <MenuItem key={courier.id} value={courier.id}>
                    {courier.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun livreur disponible</MenuItem>
              )}
            </TextField>

            <TextField
              label="Adresse de livraison"
              required
              fullWidth
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "10px", px: 3, py: 1.5, color: "text.secondary" }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "10px", px: 4, py: 1.5, boxShadow: "none" }}
          >
            {submitting ? <CircularProgress size={20} /> : "Créer la livraison"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
