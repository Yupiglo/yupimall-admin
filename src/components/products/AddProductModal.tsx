"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  SquareFoot as BoxIcon,
  NotificationsActive as ThresholdIcon,
} from "@mui/icons-material";
import { useState } from "react";

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddProductModal({
  open,
  onClose,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    image: "",
    quantity: "",
    quantityPerBox: "",
    unitPrice: "",
    threshold: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting product:", formData);
    // Mocking success
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
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add New Product
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Grid container spacing={3}>
            {/* Label */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="label"
                label="Product Label"
                fullWidth
                required
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g. Premium Leather Jacket"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the product features, materials, etc."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Image URL (Mocking upload for now) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="image"
                label="Image URL"
                fullWidth
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <UploadIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Quantity and Quantity per Box */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="quantity"
                label="Initial Quantity"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="quantityPerBox"
                label="Qty per Box"
                type="number"
                fullWidth
                value={formData.quantityPerBox}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BoxIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Unit Price and Threshold */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="unitPrice"
                label="Unit Price"
                type="number"
                fullWidth
                required
                value={formData.unitPrice}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="threshold"
                label="Low Stock Threshold"
                type="number"
                fullWidth
                value={formData.threshold}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ThresholdIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
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
            color="primary"
            sx={{
              borderRadius: "10px",
              px: 4,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Add Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
