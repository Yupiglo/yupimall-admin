"use client";

import { Box, Card, CardContent, Typography, Stack, Avatar, Divider, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

export default function TopProductSales() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get("products");
                const allProducts = response.data?.products?.data || response.data?.products || response.data?.data || response.data || [];
                const sorted = (Array.isArray(allProducts) ? allProducts : [])
                    .sort((a: any, b: any) => (b.sold_count || b.order_count || 0) - (a.sold_count || a.order_count || 0))
                    .slice(0, 5);
                setProducts(sorted);
            } catch (err) {
                console.error("Failed to load top products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const formatSold = (count: number) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k vendus`;
        return `${count} vendus`;
    };

    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Top Ventes Produits</Typography>
                    <Typography
                        variant="caption"
                        component={Link}
                        href="/products"
                        sx={{ cursor: "pointer", color: "primary.main", fontWeight: "bold", textDecoration: "none" }}
                    >
                        Voir tout
                    </Typography>
                </Stack>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : products.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        Aucun produit
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {products.map((product, index) => (
                            <React.Fragment key={product.id || index}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar
                                            variant="rounded"
                                            src={product.image || product.images?.[0] || undefined}
                                            sx={{
                                                width: 48, height: 48, borderRadius: "12px",
                                                bgcolor: "background.default", fontSize: "24px",
                                            }}
                                        >
                                            {(product.name || product.title)?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {product.name || product.title}
                                            </Typography>
                                            {product.sku && (
                                                <Typography variant="caption" color="text.secondary">
                                                    SKU: {product.sku}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={4}>
                                        <Box sx={{ bgcolor: "background.default", px: 1.5, py: 0.5, borderRadius: "8px" }}>
                                            <Typography variant="caption" fontWeight="bold">
                                                ${product.price || product.sale_price || 0}
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {formatSold(product.sold_count || product.order_count || 0)}
                                        </Typography>
                                        <Avatar
                                            component={Link}
                                            href={`/products/${product.id}`}
                                            sx={{
                                                width: 32, height: 32, bgcolor: index === 0 ? "primary.main" : "transparent",
                                                color: index === 0 ? "white" : "text.secondary",
                                                border: index === 0 ? "none" : "1px solid",
                                                borderColor: "divider", cursor: "pointer", textDecoration: "none",
                                            }}
                                        >
                                            <ArrowOutwardIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                    </Stack>
                                </Stack>
                                {index < products.length - 1 && <Divider sx={{ borderStyle: "dashed" }} />}
                            </React.Fragment>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
