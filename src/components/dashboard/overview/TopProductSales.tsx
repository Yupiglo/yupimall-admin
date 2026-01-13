"use client";

import { Box, Card, CardContent, Typography, Stack, Avatar, IconButton, Divider } from "@mui/material";
import React from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const products = [
    { name: "Vitamin Boost", sku: "SP00910SK", price: "$8/item", sold: "2.3k sold", icon: "💊", active: true },
    { name: "Organic Protein Bar", sku: "SP00910SK", price: "$3/item", sold: "1.2k sold", icon: "🍫", active: false },
    { name: "Pain Relief Cream", sku: "SP00910SK", price: "$5/item", sold: "1.1k sold", icon: "🧴", active: false },
];

export default function TopProductSales() {
    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Top Product Sales</Typography>
                    <Typography variant="caption" sx={{ cursor: "pointer", color: "primary.main", fontWeight: "bold" }}>View All</Typography>
                </Stack>
                <Stack spacing={2}>
                    {products.map((product, index) => (
                        <React.Fragment key={index}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box sx={{
                                        width: 48, height: 48, borderRadius: "12px", bgcolor: "background.default",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                                    }}>
                                        {product.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">{product.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">SKU: {product.sku}</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={4}>
                                    <Box sx={{ bgcolor: "background.default", px: 1.5, py: 0.5, borderRadius: "8px" }}>
                                        <Typography variant="caption" fontWeight="bold">{product.price}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight="bold">{product.sold}</Typography>
                                    <Avatar sx={{
                                        width: 32, height: 32, bgcolor: product.active ? "primary.main" : "transparent",
                                        color: product.active ? "white" : "text.secondary",
                                        border: product.active ? "none" : "1px solid",
                                        borderColor: "divider",
                                        cursor: "pointer"
                                    }}>
                                        <ArrowOutwardIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                </Stack>
                            </Stack>
                            {index < products.length - 1 && <Divider sx={{ borderStyle: "dashed" }} />}
                        </React.Fragment>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
