"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Avatar,
  Stack,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingDown as StockLowIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface Product {
  _id: string;
  title: string;
  category?: { _id: string; name: string };
  sku?: string;
  price: number;
  quantity: number;
  imgCover?: string;
  sold?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch categories
        const catRes = await axiosInstance.get("categories");
        setCategories(catRes.data.getAllCategories || []);

        // Fetch products
        const prodRes = await axiosInstance.get("products");
        setProducts(prodRes.data.products || []);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category?._id === selectedCategory);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Rupture", color: "error" as const };
    if (quantity < 10) return { label: "Stock bas", color: "warning" as const };
    return { label: "En stock", color: "success" as const };
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await axiosInstance.delete(`products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={3}>
      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tous" value="all" />
          {categories.map((cat) => (
            <Tab key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Tabs>
      </Box>

      {/* Products Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Produit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Catégorie</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Prix</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Vendu</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Aucun produit trouvé
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.quantity);
              const imageUrl = product.imgCover
                ? product.imgCover.startsWith("http")
                  ? product.imgCover
                  : `${process.env.NEXT_PUBLIC_API_URL}/${product.imgCover}`
                : undefined;

              return (
                <TableRow
                  key={product._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={imageUrl}
                        sx={{ width: 48, height: 48, borderRadius: "12px" }}
                      >
                        {product.title?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {product.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: #{product._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category?.name || "Non classé"}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {product.price?.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: product.quantity < 10 ? "bold" : "medium" }}
                      >
                        {product.quantity}
                      </Typography>
                      {product.quantity < 10 && product.quantity > 0 && (
                        <Tooltip title="Stock bas">
                          <StockLowIcon color="warning" sx={{ fontSize: 16 }} />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{product.sold || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Voir détails">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/products/${product._id}`)}
                        >
                          <ViewIcon fontSize="small" color="action" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => router.push(`/products/${product._id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stats Footer */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} produit(s)
        </Typography>
        {selectedCategory !== "all" && (
          <Typography variant="body2" color="text.secondary">
            sur {products.length} au total
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
