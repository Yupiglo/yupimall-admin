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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";

interface AddDeliveryModalProps {
  open: boolean;
  onClose: () => void;
}

const mockOrders = [
  { id: "#ORD-9921", customer: "Alice Johnson" },
  { id: "#ORD-9920", customer: "Mark Spencer" },
  { id: "#ORD-9919", customer: "Elena Gomez" },
];

const mockCouriers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Tyson" },
];

export default function AddDeliveryModal({
  open,
  onClose,
}: AddDeliveryModalProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    courierId: "",
    address: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nueva entrega:", formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", fontSize: "1.25rem" }}>
        Assign New Delivery
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 24,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              select
              label="Select Order"
              required
              fullWidth
              value={formData.orderId}
              onChange={(e) =>
                setFormData({ ...formData, orderId: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {mockOrders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {order.id} - {order.customer}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign Courier"
              required
              fullWidth
              value={formData.courierId}
              onChange={(e) =>
                setFormData({ ...formData, courierId: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {mockCouriers.map((courier) => (
                <MenuItem key={courier.id} value={courier.id}>
                  {courier.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Delivery Address"
              required
              fullWidth
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Notes"
              multiline
              rows={2}
              fullWidth
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 3,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 4,
              boxShadow: "none",
            }}
          >
            Create Delivery
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
