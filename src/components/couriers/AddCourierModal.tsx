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

interface AddCourierModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCourierModal({
  open,
  onClose,
}: AddCourierModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    documentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nuevo repartidor:", formData);
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
        Register New Courier
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
              label="Full Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Phone Number"
              required
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              select
              label="Vehicle Type"
              required
              fullWidth
              value={formData.vehicle}
              onChange={(e) =>
                setFormData({ ...formData, vehicle: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              <MenuItem value="Motorcycle">Motorcycle</MenuItem>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Bicycle">Bicycle</MenuItem>
            </TextField>

            <TextField
              label="Document ID / License"
              required
              fullWidth
              value={formData.documentId}
              onChange={(e) =>
                setFormData({ ...formData, documentId: e.target.value })
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
            Register Courier
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
