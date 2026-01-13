"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    IconButton,
    Avatar,
    CircularProgress,
} from "@mui/material";
import { NorthEast as ArrowIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface Product {
    _id: string;
    title: string;
    price: number;
    sold: number;
    imgCover?: string;
}

export default function TopProductSales() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get("products");
                const allProducts = response.data.products || [];
                // Sort by sold descending and take top 5
                const sorted = allProducts
                    .sort((a: Product, b: Product) => (b.sold || 0) - (a.sold || 0))
                    .slice(0, 5);
                setProducts(sorted);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getProductEmoji = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("phone") || lower.includes("téléphone")) return "📱";
        if (lower.includes("laptop") || lower.includes("ordi")) return "💻";
        if (lower.includes("watch") || lower.includes("montre")) return "⌚";
        if (lower.includes("clothes") || lower.includes("vêtement")) return "👕";
        if (lower.includes("shoe") || lower.includes("chaussure")) return "👟";
        return "📦";
    };

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid #f3f4f6",
                boxShadow: "none",
                height: "100%",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Top Produits Vendus
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => router.push("/products")}
                        sx={{
                            color: "text.secondary",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            "&:hover": { color: "primary.main" },
                        }}
                    >
                        Voir tout
                    </Button>
                </Stack>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : products.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            py: 4,
                            bgcolor: "#f9fafb",
                            borderRadius: 3,
                        }}
                    >
                        <Typography sx={{ fontSize: "2rem", mb: 1 }}>📦</Typography>
                        <Typography color="text.secondary" variant="body2">
                            Aucun produit vendu pour le moment
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {products.map((product, index) => (
                            <Stack
                                key={product._id}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    py: 1.5,
                                    borderBottom: "1px solid #f9fafb",
                                    "&:last-child": { borderBottom: "none" },
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={
                                            product.imgCover
                                                ? product.imgCover.startsWith("http")
                                                    ? product.imgCover
                                                    : `${process.env.NEXT_PUBLIC_API_URL}/${product.imgCover}`
                                                : undefined
                                        }
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "#f3f4f6",
                                            fontSize: "1.25rem",
                                        }}
                                    >
                                        {getProductEmoji(product.title)}
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                            color="text.primary"
                                            sx={{
                                                maxWidth: 180,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {product.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: #{product._id.slice(-6)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ minWidth: 70 }}
                                    >
                                        {product.price?.toLocaleString()} FCFA
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ minWidth: 60 }}
                                    >
                                        <strong>{product.sold || 0}</strong> vendus
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => router.push(`/products/${product._id}`)}
                                        sx={{
                                            bgcolor: index === 0 ? "#3b82f6" : "#f3f4f6",
                                            color: index === 0 ? "white" : "#6b7280",
                                            width: 32,
                                            height: 32,
                                            "&:hover": {
                                                bgcolor: index === 0 ? "#2563eb" : "#e5e7eb",
                                            },
                                        }}
                                    >
                                        <ArrowIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
