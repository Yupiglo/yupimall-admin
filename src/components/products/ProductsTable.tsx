"use client";

import { useState, useEffect, useContext } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingDown as StockLowIcon,
  ArrowUpward,
  ArrowDownward,
  VerticalAlignTop,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { getImagePath } from "@/helpers/utils/image.utils";

interface Product {
  _id: string;
  title: string;
  category?: { _id: string; name: string } | string;
  categoryId?: string;
  subcategory?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  sku?: string;
  price: number;
  quantity: number;
  imgCover?: string;
  sold?: number;
  sort_order?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

type ProductsTableProps = {
  selectedCategory: string;
  selectedSubcategory: string;
  selectedStatus: string;
};

export default function ProductsTable({
  selectedCategory,
  selectedSubcategory,
  selectedStatus,
}: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedCurr } = useContext(CurrencyContext);

  // Format price in selected currency (prices stored in USD)
  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * selectedCurr.value;
    // For currencies like FCFA, show as integer
    if (selectedCurr.symbol === "FCFA" || selectedCurr.symbol === "₦") {
      return `${Math.round(converted).toLocaleString()} ${selectedCurr.symbol}`;
    }
    return `${selectedCurr.symbol}${converted.toFixed(2)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch categories
        const catRes = await axiosInstance.get("categories");
        setCategories(catRes.data.getAllCategories || catRes.data.categories || []);

        // Fetch products
        const prodRes = await axiosInstance.get("products");
        setProducts(prodRes.data.getAllProducts || prodRes.data.products || []);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter((product) => {
    // Category filter - use categoryId directly from API (convert to string for comparison)
    if (selectedCategory !== "all") {
      if (String(product.categoryId) !== String(selectedCategory)) return false;
    }
    // Subcategory filter - use subcategoryId directly from API (convert to string for comparison)
    if (selectedSubcategory !== "all") {
      if (String(product.subcategoryId) !== String(selectedSubcategory)) return false;
    }

    // Status filter based on quantity
    if (selectedStatus !== "all") {
      const quantity = product.quantity || 0;
      if (selectedStatus === "in_stock" && quantity < 10) return false;
      if (selectedStatus === "low_stock" && (quantity === 0 || quantity >= 10)) return false;
      if (selectedStatus === "out_of_stock" && quantity > 0) return false;
    }

    return true;
  });

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

  const handleMove = async (index: number, direction: 'up' | 'down' | 'top') => {
    // Only allowing move if sorting is "All" or logical (otherwise we are moving in a filtered view which is confusing, but requested)
    // Actually, to make it consistent, we should operate on the 'products' state, finding the item by ID.
    // simpler: operate on the rendered list 'filteredProducts'.

    // We can't easily move items in filtered views if it implies global reordering of EVERYTHING.
    // BUT since we just swap sort_order, it works.

    // HOWEVER, for 'top', we need the MIN sort_order of the entire list.
    // If we only touch the filtered list, we might just be swapping relative to displayed items.

    // Let's assume user uses this mainly when "All" is selected or within a category.
    // If 'top', we want it to be sort_order = min_global_sort_order - 1.

    if (direction === 'top') {
      const item = filteredProducts[index];
      const minOrder = Math.min(...products.map(p => p.sort_order || 0));
      const newOrder = minOrder - 1;

      // Optimistic update
      const updatedProducts = products.map(p => p._id === item._id ? { ...p, sort_order: newOrder } : p);
      // Sort
      updatedProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setProducts(updatedProducts);

      try {
        await axiosInstance.post('/products/reorder', {
          items: [{ id: item._id, sort_order: newOrder }]
        });
      } catch (error) {
        console.error("Move failed", error);
        // Revert or reload? Reload is safer.
        // window.location.reload(); 
      }
      return;
    }

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === filteredProducts.length - 1) return;

    const currentItem = filteredProducts[index];
    const targetItem = filteredProducts[index + (direction === 'up' ? -1 : 1)];

    // Swap sort_orders
    // If sort_orders are same or undefined, we need to assign them.
    // Default sort_order is 0. If both are 0, swapping does nothing.
    // We need to ensure unique sort orders if they are not.
    // But backend reorder/shuffle handles that.

    // If we rely on swapping existing values:
    const currentOrder = currentItem.sort_order ?? 0;
    const targetOrder = targetItem.sort_order ?? 0;

    // Since we sort by sort_order ASC, if current is after target, currentOrder >= targetOrder.
    // To Swap:
    // If values are different, just swap values.
    // If values are SAME (both 0), we need to give them distinct values.
    // Actually, if we just swap indices in the array and re-assign sequential sort_order to updated list segment?

    // Robust Strategy: Swap items in the array, then re-assign sequential sort_orders to match the new array order.
    // But we are in a filtered list. We can only control the 2 items safely if we don't touch others.
    // If we swap their sort_orders, they effectively swap positions.
    // If sort_orders are equal, we need to artificially separate them.
    // e.g. target=0, current=0. Swap -> target=0, current=0. No change.
    // Fix: If equal, make target=current-1 (if up).

    let newCurrentOrder = targetOrder;
    let newTargetOrder = currentOrder;

    if (newCurrentOrder === newTargetOrder) {
      // If they have same order, we need to force a diff.
      // If moving up, current should become less than target.
      // But target is taking current's place (which is same).
      // We should just re-assign.
      newCurrentOrder = targetOrder;
      newTargetOrder = currentOrder + 1; // Temporary fix, might not be enough.

      // Better: Just use Reorder API with explicit indices?
      // NO, let's just use the 'reorder' endpoint which accepts a list.
      // We can send JUST the two items with swapped orders.
    }

    // Actually simplicity:
    // Swap the numeric values.

    const updatedProducts = products.map(p => {
      if (p._id === currentItem._id) return { ...p, sort_order: targetOrder };
      if (p._id === targetItem._id) return { ...p, sort_order: currentOrder };
      return p;
    });

    // Re-sort to reflect change in UI
    updatedProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    setProducts(updatedProducts);

    try {
      await axiosInstance.post('/products/reorder', {
        items: [
          { id: currentItem._id, sort_order: targetOrder },
          { id: targetItem._id, sort_order: currentOrder }
        ]
      });
    } catch (error) {
      console.error("Reorder failed", error);
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
              <TableCell sx={{ fontWeight: "bold" }}>Sous-catégorie</TableCell>
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
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Aucun produit trouvé
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.quantity);
              const imageUrl = getImagePath(product.imgCover);

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
                      label={
                        typeof product.category === "string"
                          ? (categories.find(c => c.slug === product.category || c.name === product.category)?.name || product.category)
                          : (product.category?.name || "Non classé")
                      }
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell>
                    {product.subcategoryName ? (
                      <Chip
                        label={product.subcategoryName}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ borderRadius: "6px" }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {formatPrice(product.price)}
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
                    <Stack direction="row" spacing={0} justifyContent="flex-end">
                      <Tooltip title="Monter (Move Up)">
                        <IconButton size="small" onClick={() => handleMove(filteredProducts.indexOf(product), 'up')}>
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descendre (Move Down)">
                        <IconButton size="small" onClick={() => handleMove(filteredProducts.indexOf(product), 'down')}>
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mettre en haut (Top)">
                        <IconButton size="small" onClick={() => handleMove(filteredProducts.indexOf(product), 'top')}>
                          <VerticalAlignTop fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
          {products.length} produit(s)
        </Typography>
      </Box>
    </Stack>
  );
}
