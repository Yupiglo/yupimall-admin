"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Inventory as ProductIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Storage as StockIcon,
  QrCode as SkuIcon,
} from "@mui/icons-material";

const products = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    category: "Clothing",
    sku: "JKT-001",
    price: "$129.99",
    stock: 45,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=200&h=200&fit=crop",
    description:
      "High-quality genuine leather jacket with a classic finish and durable zippers.",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Mock finding product by ID
  const product = products.find((p) => p.id.toString() === id) || products[0];

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
            Product Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Viewing inventory levels and product specifications.
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
          Edit Product
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
                src={product.image}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Chip
                  label={product.status}
                  color={product.status === "Active" ? "success" : "warning"}
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
                  Specifications
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
                        SKU
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                      >
                        {product.sku}
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
                        Category
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {product.category}
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
                label: "Unit Price",
                value: product.price,
                icon: <PriceIcon />,
                color: "success.main",
              },
              {
                label: "Current Stock",
                value: product.stock,
                icon: <StockIcon />,
                color: "primary.main",
              },
              {
                label: "Stock Value",
                value: `$${(
                  parseFloat(product.price.replace("$", "")) * product.stock
                ).toFixed(2)}`,
                icon: <SpentIcon />,
                color: "info.main",
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
                    Product Description
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mt: 4, mb: 1 }}
                  >
                    Inventory History
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
                      Full inventory transaction logs will appear here.
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
import { MonetizationOn as SpentIcon } from "@mui/icons-material";
