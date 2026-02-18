"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, CircularProgress, Stack, Chip, Switch,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from "@mui/material";
import { useEligibleSellers, toggleWalletSeller } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function WalletSellersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const { data, loading, refresh } = useEligibleSellers(page, 30, search);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [whatsapp, setWhatsapp] = useState("");
    const [toggling, setToggling] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const handleToggle = (user: any) => {
        setSelectedUser(user);
        setWhatsapp(user.wallet_seller_whatsapp || "");
        setDialogOpen(true);
    };

    const confirmToggle = async () => {
        if (!selectedUser) return;
        setToggling(true);
        try {
            const newStatus = !selectedUser.is_wallet_seller;
            await toggleWalletSeller(selectedUser.id, newStatus, newStatus ? whatsapp : "");
            setFeedback({ type: "success", msg: newStatus ? `${selectedUser.name} activé comme vendeur.` : `${selectedUser.name} désactivé comme vendeur.` });
            setDialogOpen(false);
            refresh();
        } catch (e: any) {
            setFeedback({ type: "error", msg: e?.response?.data?.message || "Erreur lors de la mise à jour." });
        } finally {
            setToggling(false);
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
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Action</TableCell>
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
                                                    <Button
                                                        variant={u.is_wallet_seller ? "outlined" : "contained"}
                                                        color={u.is_wallet_seller ? "error" : "success"}
                                                        size="small"
                                                        onClick={() => handleToggle(u)}
                                                        sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none", minWidth: 100 }}
                                                    >
                                                        {u.is_wallet_seller ? "Désactiver" : "Activer"}
                                                    </Button>
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
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
                    <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>Annuler</Button>
                    <Button
                        variant="contained"
                        color={selectedUser?.is_wallet_seller ? "error" : "success"}
                        onClick={confirmToggle}
                        disabled={toggling}
                        sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}
                    >
                        {toggling ? <CircularProgress size={20} /> : selectedUser?.is_wallet_seller ? "Désactiver" : "Activer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
