"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, TextField, Button, Stack, Alert,
    CircularProgress, Autocomplete, Chip, Divider,
} from "@mui/material";
import { ArrowBack as BackIcon, AccountBalanceWallet as WalletIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useActiveSellers, rechargeWalletByUser, useAdminWalletBalance } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function RechargeWalletPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { sellers, loading: sellersLoading } = useActiveSellers();
    const { balance, refresh: refreshBalance } = useAdminWalletBalance();
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [adminAmount, setAdminAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [adminSubmitting, setAdminSubmitting] = useState(false);
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

    const handleRechargeAdmin = async () => {
        setError(null);
        setSuccess(null);
        const amt = parseFloat(adminAmount);
        if (!amt || amt <= 0) {
            setError("Veuillez entrer un montant valide.");
            return;
        }
        const adminId = (session?.user as any)?.id;
        if (!adminId) {
            setError("Session invalide. Reconnectez-vous.");
            return;
        }
        setAdminSubmitting(true);
        try {
            const res = await rechargeWalletByUser(Number(adminId), amt);
            setSuccess(`Votre wallet admin rechargé ! Nouveau solde: $${parseFloat(res.wallet.balance).toFixed(2)}`);
            setAdminAmount("");
            refreshBalance();
            if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("walletBalanceUpdated"));
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la recharge.");
        } finally {
            setAdminSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 600, mx: "auto" }}>
            <Button startIcon={<BackIcon />} onClick={() => router.push("/wallets")} sx={{ mb: 3, textTransform: "none", fontWeight: 700 }}>
                Retour aux Wallets
            </Button>

            <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Recharger un Wallet</Typography>

            {/* Recharger mon wallet admin */}
            <Card sx={{ borderRadius: 4, mb: 3, border: "2px solid", borderColor: "primary.main" }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <WalletIcon color="primary" />
                        <Typography variant="h6" fontWeight={800}>Recharger mon wallet admin</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Solde actuel: <strong>${parseFloat(String(balance ?? 0)).toFixed(2)}</strong>
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                        <TextField
                            label="Montant (USD)"
                            type="number"
                            value={adminAmount}
                            onChange={(e) => setAdminAmount(e.target.value)}
                            placeholder="Ex: 500.00"
                            sx={{ minWidth: 140 }}
                            inputProps={{ min: 0.01, step: 0.01 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleRechargeAdmin}
                            disabled={adminSubmitting}
                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                        >
                            {adminSubmitting ? <CircularProgress size={20} color="inherit" /> : "Recharger mon wallet"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>Recharger un vendeur</Typography>

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
