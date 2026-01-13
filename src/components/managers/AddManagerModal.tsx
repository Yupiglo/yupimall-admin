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
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

interface AddManagerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLES = [
  { value: "dev", label: "Developer", description: "Full system access" },
  { value: "super_admin", label: "Super Admin", description: "Administrative access" },
  { value: "webmaster", label: "Webmaster", description: "Website management" },
  { value: "stockist", label: "Stockist", description: "Inventory management" },
  { value: "warehouse", label: "Warehouse", description: "Warehouse operations" },
  { value: "delivery", label: "Delivery", description: "Delivery operations" },
  { value: "distributor", label: "Distributor", description: "Distribution network" },
  { value: "consumer", label: "Consumer", description: "Customer account" },
];

export default function AddManagerModal({
  open,
  onClose,
  onSuccess,
}: AddManagerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "warehouse",
    phone: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "warehouse",
      phone: "",
      username: "",
    });
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || null,
        username: formData.username || null,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Create New User
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 16,
            top: 20,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
              User created successfully!
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading || success}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Username"
              fullWidth
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              disabled={loading || success}
              placeholder="Optional"
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
              disabled={loading || success}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading || success}
              helperText="Minimum 6 characters"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              select
              label="Role"
              required
              fullWidth
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              disabled={loading || success}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Stack>
                    <span style={{ fontWeight: 500 }}>{role.label}</span>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      {role.description}
                    </span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={loading || success}
              placeholder="Optional"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            variant="text"
            disabled={loading}
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
            disabled={loading || success}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 4,
              boxShadow: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create User"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
