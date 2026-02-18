"use client";

import { useState } from "react";
import { Box, Typography, Card, CardContent, TextField, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAllWallets, rechargeWallet } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function RechargeWalletPage() {
    const router = useRouter();
    const { wallets, loading: walletsLoading } = useAllWallets(1, 100);
    const [selectedWalletId, setSelectedWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRecharge = async () => {
        setError(null);
        setSuccess(null);
        if (!selectedWalletId || !amount || parseFloat(amount) <= 0) {
            setError("Veuillez sélectionner un wallet et entrer un montant valide.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await rechargeWallet(parseInt(selectedWalletId), parseFloat(amount));
            setSuccess(`Wallet rechargé ! Nouveau solde: $${parseFloat(res.wallet.balance).toFixed(2)}`);
            setAmount("");
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
                        <TextField
                            select
                            label="Wallet"
                            value={selectedWalletId}
                            onChange={(e) => setSelectedWalletId(e.target.value)}
                            fullWidth
                            SelectProps={{ native: true }}
                            disabled={walletsLoading}
                        >
                            <option value="">-- Sélectionner un wallet --</option>
                            {wallets?.data?.map((w: any) => (
                                <option key={w.id} value={w.id}>
                                    #{w.id} — {w.user?.name || w.user?.username} ({w.user?.role}) — ${parseFloat(w.balance).toFixed(2)}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            label="Montant (USD)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ex: 100.00"
                            fullWidth
                            inputProps={{ min: 0.01, step: 0.01 }}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRecharge}
                            disabled={submitting}
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
