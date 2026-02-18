"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, TextField, Button, Stack, Alert, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useExchangeRates, createExchangeRate } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function ExchangeRatesPage() {
    const router = useRouter();
    const { rates, loading, refresh } = useExchangeRates();
    const [fromCurrency, setFromCurrency] = useState("");
    const [rate, setRate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        if (!fromCurrency || fromCurrency.length !== 3 || !rate || parseFloat(rate) <= 0) {
            setError("Veuillez entrer un code devise (3 lettres) et un taux valide.");
            return;
        }
        setSubmitting(true);
        try {
            await createExchangeRate(fromCurrency.toUpperCase(), parseFloat(rate));
            setSuccess(`Taux ${fromCurrency.toUpperCase()} → USD configuré avec succès.`);
            setFromCurrency("");
            setRate("");
            refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la configuration.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: "auto" }}>
            <Button startIcon={<BackIcon />} onClick={() => router.push("/wallets")} sx={{ mb: 3, textTransform: "none", fontWeight: 700 }}>
                Retour aux Wallets
            </Button>

            <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Taux de Change</Typography>

            {/* Form */}
            <Card sx={{ borderRadius: 4, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Configurer un taux</Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                        <TextField
                            label="Devise source (ex: XAF)"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value.toUpperCase().slice(0, 3))}
                            inputProps={{ maxLength: 3 }}
                            sx={{ minWidth: 180 }}
                        />
                        <Typography variant="h6" sx={{ pt: 1.5 }}>→ USD</Typography>
                        <TextField
                            label="Taux"
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="Ex: 0.0016"
                            inputProps={{ min: 0.000001, step: 0.000001 }}
                            sx={{ minWidth: 180 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={submitting}
                            sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none", py: 1.8, px: 4 }}
                        >
                            {submitting ? <CircularProgress size={20} color="inherit" /> : "Enregistrer"}
                        </Button>
                    </Stack>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                </CardContent>
            </Card>

            {/* Active Rates */}
            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ p: 3, pb: 2 }}>Taux actifs</Typography>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress size={24} /></Box>
                    ) : !rates.length ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>Aucun taux configuré</Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800 }}>De</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>Vers</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>Taux</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>Statut</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>Mis à jour</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rates.map((r: any) => (
                                        <TableRow key={r.id} hover>
                                            <TableCell><Typography fontWeight={700}>{r.from_currency}</Typography></TableCell>
                                            <TableCell>{r.to_currency}</TableCell>
                                            <TableCell><Typography fontWeight={700}>{r.rate}</Typography></TableCell>
                                            <TableCell><Chip label={r.is_active ? "Actif" : "Inactif"} color={r.is_active ? "success" : "default"} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                                            <TableCell>{new Date(r.updated_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
