"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, TextField, Button, Stack, Alert,
    CircularProgress, Autocomplete, Chip,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAllWallets, rechargeWallet } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

const SELLER_ROLES = ["stockist", "member", "distributor"];

export default function RechargeWalletPage() {
    const router = useRouter();
    const { wallets, loading: walletsLoading } = useAllWallets(1, 200);
    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const sellerWallets = wallets?.data?.filter((w: any) =>
        SELLER_ROLES.includes(w.user?.role?.toLowerCase())
    ) || [];

    const handleRecharge = async () => {
        setError(null);
        setSuccess(null);
        if (!selectedWallet || !amount || parseFloat(amount) <= 0) {
            setError("Veuillez sélectionner un vendeur et entrer un montant valide.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await rechargeWallet(selectedWallet.id, parseFloat(amount));
            setSuccess(`Wallet de ${selectedWallet.user?.name} rechargé ! Nouveau solde: $${parseFloat(res.wallet.balance).toFixed(2)}`);
            setAmount("");
            setSelectedWallet(null);
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
                        {walletsLoading ? (
                            <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress size={24} /></Box>
                        ) : (
                            <Autocomplete
                                options={sellerWallets}
                                value={selectedWallet}
                                onChange={(_, val) => setSelectedWallet(val)}
                                getOptionLabel={(w: any) =>
                                    `${w.user?.name || w.user?.username || "—"} — ${w.user?.role} — $${parseFloat(w.balance).toFixed(2)}`
                                }
                                renderOption={(props, w: any) => (
                                    <li {...props} key={w.id}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight={700} variant="body2">{w.user?.name || w.user?.username}</Typography>
                                                <Typography variant="caption" color="text.secondary">{w.user?.email}</Typography>
                                            </Box>
                                            <Chip label={w.user?.role} size="small" sx={{ fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase" }} />
                                            <Typography fontWeight={800} variant="body2" color="success.main">
                                                ${parseFloat(w.balance).toFixed(2)}
                                            </Typography>
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

                        {selectedWallet && (
                            <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "action.hover" }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography fontWeight={700}>{selectedWallet.user?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedWallet.user?.email} — {selectedWallet.user?.role}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="body2" color="text.secondary">Solde actuel</Typography>
                                            <Typography fontWeight={900} color="success.main">
                                                ${parseFloat(selectedWallet.balance).toFixed(2)}
                                            </Typography>
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
                            disabled={submitting || !selectedWallet}
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
