"use client";

import {
    Box,
    TextField,
    Stack,
    InputAdornment,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import {
    Search as SearchIcon,
    LocalShipping as ShippingIcon,
    Pending as PendingIcon,
    CheckCircle as DeliveredIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    DirectionsBike as BikeIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

interface DeliveryStats {
    totalPersonnel: number;
    pending: number;
    inTransit: number;
    deliveredToday: number;
}

interface DeliveryHeaderProps {
    view: "personnel" | "deliveries";
    onViewChange: (view: "personnel" | "deliveries") => void;
    onSearch: (query: string) => void;
    stats?: DeliveryStats;
}

export default function DeliveryHeader({
    view,
    onViewChange,
    onSearch,
    stats,
}: DeliveryHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [localStats, setLocalStats] = useState<DeliveryStats | null>(stats || null);
    const [loading, setLoading] = useState(!stats);

    useEffect(() => {
        if (!stats) {
            fetchStats();
        }
    }, [stats]);

    const fetchStats = async () => {
        try {
            const response = await axios.get("/delivery/stats");
            setLocalStats(response.data.stats);
        } catch (error) {
            console.error("Failed to fetch delivery stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value);
    };

    const currentStats = stats || localStats;

    const deliveryStats = [
        {
            id: 1,
            label: "Delivery Personnel",
            value: currentStats?.totalPersonnel?.toString() || "0",
            growth: "+5.2%",
            icon: <PeopleIcon />,
            color: "primary",
        },
        {
            id: 2,
            label: "Pending Deliveries",
            value: currentStats?.pending?.toString() || "0",
            growth: "+2.5%",
            icon: <PendingIcon />,
            color: "warning",
        },
        {
            id: 3,
            label: "In Transit",
            value: currentStats?.inTransit?.toString() || "0",
            growth: "+15.2%",
            icon: <BikeIcon />,
            color: "info",
        },
        {
            id: 4,
            label: "Delivered Today",
            value: currentStats?.deliveredToday?.toString() || "0",
            growth: "+24.8%",
            icon: <DeliveredIcon />,
            color: "success",
        },
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary.main"
                        gutterBottom
                    >
                        Delivery Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track deliveries and manage delivery personnel in real-time.
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, newView) => newView && onViewChange(newView)}
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: "divider",
                        "& .MuiToggleButton-root": {
                            border: "none",
                            px: 3,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            "&:first-of-type": {
                                borderRadius: "12px 0 0 12px",
                            },
                            "&:last-of-type": {
                                borderRadius: "0 12px 12px 0",
                            },
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "primary.dark",
                                },
                            },
                        },
                    }}
                >
                    <ToggleButton value="deliveries">
                        <ShippingIcon sx={{ mr: 1 }} fontSize="small" />
                        Active Deliveries
                    </ToggleButton>
                    <ToggleButton value="personnel">
                        <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
                        Personnel
                    </ToggleButton>
                </ToggleButtonGroup>
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
                        color: "text.tertio",
                    }}
                >
                    <ShippingIcon color="primary" fontSize="small" /> Delivery Summary
                </Typography>
                <Grid container spacing={3}>
                    {deliveryStats.map((stat) => (
                        <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: "16px",
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
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
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                fontWeight="bold"
                                            >
                                                {stat.label}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="baseline"
                                            >
                                                <Typography variant="h6" fontWeight="bold">
                                                    {loading ? "..." : stat.value}
                                                </Typography>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={0.5}
                                                >
                                                    <TrendingUpIcon
                                                        color="success"
                                                        sx={{ fontSize: 14 }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        fontWeight="bold"
                                                        color="success.main"
                                                    >
                                                        {stat.growth}
                                                    </Typography>
                                                </Stack>
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
                placeholder={
                    view === "personnel"
                        ? "Search personnel by name, email, or phone..."
                        : "Search by tracking code, customer, or city..."
                }
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
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
                    },
                }}
            />
        </Box>
    );
}
