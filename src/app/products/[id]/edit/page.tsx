"use client";

import { use, useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Inventory as ProductIcon,
  AttachMoney as PriceIcon,
} from "@mui/icons-material";

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [formData, setFormData] = useState({
    name: "Classic Leather Jacket",
    category: "Clothing",
    sku: "JKT-001",
    price: "129.99",
    stock: "45",
    status: "Active",
    description:
      "High-quality genuine leather jacket with a classic finish and durable zippers.",
  });

  const handleSave = () => {
    console.log("Saving product:", formData);
    router.push(`/products/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push(`/products/${id}`)}
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
            Edit Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify product information, pricing, and stock.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          Save Changes
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
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
                <ProductIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  General Information
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Category"
                      select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Food">Food</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="SKU"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
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
                <PriceIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Pricing & Inventory
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Stock Level"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </TextField>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
