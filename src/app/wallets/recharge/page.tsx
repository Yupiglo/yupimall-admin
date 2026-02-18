"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, TextField, Button, Stack, Alert,
    CircularProgress, Autocomplete, Chip,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useActiveSellers, rechargeWalletByUser } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function RechargeWalletPage() {
    const router = useRouter();
    const { sellers, loading: sellersLoading } = useActiveSellers();
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRecharge = async () => {
        setError(null);
        setSuccess(null);
        if (!selectedSeller || !amount || parseFloat(amount) <= 0) {
            setError("Veuillez sélectionner un vendeur et entrer un montant valide.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await rechargeWalletByUser(selectedSeller.id, parseFloat(amount));
            setSuccess(`Wallet de ${selectedSeller.name} rechargé ! Nouveau solde: $${parseFloat(res.wallet.balance).toFixed(2)}`);
            setAmount("");
            setSelectedSeller(null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la recharge.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 600, mx: "auto" }}>
            <Button startIcon={<BackIcon />} onClick={() => router.push("/wallets")} sx={{ mb: 3, textTransform: "none", fontWeight: 700 }}>
                Retour aux Wallets
            </Button>

            <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Recharger un Wallet</Typography>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        {sellersLoading ? (
                            <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress size={24} /></Box>
                        ) : sellers.length === 0 ? (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                Aucun vendeur actif. Activez des vendeurs dans la page &quot;Gérer Vendeurs&quot;.
                            </Alert>
                        ) : (
                            <Autocomplete
                                options={sellers}
                                value={selectedSeller}
                                onChange={(_, val) => setSelectedSeller(val)}
                                getOptionLabel={(s: any) =>
                                    `${s.name || s.username || "—"} — ${s.email}`
                                }
                                renderOption={(props, s: any) => (
                                    <li {...props} key={s.id}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight={700} variant="body2">{s.name || s.username}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.email}</Typography>
                                            </Box>
                                            <Chip
                                                label={s.country?.name || "—"}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: "0.65rem" }}
                                            />
                                            {s.wallet_seller_whatsapp && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {s.wallet_seller_whatsapp}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Vendeur à recharger" placeholder="Rechercher par nom..." />
                                )}
                                noOptionsText="Aucun vendeur trouvé"
                                isOptionEqualToValue={(opt: any, val: any) => opt.id === val.id}
                            />
                        )}

                        {selectedSeller && (
                            <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "action.hover" }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography fontWeight={700}>{selectedSeller.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedSeller.email}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedSeller.city || "—"}, {selectedSeller.country?.name || "—"}
                                            </Typography>
                                            {selectedSeller.wallet_seller_whatsapp && (
                                                <Typography variant="body2" fontWeight={600}>
                                                    WhatsApp: {selectedSeller.wallet_seller_whatsapp}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        <TextField
                            label="Montant (USD)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ex: 100.00"
                            fullWidth
                            inputProps={{ min: 0.01, step: 0.01 }}
                        />

                        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>}

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRecharge}
                            disabled={submitting || !selectedSeller}
                            sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: "none" }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : "Recharger"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
