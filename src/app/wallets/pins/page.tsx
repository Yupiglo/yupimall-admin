"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, Button, CircularProgress, Stack, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";
import { ArrowBack as BackIcon, Undo as RefundIcon } from "@mui/icons-material";
import { useAllPins, refundPin } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { color: "success" | "default" | "error" | "info"; label: string }> = {
    active: { color: "success", label: "Actif" },
    used: { color: "default", label: "Utilisé" },
    expired: { color: "error", label: "Expiré" },
    refunded: { color: "info", label: "Remboursé" },
};

export default function PinsManagementPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const { pins, loading, error, refresh } = useAllPins(page, 25, undefined, statusFilter || undefined);
    const [refundDialog, setRefundDialog] = useState<{ pin: any } | null>(null);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [refundError, setRefundError] = useState<string | null>(null);

    const handleRefund = async () => {
        if (!refundDialog?.pin) return;
        setSubmitting(true);
        setRefundError(null);
        try {
            await refundPin(refundDialog.pin.id, reason || undefined);
            setRefundDialog(null);
            setReason("");
            refresh();
        } catch (err: any) {
            setRefundError(err.response?.data?.message || "Erreur lors du remboursement.");
        } finally {
            setSubmitting(false);
        }
    };

    const canRefund = (pin: any) => pin.status === "active" || pin.status === "expired";

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Button startIcon={<BackIcon />} onClick={() => router.push("/wallets")} sx={{ mb: 3, textTransform: "none", fontWeight: 700 }}>
                Retour aux Wallets
            </Button>

            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={900}>PINs – Remboursements manuels</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Filtrer par statut</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Filtrer par statut"
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="">Tous</MenuItem>
                        <MenuItem value="active">Actifs</MenuItem>
                        <MenuItem value="expired">Expirés</MenuItem>
                        <MenuItem value="used">Utilisés</MenuItem>
                        <MenuItem value="refunded">Remboursés</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Lorsqu&apos;un PIN n&apos;a pas pu être utilisé (erreur, expiration avant utilisation) et que le wallet du vendeur a été défalqué,
                vous pouvez rembourser manuellement le montant. Le vendeur pourra alors générer un nouveau PIN.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress /></Box>
                    ) : !pins?.data?.length ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>Aucun PIN trouvé</Typography>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Code</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Vendeur</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Montant</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Utilisé</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Statut</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Créé</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pins.data.map((pin: any) => {
                                            const cfg = statusConfig[pin.status] || statusConfig.expired;
                                            return (
                                                <TableRow key={pin.id} hover>
                                                    <TableCell>
                                                        <Typography fontFamily="monospace" fontWeight={700} letterSpacing={2}>{pin.code}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={700}>{pin.seller?.name || pin.seller?.username || "—"}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{pin.seller?.email}</Typography>
                                                    </TableCell>
                                                    <TableCell>${parseFloat(pin.amount).toFixed(2)}</TableCell>
                                                    <TableCell>${parseFloat(pin.amount_used || 0).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700, fontSize: "0.7rem" }} />
                                                    </TableCell>
                                                    <TableCell>{new Date(pin.created_at).toLocaleString("fr-FR")}</TableCell>
                                                    <TableCell align="right">
                                                        {canRefund(pin) && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="warning"
                                                                startIcon={<RefundIcon />}
                                                                onClick={() => setRefundDialog({ pin })}
                                                                sx={{ textTransform: "none", fontWeight: 700 }}
                                                            >
                                                                Rembourser
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={pins.total}
                                page={page - 1}
                                onPageChange={(_, p) => setPage(p + 1)}
                                rowsPerPage={pins.per_page}
                                rowsPerPageOptions={[]}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!refundDialog} onClose={() => !submitting && setRefundDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Rembourser ce PIN ?</DialogTitle>
                <DialogContent>
                    {refundDialog?.pin && (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Typography>
                                Code: <strong>{refundDialog.pin.code}</strong> — Montant: <strong>${parseFloat(refundDialog.pin.amount).toFixed(2)}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Le montant sera recrédité au wallet du vendeur {refundDialog.pin.seller?.name || ""}.
                            </Typography>
                            <TextField
                                label="Raison (optionnel)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Ex: PIN expiré avant utilisation, erreur lors du checkout"
                            />
                            {refundError && <Alert severity="error">{refundError}</Alert>}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRefundDialog(null)} disabled={submitting}>Annuler</Button>
                    <Button variant="contained" color="warning" onClick={handleRefund} disabled={submitting}>
                        {submitting ? <CircularProgress size={20} /> : "Rembourser"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
