"use client";

import {
    Stack,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    CircularProgress,
} from "@mui/material";
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    PersonAdd as PendingIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    Assignment as AllIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";

interface RegistrationsHeaderProps {
    onSearch: (query: string) => void;
    onRefresh: () => void;
}

interface RegStats {
    total: number;
    pending: number;
    approved: number;
}

export default function RegistrationsHeader({
    onSearch,
    onRefresh,
}: RegistrationsHeaderProps) {
    const [stats, setStats] = useState<RegStats>({ total: 0, pending: 0, approved: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("registrations");
            const regs = response.data.registrations || [];
            setStats({
                total: regs.length,
                pending: regs.filter((r: any) => r.status === "pending").length,
                approved: regs.filter((r: any) => r.status === "approved").length,
            });
        } catch (err) {
            console.error("Failed to fetch registration stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Inscriptions", value: stats.total, icon: <AllIcon />, color: "primary" },
        { label: "En attente", value: stats.pending, icon: <PendingIcon />, color: "warning" },
        { label: "Approuvées", value: stats.approved, icon: <ApprovedIcon />, color: "success" },
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                        Inscriptions
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gérez et validez les demandes d'adhésion des nouveaux partenaires.
                    </Typography>
                </Box>

                <Tooltip title="Actualiser les données">
                    <IconButton
                        onClick={() => { fetchStats(); onRefresh(); }}
                        sx={{
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "12px",
                            p: 1.5,
                            "&:hover": { bgcolor: "primary.light", color: "primary.main" }
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "1rem",
                        color: "text.primary"
                    }}
                >
                    <AllIcon color="primary" fontSize="small" /> Résumé des inscriptions
                </Typography>
                <Grid container spacing={3}>
                    {statCards.map((stat, index) => (
                        <Grid key={index} size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "12px",
                                                bgcolor: `${stat.color}.main`,
                                                color: "white",
                                            }}
                                        >
                                            {stat.icon}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: "block", mb: 0.5 }}>
                                                {stat.label}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                                {loading ? <CircularProgress size={20} /> : (
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {stat.value}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <TextField
                fullWidth
                placeholder="Rechercher par nom, email ou pack..."
                onChange={(e) => onSearch(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                            borderColor: "primary.main",
                        }
                    },
                }}
            />
        </Box>
    );
}
