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
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

interface AddEntryModalProps {
  open: boolean;
  onClose: (entryAdded?: boolean) => void;
}

interface Product {
  id: number;
  title: string;
  quantity: number;
}

export default function AddEntryModal({ open, onClose }: AddEntryModalProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    unit_price: "",
    supplier: "",
    reference: "",
    notes: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
      resetForm();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/products", { params: { per_page: 100 } });
      setProducts(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      quantity: "",
      unit_price: "",
      supplier: "",
      reference: "",
      notes: "",
    });
    setSelectedProduct(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_id || !formData.quantity) {
      setError("Please select a product and enter a quantity");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await axios.post("/stock/entries", {
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
        supplier: formData.supplier || null,
        reference: formData.reference || null,
        notes: formData.notes || null,
      });

      onClose(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create stock entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
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
        New Stock Entry
        <IconButton
          onClick={() => onClose(false)}
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
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => `${option.title} (Stock: ${option.quantity})`}
              value={selectedProduct}
              onChange={(_, newValue) => {
                setSelectedProduct(newValue);
                setFormData({ ...formData, product_id: newValue?.id.toString() || "" });
              }}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Quantity"
              type="number"
              required
              fullWidth
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              inputProps={{ min: 1 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Unit Price (XOF)"
              type="number"
              fullWidth
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({ ...formData, unit_price: e.target.value })
              }
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Supplier"
              fullWidth
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Reference (Invoice/Document)"
              fullWidth
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
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
            onClick={() => onClose(false)}
            disabled={submitting}
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
            disabled={submitting}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 4,
              boxShadow: "none",
            }}
          >
            {submitting ? <CircularProgress size={24} /> : "Add Entry"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
