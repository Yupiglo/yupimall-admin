"use client";

import { use, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Inventory as ProductIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Storage as StockIcon,
  QrCode as SkuIcon,
  Percent as PercentIcon,
  Stars as PvIcon,
  MonetizationOn as SpentIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  quantity: number; // API uses quantity
  category?: { name: string } | string;
  subcategoryName?: string;
  description: string;
  imgCover?: string;
  sku?: string;
  pv?: number;
  discountPercentage?: number;
  status?: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { selectedCurr } = useContext(CurrencyContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`products/${id}`);
        // Adjust depending on API response structure. Usually getSpecificProduct or just data.
        const data = response.data.getSpecificProduct || response.data.product || response.data;
        if (data) {
          // Map some fields if necessary
          setProduct({
            ...data,
            stock: data.quantity ?? data.stock, // Ensure stock is set
          });
        } else {
          setError("Produit introuvable");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || "Produit introuvable"}</Alert>
        <Button onClick={() => router.push("/products")} sx={{ mt: 2 }}>Retour</Button>
      </Box>
    );
  }

  // Helper to format price
  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * selectedCurr.value;
    if (selectedCurr.symbol === "FCFA" || selectedCurr.symbol === "₦") {
      return `${Math.round(converted).toLocaleString()} ${selectedCurr.symbol}`;
    }
    return `${selectedCurr.symbol}${converted.toFixed(2)}`;
  };

  // Helper to resolve image
  const getImageUrl = (img?: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  };

  const quantity = product.quantity || 0;
  const statusLabel = quantity === 0 ? "Rupture" : quantity < 10 ? "Stock bas" : "En stock";
  const statusColor = quantity === 0 ? "error" : quantity < 10 ? "warning" : "success";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/products")}
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
            Détails du Produit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualisation des stocks et spécifications.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/products/${id}/edit`)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Modifier
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={getImageUrl(product.imgCover)}
                sx={{
                  width: "100%",
                  height: 350,
                  objectFit: "contain",
                  bgcolor: "background.neutral"
                }}
              />
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {product.title}
                </Typography>
                <Chip
                  label={statusLabel}
                  color={statusColor}
                  size="small"
                  sx={{ fontWeight: "bold", borderRadius: "6px" }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Spécifications
                </Typography>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <SkuIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        SKU / ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                      >
                        {product.sku || product._id.slice(-6).toUpperCase()}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CategoryIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Catégorie
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                        {product.subcategoryName ? ` > ${product.subcategoryName}` : ''}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {[
              {
                label: "Prix Unitaire",
                value: formatPrice(product.price),
                icon: <PriceIcon />,
                color: "success.main",
              },
              {
                label: "Stock Actuel",
                value: product.quantity,
                icon: <StockIcon />,
                color: "primary.main",
              },
              {
                label: "Valeur du Stock",
                value: formatPrice(product.price * product.quantity),
                icon: <SpentIcon />,
                color: "info.main",
              },
              {
                label: "Points Volume (PV)",
                value: `${product.pv || 0} PV`,
                icon: <PvIcon />,
                color: "warning.main",
              },
              {
                label: "Réduction",
                value: `${product.discountPercentage || 0}%`,
                icon: <PercentIcon />,
                color: "error.main",
              },
            ].map((stat, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: stat.color, display: "flex" }}>
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Description du Produit
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    {product.description || "Aucune description disponible."}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mt: 4, mb: 1 }}
                  >
                    Historique d'inventaire
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "rgba(0,0,0,0.02)",
                      borderRadius: "12px",
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Les logs de transaction complets apparaîtront ici.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
