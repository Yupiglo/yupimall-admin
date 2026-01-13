"use client";

import { Box, Card, CardContent, Typography, Stack, Avatar } from "@mui/material";
import React from "react";

const countries = [
    { name: "Germany", products: "4.4k", flag: "🇩🇪" },
    { name: "France", products: "3.6k", flag: "🇫🇷" },
    { name: "Italy", products: "3.1k", flag: "🇮🇹" },
    { name: "Austria", products: "2.9k", flag: "🇦🇹" },
    { name: "Switzerland", products: "2.7k", flag: "🇨🇭" },
    { name: "Spain", products: "1.2k", flag: "🇪🇸" },
];

export default function CountrySales() {
    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Sales by Country</Typography>
                    <Typography variant="caption" sx={{ cursor: "pointer", color: "primary.main", fontWeight: "bold" }}>View All</Typography>
                </Stack>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                    {countries.map((country) => (
                        <Box
                            key={country.name}
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.default",
                            }}
                        >
                            <Typography sx={{ fontSize: "20px", mb: 1 }}>{country.flag}</Typography>
                            <Typography variant="subtitle2" fontWeight="bold">{country.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>{country.products}</Box> products
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
