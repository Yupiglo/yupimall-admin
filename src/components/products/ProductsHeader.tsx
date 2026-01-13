"use client";

import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from "@mui/icons-material";

import { useState } from "react";
import AddProductModal from "./AddProductModal";

const bestSellers = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    sales: 124,
    growth: "+12.5%",
    image:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    sales: 98,
    growth: "+8.2%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    sales: 85,
    growth: "+15.0%",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
  },
];

export default function ProductsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your inventory and product details.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Best Selling Products Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "text.tertio" }}
        >
          <StarIcon color="warning" fontSize="small" /> Best Selling Products
        </Typography>
        <Grid container spacing={2}>
          {bestSellers.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      variant="rounded"
                      src={product.image}
                      sx={{ width: 48, height: 48, borderRadius: "12px" }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {product.name}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {product.sales} sales
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <TrendingUpIcon
                            color="success"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="success.main"
                          >
                            {product.growth}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 4 }}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "background.paper",
            },
          }}
        />
        <Stack direction="row" spacing={2} sx={{ minWidth: { md: 400 } }}>
          <TextField
            select
            fullWidth
            defaultValue="all"
            label="Category"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="clothing">Clothing</MenuItem>
            <MenuItem value="food">Food & Beverage</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            defaultValue="all"
            label="Status"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            <MenuItem value="discontinued">Discontinued</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
