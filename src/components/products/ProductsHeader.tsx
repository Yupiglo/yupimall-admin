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
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Shuffle as ShuffleIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import AddProductModal from "./AddProductModal";
import axiosInstance from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  id: string;
  _id?: string;
  name: string;
  slug?: string;
}

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

type ProductsHeaderProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
};

export default function ProductsHeader({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedStatus,
  setSelectedStatus,
}: ProductsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== "all") {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
      setSelectedSubcategory("all");
    }
  }, [selectedCategory, setSelectedSubcategory]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("categories");
      const cats = response.data.getAllCategories || response.data.categories || response.data || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      setLoadingSubs(true);
      const response = await axiosInstance.get(`categories/${categoryId}/subcategories`);
      const subs = response.data.getAllSubCategories || response.data.subcategories || response.data || [];
      setSubcategories(Array.isArray(subs) ? subs : []);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleShuffle = async () => {
    if (!confirm("Voulez-vous vraiment mélanger l'ordre de TOUS les produits ? Cela affectera l'affichage sur le site.")) return;
    try {
      await axiosInstance.post('/products/shuffle');
      alert("Produits mélangés avec succès ! Rechargement...");
      window.location.reload(); // Simple reload to reflect changes
    } catch (error) {
      console.error("Shuffle failed:", error);
      alert("Erreur lors du mélange.");
    }
  };

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
        <Stack direction="row" spacing={2}>
          {selectedCategory === "all" && (
            <Button
              variant="outlined"
              startIcon={<ShuffleIcon />}
              onClick={handleShuffle}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "divider",
                color: "text.secondary"
              }}
            >
              Mélanger (Shuffle)
            </Button>
          )}
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
          placeholder="Rechercher..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { md: 200 },
            maxWidth: { md: 280 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "background.paper",
            },
          }}
        />
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <TextField
            select
            fullWidth
            label="Catégorie"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="all">Toutes les catégories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Sous-catégorie"
            value={selectedSubcategory || "all"}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={selectedCategory === "all" || loadingSubs}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="all">Toutes les sous-catégories</MenuItem>
            {loadingSubs ? (
              <MenuItem disabled><CircularProgress size={20} /></MenuItem>
            ) : (
              subcategories.map((sub) => (
                <MenuItem key={sub.id || sub._id} value={sub.id || sub._id}>
                  {sub.name}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            fullWidth
            label="Statut"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="in_stock">En stock</MenuItem>
            <MenuItem value="low_stock">Stock bas</MenuItem>
            <MenuItem value="out_of_stock">Rupture</MenuItem>
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
