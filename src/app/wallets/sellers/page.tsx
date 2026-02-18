"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, CircularProgress, Stack, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, IconButton, Tooltip,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useEligibleSellers, toggleWalletSeller } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

type DialogMode = "toggle" | "edit";

export default function WalletSellersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const { data, loading, refresh } = useEligibleSellers(page, 30, search);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<DialogMode>("toggle");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [whatsapp, setWhatsapp] = useState("");
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const openToggleDialog = (user: any) => {
        setSelectedUser(user);
        setWhatsapp(user.wallet_seller_whatsapp || "");
        setDialogMode("toggle");
        setDialogOpen(true);
    };

    const openEditDialog = (user: any) => {
        setSelectedUser(user);
        setWhatsapp(user.wallet_seller_whatsapp || "");
        setDialogMode("edit");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const confirmToggle = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const newStatus = !selectedUser.is_wallet_seller;
            await toggleWalletSeller(selectedUser.id, newStatus, newStatus ? whatsapp : "");
            setFeedback({ type: "success", msg: newStatus ? `${selectedUser.name} activé comme vendeur.` : `${selectedUser.name} désactivé comme vendeur.` });
            closeDialog();
            refresh();
        } catch (e: any) {
            setFeedback({ type: "error", msg: e?.response?.data?.message || "Erreur lors de la mise à jour." });
        } finally {
            setSaving(false);
        }
    };

    const confirmEdit = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            await toggleWalletSeller(selectedUser.id, selectedUser.is_wallet_seller, whatsapp);
            setFeedback({ type: "success", msg: `Informations de ${selectedUser.name} mises à jour.` });
            closeDialog();
            refresh();
        } catch (e: any) {
            setFeedback({ type: "error", msg: e?.response?.data?.message || "Erreur lors de la mise à jour." });
        } finally {
            setSaving(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        setSearch(searchInput);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={900}>Gestion des Vendeurs Wallet</Typography>
                <Button variant="outlined" onClick={() => router.push("/wallets")} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                    Retour aux Wallets
                </Button>
            </Stack>

            {feedback && (
                <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ mb: 3, borderRadius: 3 }}>
                    {feedback.msg}
                </Alert>
            )}

            <Card sx={{ borderRadius: 4, mb: 3 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="Rechercher (nom, email, username)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            size="small"
                            sx={{ minWidth: 300 }}
                        />
                        <Button variant="contained" onClick={handleSearch} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                            Rechercher
                        </Button>
                        {search && (
                            <Button variant="text" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} sx={{ textTransform: "none" }}>
                                Effacer
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress /></Box>
                    ) : !data?.data?.length ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>Aucun utilisateur éligible trouvé</Typography>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Nom</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Rôle</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Pays / Ville</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>WhatsApp</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Vendeur actif</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.data.map((u: any) => (
                                            <TableRow key={u.id} hover>
                                                <TableCell>
                                                    <Typography fontWeight={700}>{u.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{u.username}</Typography>
                                                </TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <Chip label={u.role} size="small" sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase" }} />
                                                </TableCell>
                                                <TableCell>
                                                    {u.country?.name || "—"}{u.city ? ` / ${u.city}` : ""}
                                                </TableCell>
                                                <TableCell>{u.wallet_seller_whatsapp || "—"}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={u.is_wallet_seller ? "Oui" : "Non"}
                                                        color={u.is_wallet_seller ? "success" : "default"}
                                                        size="small"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        {u.is_wallet_seller && (
                                                            <Tooltip title="Modifier les infos vendeur">
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => openEditDialog(u)}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Button
                                                            variant={u.is_wallet_seller ? "outlined" : "contained"}
                                                            color={u.is_wallet_seller ? "error" : "success"}
                                                            size="small"
                                                            onClick={() => openToggleDialog(u)}
                                                            sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none", minWidth: 100 }}
                                                        >
                                                            {u.is_wallet_seller ? "Désactiver" : "Activer"}
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={data.total}
                                page={page - 1}
                                onPageChange={(_, p) => setPage(p + 1)}
                                rowsPerPage={data.per_page}
                                rowsPerPageOptions={[]}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Toggle Dialog */}
            <Dialog open={dialogOpen && dialogMode === "toggle"} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    {selectedUser?.is_wallet_seller ? "Désactiver le vendeur" : "Activer comme vendeur"}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) — {selectedUser?.role}
                    </Typography>
                    {!selectedUser?.is_wallet_seller && (
                        <TextField
                            label="Numéro WhatsApp du vendeur"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            fullWidth
                            placeholder="+243 XXX XXX XXX"
                            sx={{ mt: 1 }}
                        />
                    )}
                    {selectedUser?.is_wallet_seller && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            Ce vendeur ne sera plus visible pour les consommateurs au checkout.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} sx={{ textTransform: "none" }}>Annuler</Button>
                    <Button
                        variant="contained"
                        color={selectedUser?.is_wallet_seller ? "error" : "success"}
                        onClick={confirmToggle}
                        disabled={saving}
                        sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}
                    >
                        {saving ? <CircularProgress size={20} /> : selectedUser?.is_wallet_seller ? "Désactiver" : "Activer"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen && dialogMode === "edit"} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    Modifier le vendeur
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 3 }}>
                            <Typography variant="body2" color="text.secondary">Vendeur</Typography>
                            <Typography fontWeight={700}>{selectedUser?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{selectedUser?.email} — {selectedUser?.role}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedUser?.country?.name || "—"}{selectedUser?.city ? ` / ${selectedUser.city}` : ""}
                            </Typography>
                        </Box>
                        <TextField
                            label="Numéro WhatsApp"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            fullWidth
                            placeholder="+243 XXX XXX XXX"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} sx={{ textTransform: "none" }}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={confirmEdit}
                        disabled={saving}
                        sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}
                    >
                        {saving ? <CircularProgress size={20} /> : "Enregistrer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
