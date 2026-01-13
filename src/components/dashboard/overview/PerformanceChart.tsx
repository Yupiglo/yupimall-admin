"use client";

import { Box, Card, CardContent, Typography, Stack, useTheme } from "@mui/material";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const data = [
    { name: "Jan", transactions: 150, revenue: 2400 },
    { name: "Mar", transactions: 235, revenue: 3400 },
    { name: "May", transactions: 110, revenue: 1200 },
    { name: "Jul", transactions: 235, revenue: 3400 },
    { name: "Sep", transactions: 180, revenue: 2100 },
    { name: "Nov", transactions: 210, revenue: 2900 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Jul 2024</Typography>
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                        <Typography variant="caption" color="text.secondary">Total Transaction</Typography>
                        <Typography variant="caption" fontWeight="bold">235</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                        <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
                        <Typography variant="caption" fontWeight="bold">$3.4k</Typography>
                    </Stack>
                </Stack>
            </Box>
        );
    }
    return null;
};

export default function PerformanceChart() {
    const theme = useTheme();

    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Performance Overview</Typography>
                    <Typography variant="caption" sx={{ cursor: "pointer", color: "primary.main", fontWeight: "bold" }}>View All</Typography>
                </Stack>
                <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar
                                dataKey="revenue"
                                fill="#707ce5"
                                radius={[6, 6, 6, 6]}
                                barSize={40}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 3 ? "#707ce5" : "rgba(112, 124, 229, 0.2)"} />
                                ))}
                            </Bar>
                            <Bar
                                dataKey="revenue"
                                fill="#707ce5"
                                radius={[6, 6, 6, 6]}
                                barSize={40}
                                opacity={0.3}
                                style={{ transform: 'translateY(-10px)' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
