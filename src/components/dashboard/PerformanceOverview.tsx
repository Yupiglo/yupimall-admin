"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/lib/axios";

interface MonthlyData {
    month: string;
    transactions: number;
    revenue: number;
}

export default function PerformanceOverview() {
    const [chartData, setChartData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // For now, initialize with zero data since we don't have monthly stats endpoint yet
                // This will be replaced when we add a proper monthly stats API
                const emptyData: MonthlyData[] = [
                    { month: "Jan", transactions: 0, revenue: 0 },
                    { month: "Fév", transactions: 0, revenue: 0 },
                    { month: "Mar", transactions: 0, revenue: 0 },
                    { month: "Avr", transactions: 0, revenue: 0 },
                    { month: "Mai", transactions: 0, revenue: 0 },
                    { month: "Juin", transactions: 0, revenue: 0 },
                    { month: "Juil", transactions: 0, revenue: 0 },
                    { month: "Août", transactions: 0, revenue: 0 },
                    { month: "Sep", transactions: 0, revenue: 0 },
                    { month: "Oct", transactions: 0, revenue: 0 },
                    { month: "Nov", transactions: 0, revenue: 0 },
                    { month: "Déc", transactions: 0, revenue: 0 },
                ];
                setChartData(emptyData);
            } catch (error) {
                console.error("Failed to fetch performance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const hasData = chartData.some((d) => d.transactions > 0 || d.revenue > 0);

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "#f3f4f6",
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
                        Performance Mensuelle
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        sx={{
                            color: "text.secondary",
                            textTransform: "none",
                            fontSize: "0.75rem",
                        }}
                    >
                        Voir tout
                    </Button>
                </Stack>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 280,
                        }}
                    >
                        <CircularProgress size={32} />
                    </Box>
                ) : !hasData ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 280,
                            bgcolor: "#f9fafb",
                            borderRadius: 3,
                        }}
                    >
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            📊
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Aucune donnée de performance disponible
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            Les statistiques s'afficheront dès les premières transactions
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: "100%", height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                barCategoryGap="25%"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f3f4f6"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                    labelStyle={{ fontWeight: "bold", color: "#374151" }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    wrapperStyle={{ top: 0, right: 0 }}
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span style={{ color: "#6b7280", fontSize: "12px" }}>
                                            {value === "transactions" ? "Transactions" : "Revenus"}
                                        </span>
                                    )}
                                />
                                <Bar
                                    dataKey="transactions"
                                    fill="#8b5cf6"
                                    radius={[4, 4, 0, 0]}
                                    name="transactions"
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#c4b5fd"
                                    radius={[4, 4, 0, 0]}
                                    name="revenue"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
