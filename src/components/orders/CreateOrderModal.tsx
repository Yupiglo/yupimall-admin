"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Stack,
  MenuItem,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useState, useMemo, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Product {
  id: number;
  label: string;
  price: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({
  open,
  onClose,
}: CreateOrderModalProps) {
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { productId: 0, quantity: 1 },
  ]);
  const [confirmed, setConfirmed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("products");
        const data = response.data?.products?.data || response.data?.products || response.data?.data || response.data || [];
        setProducts(
          (Array.isArray(data) ? data : []).map((p: any) => ({
            id: p.id,
            label: p.name || p.title || "Produit",
            price: parseFloat(p.sale_price || p.price || 0),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    if (open) fetchProducts();
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { productId: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [{ productId: 0, quantity: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [items, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Order:", {
      customer,
      description,
      items: items.filter((item) => item.productId !== 0),
      confirmed,
      totalAmount,
    });
    onClose();
    // Reset state
    setCustomer("");
    setDescription("");
    setItems([{ productId: 0, quantity: 1 }]);
    setConfirmed(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              p: 1,
              borderRadius: "10px",
              display: "flex",
            }}
          >
            <CartIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Create New Order
          </Typography>
        </Stack>
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
          <Stack spacing={3}>
            {/* Customer & Description */}
            <TextField
              label="Customer Name"
              placeholder="Nom du client"
              fullWidth
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Description"
              placeholder="Enter order details or notes..."
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Order Items
              </Typography>
              <Stack spacing={2}>
                {items.map((item, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <TextField
                        select
                        fullWidth
                        label="Product"
                        value={item.productId || ""}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "productId",
                            Number(e.target.value)
                          )
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select a product
                        </MenuItem>
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.label} (${product.price.toFixed(2)})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                        }}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1 && item.productId === 0}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Stack>

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Add another product
              </Button>
            </Box>

            {/* Total Display */}
            <Box
              sx={{
                bgcolor: "action.hover",
                p: 2.5,
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total Amount
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                $
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I confirm this order is ready to be processed
                </Typography>
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
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
            disabled={!customer || items.every((i) => i.productId === 0)}
            sx={{
              borderRadius: "10px",
              px: 4,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Create Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
