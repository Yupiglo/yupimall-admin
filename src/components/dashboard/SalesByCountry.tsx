"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

// Country flag mapping
const countryFlags: Record<string, string> = {
    Togo: "🇹🇬",
    Cameroon: "🇨🇲",
    Cameroun: "🇨🇲",
    Nigeria: "🇳🇬",
    Benin: "🇧🇯",
    Bénin: "🇧🇯",
    "Ivory Coast": "🇨🇮",
    "Côte d'Ivoire": "🇨🇮",
    Senegal: "🇸🇳",
    Sénégal: "🇸🇳",
    Congo: "🇨🇬",
    Gabon: "🇬🇦",
    Ghana: "🇬🇭",
    Mali: "🇲🇱",
    "Burkina Faso": "🇧🇫",
    Niger: "🇳🇪",
    Guinea: "🇬🇳",
    Guinée: "🇬🇳",
    Chad: "🇹🇩",
    Tchad: "🇹🇩",
    Rwanda: "🇷🇼",
    Kenya: "🇰🇪",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Allemagne: "🇩🇪",
    "United States": "🇺🇸",
    USA: "🇺🇸",
    Unknown: "🌍",
};

interface CountryStats {
    country: string;
    ordersCount: number;
    totalRevenue: number;
}

export default function SalesByCountry() {
    const [open, setOpen] = useState(false);
    const [countries, setCountries] = useState<CountryStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("admin/sales-by-country");
                setCountries(response.data.salesByCountry || []);
            } catch (error) {
                console.error("Failed to fetch sales by country:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getFlag = (country: string) => countryFlags[country] || "🌍";

    const formatRevenue = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return value.toString();
    };

    const primaryCountries = countries.slice(0, 6);

    const CountryCard = ({
        country,
        compact = false,
    }: {
        country: CountryStats;
        compact?: boolean;
    }) => (
        <Box
            sx={{
                p: compact ? 1.5 : 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "#f3f4f6",
                bgcolor: "background.paper",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                    borderColor: "#e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                },
            }}
        >
            <Typography
                sx={{
                    fontSize: compact ? "1.5rem" : "1.75rem",
                    lineHeight: 1,
                    mb: 1,
                }}
            >
                {getFlag(country.country)}
            </Typography>
            <Typography
                variant="body2"
                fontWeight="medium"
                color="text.primary"
                sx={{ mb: 0.5, fontSize: compact ? "0.75rem" : "0.875rem" }}
            >
                {country.country}
            </Typography>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: compact ? "0.65rem" : "0.75rem" }}
            >
                <strong>{formatRevenue(country.totalRevenue)}</strong> FCFA
            </Typography>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontSize: compact ? "0.6rem" : "0.7rem" }}
            >
                {country.ordersCount} commande(s)
            </Typography>
        </Box>
    );

    if (loading) {
        return (
            <Card
                sx={{
                    borderRadius: 4,
                    border: "1px solid #f3f4f6",
                    boxShadow: "none",
                    height: "100%",
                }}
            >
                <CardContent
                    sx={{
                        p: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 200,
                    }}
                >
                    <CircularProgress size={32} />
                </CardContent>
            </Card>
        );
    }

    return (
        <>
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
                            Ventes par pays
                        </Typography>
                        {countries.length > 6 && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleOpen}
                                sx={{
                                    color: "text.secondary",
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                    "&:hover": { color: "primary.main" },
                                }}
                            >
                                Voir tout
                            </Button>
                        )}
                    </Stack>

                    {primaryCountries.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>
                            Aucune vente enregistrée
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 2,
                            }}
                        >
                            {primaryCountries.map((country) => (
                                <CountryCard key={country.country} country={country} />
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* View All Modal */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, maxHeight: "80vh" } }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Tous les pays ({countries.length})
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(3, 1fr)",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {countries.map((country) => (
                            <CountryCard key={country.country} country={country} compact />
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
